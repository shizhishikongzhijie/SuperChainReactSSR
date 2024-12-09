const Redis = require('ioredis');

// 创建一个 Redis 客户端实例
const redisClient = new Redis({
    host: '121.43.115.41', // Change this if your Redis is on a different host
    port: 6379,         // Default Redis port
    password:'3473901836teng',
    db:1,
    connectTimeout: 5000, // 连接超时时间，默认是无限制
    retryStrategy(times) {
        // 当连接失败时的重试策略
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    // 其他可选配置项...
});

// 监听错误事件
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// 监听连接成功事件
redisClient.on('connect', () => {
    console.log('Connected to Redis successfully');
});

// 监听重新连接事件
redisClient.on('reconnecting', () => {
    console.log('Reconnecting to Redis...');
});

// 监听断开连接事件
redisClient.on('end', () => {
    console.log('Disconnected from Redis');
});