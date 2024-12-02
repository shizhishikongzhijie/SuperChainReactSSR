import React, { useEffect } from 'react';
import { Button, message, Space } from 'antd';

const CustomMessage = (props) => {
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        if (props.type && props.children) {
            messageApi.open({
                type: props.type,
                content: props.children,
            });
        }

    }, [props]);

    return (
        <>
            {contextHolder}
        </>
    );
};


export default CustomMessage