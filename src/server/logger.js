const bunyan = require('bunyan');
/**
 * 请求序列化器，用于日志记录
 * @param {Object} req - HTTP请求对象
 * @returns {Object} 序列化后的请求对象
 */
function reqSerializer(req) {
    if (!req) {
        return {};
    }
    const { method, url, headers } = req;
    const safeHeaders = headers ? Object.fromEntries(
        Object.entries(headers).filter(([key]) => !['authorization', 'cookie'].includes(key.toLowerCase()))
    ) : {};
    return {
        method: method || 'UNKNOWN',
        url: url || 'UNKNOWN',
        headers: safeHeaders
    };
}

// 日志配置
const logConfig = {
    name: 'reactssr', // 应用程序名称
    serializers: {
        req: reqSerializer
    },
    streams: [
        {
            level: 'debug', // 设置最低日志级别
            stream: process.stdout // 输出到控制台
        },
        // 如果你也想将日志写入文件，可以添加如下配置：
        {
            level: 'error',
            path: './err.log' // 指定日志文件路径,是项目根目录下的日志文件
        }
    ]
};

// 创建一个新的日志记录器实例
const logger = bunyan.createLogger(logConfig);

module.exports = logger;