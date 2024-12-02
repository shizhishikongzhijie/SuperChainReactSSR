const path = require('path');

// ignore `.scss` imports
require('ignore-styles');

// transpile imports on the fly
require('@babel/register')({
    configFile: path.resolve(__dirname, '../../.babelrc'),
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
});

const IP2Region = require('ip2region').default;
// 要查询的IP地址
const ip = '124.43.22.11'; 
// 创建一个IP2Region实例
const query = new IP2Region();
const ipAddress = query.search(ip);
// 打印查询结果
console.log('>>> ipAddress: ', ipAddress);
// {"country":"","province":"","city":"内网IP","isp":"内网IP"}

// import express server
require('./express.js');
