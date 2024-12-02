import React from 'react';
import { Button, Result } from 'antd';
const Limit = () => {
    return (
        <Result
            status="403"
            title="Ip Limited"
            subTitle="对不起，由于您的IP在短时间内进行大量请求，被暂时禁止访问本站，请稍后再试！"
            extra={<Button type="primary">Back Home</Button>}
        />
    )

};
export {Limit};