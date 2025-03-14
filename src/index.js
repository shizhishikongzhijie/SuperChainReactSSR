import React from 'react';
import {hydrateRoot} from 'react-dom/client';
// 获取需要预先存储的内容
import Application from './App'
// 获取服务器传递的初始数据
const linkId = window.__LINK_ID__;
const linkKey = window.__LINK_KEY__;
let initialData = {
    linkId: linkId,
    linkKey: linkKey
}; // 这个数据应该是从服务器端传递过来的
initialData = JSON.stringify(initialData);
const voteView = window.__VOTE_VIEW__;
const isLimit = window.__IS_LIMIT__;

delete window.__LINK_ID__; // 清除这个全局变量
delete window.__LINK_KEY__;
delete window.__IS_LIMIT__;
delete window.__VOTE_VIEW__;

// 如果使用的是Redux或其他状态管理库，确保正确初始化状态
// 示例：
// store.dispatch(setInitialState(JSON.parse(initialData)));

// 开始渲染应用
hydrateRoot(document.getElementById('root'), <Application initialData={initialData} isLimit={isLimit} />);
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<Application initialData={initialData} isLimit={isLimit} voteView={voteView} />);