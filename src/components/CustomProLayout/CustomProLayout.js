import { UserOutlined } from '@ant-design/icons';
import { SearchOutlined, LogoutOutlined, InfoCircleFilled, EditOutlined, QuestionCircleFilled, GithubFilled, SettingOutlined } from '@ant-design/icons';
import { Input, Tag, Dropdown } from 'antd';
import {
    PageContainer,
    ProLayout,
    DefaultFooter
} from '@ant-design/pro-components';
import React,{ useState } from 'react';
import defaultProps from './_defaultProps';
import { LoginOut } from "../../components/Login/Login"
import { useSelector,useDispatch } from 'react-redux'
import { deleteAuthToken, setAuthToken } from '../../rouder/userSlice'
import  CustomMessage  from '../CustomMessage/CustomMessage';
const CustomProLayout = (props) => {
    const dispatch = useDispatch();
    const [MessageSuccess,setMessageSuccess] = useState('');
    const [settings, setSetting] = useState({
        fixSiderbar: true,
        layout: "top",
        "splitMenus": false,
        "contentWidth": "Fluid",
        "fixedHeader": true
    });
    const [pathname, setPathname] = useState('/');
    return (
        <div
            id="test-pro-layout"
            style={{
                height: '100vh',
            }}
        >
            <ProLayout
                {...defaultProps}
                location={{
                    pathname
                }}
                actionsRender={(props) => {
                    if (props.isMobile) return [];
                    return [
                        props.layout !== 'side' ? (
                            <Input
                                size='large'
                                variant="filled"
                                style={{
                                    borderRadius: "100px",
                                    paddingInlineStart: 12,

                                }}
                                prefix={
                                    <SearchOutlined
                                        style={{
                                            color: 'rgba(0, 0, 0, 0.15)',
                                        }}
                                    />
                                }
                                suffix={
                                    <Tag color="rgba(42, 46, 54, 0.06)"
                                        style={{
                                            borderRadius: "100px",
                                            color: "rgba(42, 46, 54, 0.45)"
                                        }}
                                    >Ctrl K</Tag>
                                }
                                placeholder="搜索方案"
                            />
                        ) : undefined,
                        <InfoCircleFilled key="InfoCircleFilled" />,
                        <QuestionCircleFilled key="QuestionCircleFilled" />,
                        <GithubFilled key="GithubFilled" />,
                    ];
                }}
                footerRender={() => (
                    <DefaultFooter
                        links={[
                            { key: 'test', title: 'layout', href: 'www.alipay.com' },
                            { key: 'test2', title: 'layout2', href: 'www.alipay.com' },
                        ]}
                        copyright="这是一条测试文案"
                    />
                )}
                // menuFooterRender={(props) => {
                //     return (
                //         <a
                //             style={{
                //                 lineHeight: '48rpx',
                //                 display: 'flex',
                //                 height: 48,
                //                 color: 'rgba(255, 255, 255, 0.65)',
                //                 alignItems: 'center',
                //             }}
                //             href="https://preview.pro.ant.design/dashboard/analysis"
                //             target="_blank"
                //             rel="noreferrer"
                //         >
                //             <img
                //                 alt="pro-logo"
                //                 src="https://procomponents.ant.design/favicon.ico"
                //                 style={{
                //                     width: 16,
                //                     height: 16,
                //                     margin: '0 16px',
                //                     marginInlineEnd: 10,
                //                 }}
                //             />
                //             {!props?.collapsed && 'Preview Pro'}
                //         </a>
                //     );
                // }}
                onMenuHeaderClick={(e) => console.log(e)}
                menuItemRender={(item, dom) => (
                    <a
                        href={pathname}
                        style={{ textDecoration: 'none' }}
                        onClick={() => {
                            setPathname(item.path || '/');
                        }}
                    >
                        {dom}
                    </a>
                )}
                avatarProps={{
                    icon: <UserOutlined />,
                    render: (props, dom) => {
                        return (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: 'center',
                                            href: '/user',
                                            icon: <UserOutlined />,
                                            label: '个人中心',
                                            onClick: () => {
                                                window.location.href = '/user'
                                            }
                                        },
                                        {
                                            key: 'settings',
                                            href: '/settings',
                                            icon: <SettingOutlined />,
                                            label: '个人设置',
                                            onClick: () => {
                                                window.location.href = '/settings'
                                            }
                                        },
                                        {
                                            key: 'change-password',
                                            icon: <EditOutlined />,
                                            label: "修改密码",
                                        },
                                        {
                                            type: 'divider',
                                        },
                                        {
                                            key: 'logout',
                                            href: '/logout',
                                            icon: <LogoutOutlined />,
                                            label: '退出登录',
                                            onClick: () => {
                                                setMessageSuccess(<LoginOut />)
                                                //转到登录页面
                                                window.location.href = '/login'
                                                // dispatch(deleteAuthToken())
                                            }
                                        },

                                    ],
                                }}
                            >
                                {dom}
                            </Dropdown>
                        );
                    }
                }}
                {...settings}
            >
                <PageContainer>
                    {props.children}
                </PageContainer>
            </ProLayout>
            <CustomMessage type="success" >{MessageSuccess}</CustomMessage>
        </div>
    );
};

export default CustomProLayout;