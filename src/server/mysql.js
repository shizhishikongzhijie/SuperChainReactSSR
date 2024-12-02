const mysql = require("mysql");
const pool = mysql.createPool({
    host: "127.0.0.1",
    port: 3306,
    database: "xchain",
    user: "root",
    password: "3473901836",
    connectionLimit: 20,
    multipleStatements: true
});

/**
 * 执行SQL语句，并通过回调函数处理结果或错误。
 * @param {string} sql - SQL语句。
 * @param {Array} params - SQL参数。
 * @param {function} callback - 回调函数，接受两个参数：错误对象和结果。
 */
const sqlRes = (sql, params, callback) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.error("数据库连接失败", err);
            return callback(err);
        }
        console.log("数据库连接成功");

        conn.query(sql, params, (queryErr, results) => {
            conn.release(); // 释放连接回到连接池

            if (queryErr) {
                console.error("数据库查询失败", queryErr);
                return callback(queryErr);
            }

            callback(null, results); // 成功时传递null作为错误参数
        });
    });
};

module.exports = {pool, sqlRes};