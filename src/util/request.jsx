// utils/request.js

import axios from 'axios';
import { AESDecrypt, AESEncrypt } from './AESUtil';
// import { useLocation, useNavigate } from 'react-router-dom';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { message, Spin } from 'antd';
// 判断是否在浏览器中
const isBrowser = typeof window !== 'undefined' && window.localStorage;
let logger;
if (!isBrowser) {
    logger = require('../server/logger');
}
//判断是否在浏览器中
// const location = useLocation();
// const navigate = useNavigate();
/**
 * 获取认证令牌
 */
function getToken() {
    // 从存储或其他地方获取令牌
    if (isBrowser) {
        // 浏览器环境
        return window.localStorage.getItem('token') || null;
    }
}

function getLinkId() {
    // 从存储或其他地方获取令牌
    if (isBrowser) {
        // 浏览器环境
        return JSON.parse(window.localStorage.getItem('link')).linkId || null;
    }
}

// 当前正在请求的数量
let requestCount = 0

// 显示loading
function showLoading() {
    if (requestCount === 0) {
        var dom = document.createElement('div')
        dom.setAttribute('id', 'loading')
        document.body.appendChild(dom)
        ReactDOM.render(<Spin tip="加载中..." size="large" />, dom)
    }
    requestCount++
}

// 隐藏loading
function hideLoading() {
    requestCount--
    if (requestCount === 0) {
        document.body.removeChild(document.getElementById('loading'))
    }
}


/**
 * 创建 Axios 实例
 */
const apiClient = axios.create({
    timeout: 15000,  // 设置超时时间
    headers: {
        //设置为键值对
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});

// 添加请求拦截器
apiClient.interceptors.request.use(
    async (request) => {
        try {

            if (isBrowser) {
                const token = getToken();
                const linkId = getLinkId();
                console.log("token: " + token);
                Object.entries({
                    Authorization: `Bearer ${token}`,
                    LinkId: `${linkId}`
                }).forEach(([key, value]) => (request.headers[key] = value));
                // 对请求数据进行加密
                // let linkKey= JSON.parse(window.localStorage.getItem('link')).linkKey || null;
                // request.data = AESEncrypt(request.data, linkKey);
            }
            return request;
        } catch (err) {
            if (isBrowser) {
                console.log(`科室隔离配置查询失败：${err}`);
            } else {
                logger.error(`科室隔离配置查询失败：${err}`);
            }
        }
        return request;
    },
    config => {
        // requestCount为0，才创建loading, 避免重复创建
        if (config.headers.isLoading !== false) {
            showLoading()
        }
    },
    error => {
        // 判断当前请求是否设置了不显示Loading
        if (error.config.headers.isLoading !== false) {
            hideLoading()
        }
        return Promise.reject(error);
    }
);

// 添加响应拦截器
apiClient.interceptors.response.use(
    response => {
        // 判断当前请求是否设置了不显示Loading
        if (response.config.headers.isLoading !== false) {
            hideLoading()
        }
        // 对响应数据进行解密
        if (isBrowser) {
            // 浏览器环境
            console.log("response: " + JSON.stringify(response));
            let linkKey = JSON.parse(window.localStorage.getItem('link')).linkKey || null;
            return AESDecrypt(response.data, linkKey);
        }
        if (isBrowser) {
            console.log("response2: " + JSON.stringify(response));
        } else {
            logger.error({err:response});
        }
        return response.data;
    },

    error => {
        if (error.config.headers.isLoading !== false) {
            hideLoading()
        }
        if (error.message === 'Network Error') {
            if (isBrowser) {
                message.warning('网络连接异常！')

            }
            else {
                logger.error({ err: err }, '网络连接异常！');

            }
        }
        if (error.code === 'ECONNABORTED') {
            if (isBrowser) {
                console.log('请求超时，请重试');

            }
            else {
                logger.error({ err: error }, '请求超时，请重试');

            }
        }
        // 处理错误响应
        // console.log(JSON.stringify(error.response.data));
        // 检查是否有响应数据和状态码
        if (error.response) {
            const status = error.response.status;

            // 根据不同的状态码做出反应
            if (isBrowser) {
                switch (status) {
                    case 401: // 未认证
                        message.error('未授权，请重新登录');
                        // 清除可能存在的用户信息
                        localStorage.removeItem('token'); // 或者其他存储用户信息的地方
                        // 使用全局导航函数重定向到登录页面
                        // navigateTo('/login');
                        // navigate('/login', { replace: true });
                        window.location.href = '/login';
                        break;
                    case 403: // 权限不足
                        message.error('您没有访问此资源的权限');
                        break;
                    default:
                        if (isBrowser)
                            console.error('Error:', JSON.stringify(error.response.data));

                }
            } else {
                logger.error({ err: error }, 'error');
            }

            return error.response.data;
            // return Promise.reject(error);
        }
    }
);

// 封装 GET 请求
export const get = (url, params = {}, config = {}) => apiClient.get(url, { params, ...config });

// 封装 POST 请求
export const post = (url, data, config = {}) => apiClient.post(url, data, config);

// 封装 PUT 请求
export const put = (url, data, config = {}) => apiClient.put(url, data, config);

// 封装 DELETE 请求
export const del = (url, config = {}) => apiClient.delete(url, config);








// 示例请求
//import { get, post, put, del } from './utils/request';
// post('/some-endpoint', { key: 'value' })
// .then(response => {
//     console.log('Success:', response.data);
// })
// .catch(error => {
//     console.error('Error:', error);
// });

// get('/another-endpoint')
// .then(response => {
//     console.log('Success:', response.data);
// })
// .catch(error => {
//     console.error('Error:', error);
// });