const bunyan = require('bunyan');
const bunyanSerializer = require('bunyan-serializer');


// 日志配置
const logConfig = {
    name: 'reactssr', // 应用程序名称
    serializers: {
        req: bunyanSerializer.reqSerializer,
        res: bunyanSerializer.resSerializer,
        err: bunyanSerializer.errSerializer
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