import React, { useEffect } from "react";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

// 配置
nprogress.configure({
    easing: 'ease', // 动画方式
    speed: 500, // 递增进度条的速度
    showSpinner: true, // 是否显示右上角螺旋加载提示ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3, // 初始化时的最小百分比
});

const Loading = () => {
    // 组件挂载时执行 nprogress.start()
    useEffect(() => {
        console.log("Loading");
        nprogress.start();
    }, []);

    // 组件卸载时执行 nprogress.done()
    useEffect(() => {
        return () => {
            nprogress.done();
        };
    }, []);

    return <></>; // 或者直接返回 null
};

export default Loading;