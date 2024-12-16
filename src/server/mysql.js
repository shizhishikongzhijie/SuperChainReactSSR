const mysql = require("mysql");
const logger = require('./logger');

require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
// 加载 .env 文件
const NODE_ENV = process.env.NODE_ENV;

//默认开发环境

if (NODE_ENV === 'production') {
    console.log('生产环境');
}
let poolData = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    multipleStatements: process.env.DB_MULTIPLE_STATEMENTS
}
const pool = mysql.createPool(
    poolData
);

/**
 * 执行SQL语句，并通过回调函数处理结果或错误。
 * @param {string} sql - SQL语句。
 * @param {Array} params - SQL参数。
 * @param {function} callback - 回调函数，接受两个参数：错误对象和结果。
 */
const sqlRes = (sql, params, callback) => {
    pool.getConnection((err, conn) => {
        if (err) {
            logger.error({err:err},"数据库连接失败");
            return callback(err);
        }
        logger.info("数据库连接成功");

        conn.query(sql, params, (queryErr, results) => {
            conn.release(); // 释放连接回到连接池

            if (queryErr) {
                logger.error({err:queryErr},"数据库连接失败");
                return callback(queryErr);
            }

            callback(null, results); // 成功时传递null作为错误参数
        });
    });
};

module.exports = { pool, sqlRes };