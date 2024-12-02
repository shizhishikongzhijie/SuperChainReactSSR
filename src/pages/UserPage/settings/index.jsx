import React, { useState, useCallback, useEffect } from 'react';
import { Menu } from 'antd';
import BaseView from './components/base';
import SecurityView from './components/security';
import NotificationView from './components/notification';
import BindingView from './components/binding';
function Settings() {
    const [initConfig, setInitConfig] = useState({
        mode: "inline",
        selectKey: '1',
    });
    //获取设备宽度
    const [flexDirection, setFlexDirection] =useState('row');
    let width = useCallback(() => {
        return window.innerWidth;
    }, [])
    useEffect(() => {
        if (width() < 768) {
            setInitConfig({
                ...initConfig,
                mode: "horizontal",
            });
            setFlexDirection('column');
        } else {
            setInitConfig({
                ...initConfig,
                mode: "inline",
            });
            setFlexDirection('row');
        }
    }, [width]);
    const items = [
        {
            key: '1',
            label: '基本设置',
        },
        {
            key: '2',
            label: '安全设置',
        },
        {
            key: '3',
            label: '账号绑定',
        },
        {
            key: '4',
            label: '新消息通知',
        }
    ]
    const renderChildren = () => {
        const { selectKey } = initConfig;
        switch (selectKey) {
            case '1':
                return <BaseView />;
            case '2':
                return <SecurityView />;
            case '3':
                return <BindingView />;
            case '4':
                return <NotificationView />;
            default:
                return null;
        }
    };
    return (
        <div className='w-100 d-flex justify-content-center'>
            <div className="user d-flex w-100" style={{ backgroundColor: "#fafafa", flexDirection: flexDirection, maxWidth: "950px" }}>
                <Menu
                    mode={initConfig.mode}
                    style={{ width: 256 }}
                    defaultSelectedKeys={['1']}
                    items={items}
                    onClick={({ key }) => {
                        setInitConfig({
                            ...initConfig,
                            selectKey: key,
                        });
                    }}
                />
                <div className="user-content d-flex flex-column m-4" style={{ width: "100%" }}>
                    <div className="user-content-header"
                        style={{
                            fontSize: " 20px",
                            height: "36px",
                            alignContent: "center",
                            paddingLeft: "10px",
                        }}
                    >{items[initConfig.selectKey - 1].label}</div>
                    {renderChildren()}
                </div>
            </div>
        </div>


    );
}

export default Settings;