import React, {useRef, useState} from 'react';
import {ProConfigProvider, setAlpha,} from '@ant-design/pro-components';
import {App, Button, Checkbox, Form, Input, Statistic, Table, theme} from 'antd';
import {get} from '../../util/request'
import {useDispatch, useSelector} from 'react-redux';
import {setAuthToken} from '../../rouder/userSlice';
import {AESEncrypt} from '../../util/AESUtil';
import TipsViewWindow from '../../components/TipsViewWindow/TipsViewWindow';
import {downloadTextWithFileSaver} from '../../util/fileUtil';
import CustomCountdownButton from '../../components/CustomCountdownButton';

const {Countdown} = Statistic;
const Login = () => {
    const {token} = theme.useToken();
    const {message} = App.useApp();
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
        {label: '公私钥登录', key: 'account',},
        {label: '邮箱登录/注册', key: 'mail',}
    ]
    const deadline = 10000;//10s
    let [tipsViewWindowButton, setTipsViewWindowButton] = useState(true)
    let linkId = useSelector(state => state.link.linkId)
    let linkKey = useSelector(state => state.link.linkKey)
    const dispatch = useDispatch();
    const onCountdownFinish = () => {
        setTipsViewWindowButton(false)
    }
    const onFinish = async (values) => {
        console.log(values)
        //获取autoLogin
        let autoLogin = values.remember
        //去除values的autoLogin
        delete values.remember
        let encrypted = await AESEncrypt(JSON.stringify(values), linkKey)
        let data = {
            linkId: linkId,
            type: '',
            data: encrypted
        }
        console.log(data)
        if (loginType === 'account') {
            data.type = 'account'
            get(process.env.BACKEND_URL + '/login', data).then(res => {
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
            get(process.env.BACKEND_URL + '/register', data).then(res => {
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
                    tipsViewRef.current = !tipsViewRef.current
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
    return (
        <ProConfigProvider hashed={false}>
            <div style={{
                backgroundColor: token.colorBgContainer,
                width: 'fit-content',
                borderRadius: '10px',
                padding: '20px 50px',
                margin: '0 auto',
            }}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="publicKey"
                        name="publicKey"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="privateKey"
                        name="privateKey"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" label={null}>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                <TipsViewWindow ref={tipsViewRef} show={false} className="w-50" closeBtn={false}>
                    <Table
                        style={{tableLayout: "fixed"}}
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
                        <CustomCountdownButton type="primary" countdownTime="60"
                                               onClick={() => tipsViewRef.current.toggleProfile()}>
                            关闭
                        </CustomCountdownButton>
                    </div>

                </TipsViewWindow>
            </div>
        </ProConfigProvider>
    );
};

export default Login;