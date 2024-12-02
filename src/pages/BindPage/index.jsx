import {
    PageContainer,
    ProForm,
    ProFormDigit,
    ProFormSelect,
    ProFormText,
    StepsForm,
} from '@ant-design/pro-components';
import { QRCode, Space, theme, Spin, Input } from 'antd';
import { Alert, Button, Card, Descriptions, Divider, Result, Statistic } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { CheckCircleFilled, CloseCircleFilled, ReloadOutlined } from '@ant-design/icons';
import { get } from "../../util/request";
const StepDescriptions = ({ stepData, bordered }) => {
    const { payAccount, receiverAccount, receiverName, amount } = stepData;
    return (
        <Descriptions column={1} bordered={bordered}>
            <Descriptions.Item label="付款账户"> {payAccount}</Descriptions.Item>
            <Descriptions.Item label="收款账户"> {receiverAccount}</Descriptions.Item>
            <Descriptions.Item label="收款人姓名"> {receiverName}</Descriptions.Item>
            <Descriptions.Item label="转账金额">
                <Statistic
                    value={amount}
                    suffix={
                        <span
                            style={{
                                fontSize: 14,
                            }}
                        >
                            元
                        </span>
                    }
                    precision={2}
                />
            </Descriptions.Item>
        </Descriptions>
    );
};
const StepResult = (props) => {
    return (
        <Result
            status="success"
            title="操作成功"
            subTitle="预计两小时内到账"
            extra={
                <>
                    <Button type="primary" onClick={props.onFinish}>
                        再转一笔
                    </Button>
                    <Button>查看账单</Button>
                </>
            }
        >
            {props.children}
        </Result>
    );
};
const Bind = () => {
    const [stepData, setStepData] = useState({
        payAccount: 'ant-design@alipay.com',
        receiverAccount: 'test@example.com',
        receiverName: 'Alex',
        amount: '500',
        receiverMode: 'alipay',
    });
    const [current, setCurrent] = useState(0);
    const formRef = useRef();
    const [qrCodeText, setQrCodeText] = useState("");
    const getQrCodeText = async () => {
        const res = await get("http://localhost:8080/getQRCode", { name: "shizhishi" })
        console.log("qrCodeText: " + res);
        return JSON.parse(res).data.qrCodeText;
    }
    useEffect(() => {
        getQrCodeText().then((text) => {
            if (text !== null) {
                setQrCodeText(text);
            }
        });
    }, []);
    const customStatusRender = (info) => {
        switch (info.status) {
            case 'expired':
                return (
                    <div>
                        <CloseCircleFilled
                            style={{
                                color: 'red',
                            }}
                        />{' '}
                        {info.locale?.expired}
                        <p>
                            <Button type="link" onClick={info.onRefresh}>
                                <ReloadOutlined /> {info.locale?.refresh}
                            </Button>
                        </p>
                    </div>
                );
            case 'loading':
                return (
                    <Space direction="vertical">
                        <Spin />
                        <p>Loading...</p>
                    </Space>
                );
            case 'scanned':
                return (
                    <div>
                        <CheckCircleFilled
                            style={{
                                color: 'green',
                            }}
                        />{' '}
                        {info.locale?.scanned}
                    </div>
                );
            default:
                return null;
        }
    };
    return (
        <PageContainer content="将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。">
            <Card bordered={false}>
                <StepsForm
                    current={current}
                    onCurrentChange={setCurrent}
                    submitter={{
                        render: (props, dom) => {
                            if (props.step === 2) {
                                return null;
                            }
                            return dom;
                        },
                    }}
                >
                    <StepsForm.StepForm
                        formRef={formRef}
                        title="下载应用"
                        initialValues={stepData}
                        onFinish={async (values) => {
                            setStepData(values);
                            return true;
                        }}
                    >
                        <Alert
                            closable
                            showIcon
                            message="请下载app"
                            style={{
                                marginBottom: 24,
                            }}
                        />
                        <Divider
                            style={{
                                margin: '24px 0',
                            }}
                        />
                    </StepsForm.StepForm>

                    <StepsForm.StepForm title="绑定账号">
                        <div>
                            <Alert
                                closable
                                showIcon
                                message="请使用app扫码绑定账号"
                                style={{
                                    marginBottom: 24,
                                }}
                            />
                            <Space>
                                <QRCode
                                    type="svg"
                                    value={qrCodeText}
                                    errorLevel="H"
                                // status="scanned" statusRender={customStatusRender}
                                />
                            </Space>
                            <Divider
                                style={{
                                    margin: '24px 0',
                                }}
                            />

                        </div>
                    </StepsForm.StepForm>
                    <StepsForm.StepForm title="验证账号">
                        <Input.OTP mask="🔒" />
                        <StepResult
                            onFinish={async () => {
                                setCurrent(0);
                                formRef.current?.resetFields();
                            }}
                        >
                            
                        </StepResult>
                    </StepsForm.StepForm>
                </StepsForm>
                <Divider
                    style={{
                        margin: '40px 0 24px',
                    }}
                />
                <div>
                    <h3>说明</h3>
                    <h4>转账到支付宝账户</h4>
                    <p>
                        如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
                    </p>
                    <h4>转账到银行卡</h4>
                    <p>
                        如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
                    </p>
                </div>
            </Card>
        </PageContainer>
    );
};
export default Bind;