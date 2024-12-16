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

/**
 * 错误序列化器，用于日志记录
 * @param {Error} err - 错误对象
 * @returns {Object} 序列化后的错误对象
 */
function errSerializer(err) {
    if (!(err instanceof Error)) {
        return err;
    }
    return {
        name: err.name,
        message: err.message,
        stack: err.stack,
        // 如果有自定义属性或更多信息，可以在这里添加
    };
}

/**
 * 响应序列化器，用于日志记录
 * @param {Object} res - HTTP响应对象
 * @returns {Object} 序列化后的响应对象
 */
function resSerializer(res) {
    if (!res || !res.statusCode) {
        return {};
    }
    return {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage || ''
    };
}

// 日志配置
const logConfig = {
    name: 'reactssr', // 应用程序名称
    serializers: {
        req: reqSerializer,
        err: errSerializer,
        res: resSerializer
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