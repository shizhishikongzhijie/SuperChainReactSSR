const fs = require('fs');
const path = require('path');
const express = require('express');
// const Redis = require('ioredis');
const readXlsx  = require('../util/pkFileUtil');
const logger = require('./logger');

// require('dotenv').config(); // 加载 .env 文件
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

process.env.NODE_ENV === 'production' && require('xprofiler').start();//生产模式启动xprofiler开启性能日志输出

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
const {readFile} = require("fs");
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

// 使用中间件解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(webpackHotMiddleware(compiler));
const getInitialData = async () => {
    const { publicKey, privateKey } = generateRSAKeyPair();
    const response = await get(process.env.BACKEND_URL+'/link', { "publicKey": publicKey }).catch(err => {
        logger.error({err:err}, 'link失败');
    })
    // console.log("link_express: " + JSON.stringify(response))
    const decrypted = RSADecrypt(response, privateKey);
    // console.log("decrypted: " + decrypted);
    const linkId = sanitizePublicKey(publicKey);
    const linkKey = decrypted;
    const data = { linkId, linkKey };
    logger.info('link_data: ' + JSON.stringify(data));
    return JSON.stringify(data);
};
const appHtml = async (req, res) => {
    //查看ip
    let ip = getClientIp(req);
    logger.info('ip:'+ ip);
    if (ip) {
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
        voteView.type = req.query.type;
        logger.info('voteView:'+ voteView);
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

// // 创建一个 Redis 客户端实例
// const redisClient = new Redis({
//     host: '121.43.115.41',
//     port: 6379,
//     password: '3473901836teng',
//     db: 1,
//     connectTimeout: 5000,
//     retryStrategy(times) {
//         const delay = Math.min(times * 50, 2000);
//         return delay;
//     },
// });
// // 消息路由处理
// app.post('/message/:publicKey', async (req, res) => {
//     const { publicKey } = req.params;
//     const message = req.body.message;

//     if (!message) {
//         return res.status(400).send('Message is required.');
//     }

//     try {
//         // 将消息推送到用户的 Redis List
//         await redisClient.rpush(publicKey, JSON.stringify(message));

//         // 发布消息更新通知到指定频道
//         await redisClient.publish('message-updates', JSON.stringify({ publicKey }));

//         res.send('Message queued and notification sent.');
//     } catch (error) {
//         console.error('Error queuing message:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });


app.post('/api/publicKey/readFile', async (req, res) => {
    const file = req.body.file;
    //获取文件类型
    const fileType = file.split('.').pop();
    logger.info('fileType:'+ fileType);
    if (fileType == 'xlsx') {
        //是表格
        res.send(readXlsx(file));
    } else {
        //读取文件
        const data = await readFile(file, 'utf8');
        //返回文件
        res.send(data);
    }
})

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



// run express server on port 8000
app.listen(process.env.NODE_PORT, () => {
    logger.info('Express server started at http://localhost:' + process.env.NODE_PORT);
    // console.log('Express server started at http://localhost:' + process.env.NODE_PORT);
});
