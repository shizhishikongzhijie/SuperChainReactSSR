const fs = require('fs');
const path = require('path');
const express = require('express');

//---------webpack------
//const webpack = require('webpack');
// const webpackConfig = require('../../webpack.config.js');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const webpackHotMiddleware = require('webpack-hot-middleware');
// const compiler = webpack(webpackConfig);
//-----------------------
const { renderToString } = require('react-dom/server');
const { generateRSAKeyPair, RSADecrypt, sanitizePublicKey } = require('../util/RSAUtil');
const { get } = require('../util/request');
const React = require('react');
const { Limit } = require('../pages/IpLimitPage/index');
const LimitPageString = renderToString(<Limit />);
// create express application
const app = express();
const { getClientIp, getLocationFromIp } = require('../util/IpUtil');
const rateLimit = require("express-rate-limit");//限制请求
const { pool, sqlRes } = require('./mysql');
const indexHTML = fs.readFileSync(
    path.resolve(__dirname, '../../dist/index.html'),
    { encoding: 'utf8' }
);
const LimitPage = indexHTML
    .replace('<script>window.__IS_LIMIT__ = false</script>', '<script>window.__IS_LIMIT__ = true</script>');
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
    message: LimitPage,
});
// app.use(webpackDevMiddleware(compiler, {
//     publicPath: webpackConfig.output.path,
//     stats: { colors: true }
// }));

// app.use(webpackHotMiddleware(compiler));
const getInitialData = async () => {
    const { publicKey, privateKey } = generateRSAKeyPair();
    const response = await get('http://localhost:8080/link', { "publicKey": publicKey }).catch(err => {
        console.log("link失败");
    })
    console.log("link_express: " + response)
    const decrypted = RSADecrypt(response, privateKey);
    console.log("decrypted: " + decrypted);
    const linkId = sanitizePublicKey(publicKey);
    const linkKey = decrypted;
    const data = { linkId, linkKey };
    return JSON.stringify(data);
};
const appHtml = async (req, res) => {
    //查看ip
    let ip = getClientIp(req);
    console.log(">>> ipv: " + ip);
    if (ip) {
        let data = JSON.stringify(getLocationFromIp(ip));
        console.log(">>> ipAddress: " + data);
        // 从连接池中获取数据库的连接对象
        let isIpInSql = "select * from ip_config where ip_address = '" + ip + "' ";
        const isIpInSqlResult = sqlRes(isIpInSql, [], function (err, result) {
            console.log(">>> isIpInSqlResult: " + result);
            if (!result) {
                let sql = "insert into ip_config(ip_address,ip_update_time) values('" + ip + "',now())";
                const sqlResult = sqlRes(sql, [], function (err, result) {
                    console.log(">>> sqlResult: " + result);
                });
            } else {
                let sql = "update ip_config set ip_count = ip_count + 1 where ip_address = '" + ip + "'";
                const sqlResult = sqlRes(sql, [], function (err, result) {
                    let sql2 = "update ip_config set ip_update_time = now() where ip_address = '" + ip + "'";
                    const sqlResult2 = sqlRes(sql2, [], function (err, result) {
                        console.log(">>> sqlResult: " + result);
                    });
                });
            }
        });
    }

    // set header and status
    res.contentType('text/html');
    res.status(200);
    let voteView = {
        vid: "",
        type: ""
    }
    //如果路径是/voteView
    if (req.path == "/voteView") {
        voteView.vid = req.query.vid;
        console.log(">>> vid: " + voteView.vid);
        voteView.type = req.query.type;
        console.log(">>> type: " + voteView.type);
    }
    const initialData = JSON.parse(await getInitialData());
    if (initialData === '') {
        return res.send(LimitPage);
    }
    return res.send(indexHTML
        .replace(`<script>window.__LINK_ID__ = ''</script>`, `<script>window.__LINK_ID__ = "${initialData.linkId}"</script>`)
        .replace(`<script>window.__LINK_KEY__ = ''</script>`, `<script>window.__LINK_KEY__ = "${initialData.linkKey}"</script>`)
        .replace(`<script>window.__VOTE_VIEW__ = ''</script>`, `<script>window.__VOTE_VIEW__ = ${JSON.stringify(voteView)}</script>`)
    );
}
// serve static assets
app.get(
    /\.(js|css|map|ico)$/,
    express.static(path.resolve(__dirname, '../../dist'))
);

// for any other requests, send `index.html` as a response
app.use(limiter, (req, res) => {
    // read `index.html` file
    appHtml(req, res);
});



// run express server on port 9000
app.listen(9000, () => {
    console.log('Express server started at http://localhost:9000');
});
