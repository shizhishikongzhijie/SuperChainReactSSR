const WebSocket = require('ws');
const http = require('http');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const Redis = require('ioredis');

// 创建两个 Redis 客户端实例：一个用于命令操作，另一个用于监听 Pub/Sub 消息
const redisClient = new Redis({
    host: '121.43.115.41',
    port: 6379,
    password: '3473901836teng',
    db: 1,
    connectTimeout: 5000,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

const redisSubscriber = redisClient.duplicate();

// 监听 Redis 事件
[redisClient, redisSubscriber].forEach(client => {
    client.on('error', (err) => console.error('Redis error:', err));
    client.on('connect', () => console.log('Connected to Redis successfully'));
    client.on('reconnecting', () => console.log('Reconnecting to Redis...'));
    client.on('end', () => console.log('Disconnected from Redis'));
});

// 创建 HTTP 服务器
const server = http.createServer();

// 创建 WebSocket 服务器并挂载到 HTTP 服务器
const wss = new WebSocket.Server({ server });

// 订阅消息更新频道
const MESSAGE_CHANNEL = 'message-updates';
redisSubscriber.subscribe(MESSAGE_CHANNEL);

redisSubscriber.on('message', async (channel, message) => {
    if (channel === MESSAGE_CHANNEL) {
        try {
            // 确保消息是有效的 JSON 格式
            let data;
            try {
                data = JSON.parse(message);
            } catch (parseError) {
                console.error('Invalid JSON message received:', message);
                return;
            }

            const { publicKey } = data;
            if (!publicKey) {
                console.error('Missing publicKey in received message:', message);
                return;
            }

            // 发送所有未读消息给新连接的客户端
            const socket = findUserSocket(publicKey);
            if (socket) {
                await pushMessagesToClient(publicKey, socket);
            }
        } catch (error) {
            console.error('Error processing message update:', error);
        }
    }
});

// WebSocket 事件监听
wss.on('listening', () => {
    console.log(`WebSocket server is listening on ws://localhost:${process.env.WS_PORT || 8001}`);
});

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'subscribe' && data.publicKey) {
                ws.publicKey = data.publicKey;
                // 发送所有未读消息给新连接的客户端
                await pushMessagesToClient(data.publicKey, ws);
            }
        } catch (error) {
            console.error('Error handling WebSocket message:', error);
        }
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
        delete ws.publicKey;
    });
});

function findUserSocket(publicKey) {
    for (let socket of wss.clients) {
        if (socket.publicKey === publicKey && socket.readyState === WebSocket.OPEN) {
            return socket;
        }
    }
    return null;
}

async function pushMessagesToClient(publicKey, socket) {
    try {
        const messages = await redisClient.lrange(publicKey, 0, -1);
        if (messages.length > 0) {
            socket.send(JSON.stringify({ type: 'newMessages', messages }));
            await redisClient.del(publicKey); // 清空已读消息
        }
    } catch (error) {
        console.error('Error pushing messages to client:', error);
    }
}

// 启动 HTTP 和 WebSocket 服务器
server.listen(process.env.WS_PORT || 8001, () => {
    console.log(`HTTP server started on port ${process.env.WS_PORT || 8001}`);
});