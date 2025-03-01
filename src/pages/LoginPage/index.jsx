import React, {useRef, useState} from 'react';
import {LockOutlined, MailOutlined, UserOutlined,} from '@ant-design/icons';
import {
    LoginForm,
    ProConfigProvider,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
    setAlpha,
} from '@ant-design/pro-components';
import {App, Button, Statistic, Table, Tabs, theme} from 'antd';
import {get} from '../../util/request'
import {useDispatch, useSelector} from 'react-redux';
import {setAuthToken} from '../../rouder/userSlice';
import {AESEncrypt} from '../../util/AESUtil';
import TipsViewWindow from '../../components/TipsViewWindow/TipsViewWindow';
import {downloadTextWithFileSaver} from '../../util/fileUtil';
import CustomCountdownButton from '../../components/CustomCountdownButton';

const { Countdown } = Statistic;
const Login = () => {
    const { token } = theme.useToken();
    const { message } = App.useApp();
    const [loginType, setLoginType] = useState('account');//或mail
    const [values, setValues] = useState({});
    const [content, setContent] = useState('')
    const [keyData, setKeyData] = useState([])
    const tipsViewRef = useRef(true);
    const iconStyles = {
        marginInlineStart: '16px',
        color: setAlpha(token.colorTextBase, 0.2),
        fontSize: '24px',
        verticalAlign: 'middle',
        cursor: 'pointer',
    };
    const items = [
        { label: '公私钥登录', key: 'account', },
        { label: '邮箱登录/注册', key: 'mail', }
    ]
    const deadline = 10000;//10s
    let [tipsViewWindowButton, setTipsViewWindowButton] = useState(true)
    let linkId = useSelector(state => state.link.linkId)
    let linkKey = useSelector(state => state.link.linkKey)
    const dispatch = useDispatch();
    const onCountdownFinish = () => {
        setTipsViewWindowButton(false)
    }
    const onFinish = (values) => {
        console.log(values)
        //获取autoLogin
        let autoLogin = values.autoLogin
        //去除values的autoLogin
        delete values.autoLogin
        let encrypted = AESEncrypt(JSON.stringify(values), linkKey)
        let data = {
            linkId: linkId,
            type: '',
            data: encrypted
        }
        console.log(data)
        if (loginType === 'account') {
            data.type = 'account'
            get(process.env.BACKEND_URL+'/login', data).then(res => {
                console.log(res);
                let resData = JSON.parse(res);
                console.log(resData)
                if (resData.code !== 200) {
                    console.log(resData.code);
                    message.error(resData.message);
                } else {
                    localStorage.setItem('token', resData.data.token);
                    localStorage.setItem('key', JSON.stringify(values));
                    let authToken = {
                        token: resData.data.token,
                        publickey: values.publickey,
                        privatekey: values.privateKey
                    }
                    dispatch(setAuthToken(authToken))
                    message.success(JSON.stringify(resData.message))
                    window.location.href = '/'
                }
            })
        } else {
            data.type = 'mail'
            get(process.env.BACKEND_URL+'/register', data).then(res => {
                console.log(res);
                let resData = JSON.parse(res);
                console.log(resData)
                if (resData.code !== 200) {
                    console.log(resData.code);
                    message.error(resData.message);
                } else {
                    let authToken = {
                        token: '',
                        publickey: resData.data.publickey,
                        privatekey: resData.data.privateKey
                    }
                    dispatch(setAuthToken(authToken))
                    message.success(JSON.stringify(resData.message))
                    tipsViewRef.current.toggleProfile()
                    // setContent(formatKey(resData.data))
                    setContent(resData.data)
                    setKeyData([
                        {
                            key: 'publicKey',
                            name: '公钥',
                            data: resData.data.publicKey
                        },
                        {
                            key: 'privateKey',
                            name: '私钥',
                            data: resData.data.privateKey
                        }
                    ])
                }
            })
        }

    }
    // useEffect(() => {
    //     setContent(formatKey({ publicKey: "{\"Curvname\":\"P-256\",\"X\":84718181579477297237931144295252505459306796410722855355558753055772853486972,\"Y\":47565821645110186420934251364880491615332264132296001475601660461274979403914}", privateKey: "115483373773731065037294262810599860059687232365134473285017108193627668730591" }))
    //     setKeyData([
    //         {
    //             name: '公钥',
    //             data: "{\"Curvname\":\"P-256\",\"X\":84718181579477297237931144295252505459306796410722855355558753055772853486972,\"Y\":47565821645110186420934251364880491615332264132296001475601660461274979403914}"
    //         },
    //         {
    //             name: '私钥',
    //             data: "115483373773731065037294262810599860059687232365134473285017108193627668730591"
    //         }
    //     ])
    // }, [])
    return (
        <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: token.colorBgContainer }}>
                <LoginForm
                    logo="http://121.43.115.41:7791/i/2024/09/12/66e30352dbea8.png"
                    title="SuperChainVote"
                    subTitle="区块链投票平台"
                    // actions={
                    //     <Space>
                    //         其他登录方式
                    //         <AlipayCircleOutlined style={iconStyles} />
                    //         <TaobaoCircleOutlined style={iconStyles} />
                    //         <WeiboCircleOutlined style={iconStyles} />
                    //     </Space>
                    // }
                    value={values}
                    onFinish={onFinish}
                >
                    <Tabs
                        centered
                        activeKey={loginType}
                        onChange={(activeKey) => setLoginType(activeKey)}
                        items={items}
                    >
                    </Tabs>
                    {loginType === 'account' && (
                        <>
                            <ProFormText
                                name="publicKey"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'公钥'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入公钥!',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="privateKey"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                    strengthText:
                                        'Password should contain numbers, letters and special characters, at least 8 characters long.',
                                    statusRender: (value) => {
                                        const getStatus = () => {
                                            if (value && value.length > 12) {
                                                return 'ok';
                                            }
                                            if (value && value.length > 6) {
                                                return 'pass';
                                            }
                                            return 'poor';
                                        };
                                        const status = getStatus();
                                        if (status === 'pass') {
                                            return (
                                                <div style={{ color: token.colorWarning }}>
                                                    强度：中
                                                </div>
                                            );
                                        }
                                        if (status === 'ok') {
                                            return (
                                                <div style={{ color: token.colorSuccess }}>
                                                    强度：强
                                                </div>
                                            );
                                        }
                                        return (
                                            <div style={{ color: token.colorError }}>强度：弱</div>
                                        );
                                    },
                                }}
                                placeholder={'私钥'}
                                rules={[
                                    {
                                        required: true,
                                        message: '私钥',
                                    },
                                ]}
                            />
                        </>
                    )}
                    {loginType === 'mail' && (
                        <>
                            <ProFormText
                                fieldProps={{
                                    size: 'large',
                                    prefix: <MailOutlined className={'prefixIcon'} />,
                                }}
                                name="email"

                                placeholder={'邮箱'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入邮箱！',
                                    },
                                    {
                                        pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                        message: '邮箱格式错误！',
                                    }
                                ]}
                            />
                            <ProFormCaptcha
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                }}
                                captchaProps={{
                                    size: 'large',
                                }}
                                placeholder={'请输入验证码'}
                                captchaTextRender={(timing, count) => {
                                    if (timing) {
                                        return `${count} ${'获取验证码'}`;
                                    }
                                    return '获取验证码';
                                }}
                                phoneName="email"
                                name="captcha"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入验证码！',
                                    },
                                ]}
                                onGetCaptcha={async (email) => {
                                    if (!email) {
                                        message.error('请输入邮箱！');
                                    } else {
                                        console.log("email:{}" + email);
                                        await get(process.env.BACKEND_URL+'/sendCaptcha', { email: email }).then(res => {
                                            let resData = JSON.parse(res);
                                            console.log(resData)
                                            if (resData.code !== 200) {
                                                console.log(resData.code);
                                                message.error(resData.message);
                                            } else {
                                                message.success(resData.message);
                                            }
                                        })
                                    }

                                }}
                            />
                        </>
                    )}
                    <div
                        style={{
                            marginBlockEnd: 24,
                        }}
                    >
                        <ProFormCheckbox noStyle name="autoLogin">
                            自动登录
                        </ProFormCheckbox>
                        <a
                            href='/'
                            style={{
                                float: 'right',
                            }}
                        >
                            忘记密码
                        </a>
                    </div>
                </LoginForm>
                <TipsViewWindow ref={tipsViewRef} show={false} className="w-50" closeBtn={false}>
                    <Table
                        style={{tableLayout:"fixed"}}
                        columns={
                            [
                                {
                                    title: 'Name',
                                    dataIndex: 'name',
                                    render: (text) => <a>{text}</a>,
                                },
                                {
                                    title: 'data',
                                    className: 'column-data',
                                    dataIndex: 'data',
                                }
                            ]
                        }
                        dataSource={keyData}
                        pagination={false}
                        bordered
                    />
                    <div className='w-50 d-flex justify-content-speace-around align-items-center'>
                        <Button type='primary' onClick={() => {
                            downloadTextWithFileSaver(JSON.stringify(content), "key.txt", "text/plain")
                        }}>下载</Button>
                        {/* <Button type="primary" onClick={() => tipsViewRef.current.toggleProfile()} disabled={tipsViewWindowButton} >
                        {tipsViewWindowButton ? <Countdown title="Countdown" value={deadline}  onFinish={onCountdownFinish} />
                            : "关闭"}
                    </Button> */}
                        <CustomCountdownButton type="primary" countdownTime="60" onClick={() => tipsViewRef.current.toggleProfile()}>
                            关闭
                        </CustomCountdownButton>
                    </div>

                </TipsViewWindow>
            </div>
        </ProConfigProvider >
    );
};

export default Login;