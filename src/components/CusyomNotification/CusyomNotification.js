import React from 'react';
import { Button, notification, Space } from 'antd';
const CusyomNotification = ({Msg,Description,Process,pauseOnHover}) => {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = () => () => {
        api.open({
            message: Msg,
            description:Description,
            showProgress: Process,
            pauseOnHover,
        });
    };
    return (
        <>
            {contextHolder}
            {/* <Space>
                <Button type="primary" onClick={openNotification(true)}>
                    Pause on hover
                </Button>
                <Button type="primary" onClick={openNotification(false)}>
                    Don&apos;t pause on hover
                </Button>
            </Space> */}
        </>
    );
};
export default CusyomNotification;