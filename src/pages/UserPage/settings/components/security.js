import React from "react";
import { List } from 'antd';



const passwordStrength = {
    strong: <span className="strong">强</span>,
    medium: <span className="medium">中</span>,
    weak: <span className="weak">弱 Weak</span>,
};

const SecurityView = () => {
    const getData = () => [
        {
            title: '账户密码',
            description: (
                <>
                    当前密码强度：
                    {passwordStrength.strong}
                </>
            ),
            actions: [<a key="Modify">修改</a>],
        },
        {
            title: '密保手机',
            description: `已绑定手机：138****8293`,
            actions: [<a key="Modify">修改</a>],
        },
        {
            title: '密保问题',
            description: '未设置密保问题，密保问题可有效保护账户安全',
            actions: [<a key="Set">设置</a>],
        },
        {
            title: '备用邮箱',
            description: `已绑定邮箱：ant***sign.com`,
            actions: [<a key="Modify">修改</a>],
        },
        {
            title: 'MFA 设备',
            description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
            actions: [<a key="bind" href="/bind">绑定</a>],
        },
    ];

    const data = getData();
    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                    <List.Item actions={item.actions}>
                        <List.Item.Meta title={item.title} description={item.description} />
                    </List.Item>
                )}
            />
        </>
    );
};

export default SecurityView;
