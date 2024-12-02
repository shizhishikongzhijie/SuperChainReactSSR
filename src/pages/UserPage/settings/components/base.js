import React, { useCallback } from "react";
import { Button, Upload, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
    ProForm,
    ProFormDependency,
    ProFormFieldSet,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
const BaseView = () => {
    let avatar = "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png";
    const handleFinish = async (values) => {
        console.log(values);
    };
    const queryProvince = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        {
                            id: 'zhejiang',
                            name: 'Zhejiang',
                        },
                        {
                            id: 'jiangsu',
                            name: 'Jiangsu',
                        },
                    ],
                })
            })
        })
    }
    const queryCity = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        {
                            id: 'hangzhou',
                            name: 'Hangzhou',
                        },
                        {
                            id: 'ningbo',
                            name: 'Ningbo',
                        },
                    ],
                })
            })
        })
    }
    const currentUser = {
        name: 'Serati Ma',
        avatar: avatar,
        userid: '00000001',
        email: 'antdesign@alipay.com',
        signature: '海纳百川，有容乃大',
        title: '交互专家',
        address: '西湖区工专路 77 号',
        phone: '0571-268888888',
        group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
        tags: [
            {
            }
        ]
    }
    //获取设备宽度
    const [flexDirection, setFlexDirection] = React.useState('row');
    let width = useCallback(() => {
        return window.innerWidth;
    }, [])
    React.useEffect(() => {
        if (width() < 768) {
            setFlexDirection('column-reverse')
        } else {
            setFlexDirection('row')
        }
    }, [width])
    return (
        <div id="base " className="d-flex" style={{ flexDirection: flexDirection }}>
            <div className="base_settings">
                <ProForm
                    layout="vertical"
                    onFinish={handleFinish}
                    submitter={{
                        searchConfig: {
                            submitText: '更新基本信息',
                        },
                        render: (_, dom) => dom[1],
                    }}
                    initialValues={{
                        ...currentUser,
                        phone: currentUser?.phone.split('-'),
                    }}
                    hideRequiredMark
                >
                    <ProFormText
                        width="md"
                        name="name"
                        label="昵称"
                        rules={[
                            {
                                required: true,
                                message: '请输入您的昵称!',
                            },
                        ]}
                    />
                    <ProFormText
                        width="md"
                        name="email"
                        label="邮箱"
                        rules={[
                            {
                                required: true,
                                message: '请输入您的邮箱!',
                            },
                        ]}
                    />
                    
                    {/* <ProFormTextArea
                        name="profile"
                        label="个人简介"
                        rules={[
                            {
                                required: true,
                                message: '请输入个人简介!',
                            },
                        ]}
                        placeholder="个人简介"
                    />
                    <ProFormSelect
                        width="sm"
                        name="country"
                        label="国家/地区"
                        rules={[
                            {
                                required: true,
                                message: '请输入您的国家或地区!',
                            },
                        ]}
                        options={[
                            {
                                label: '中国',
                                value: 'China',
                            },
                        ]}
                    />

                    <ProForm.Group title="所在省市" size={8}>
                        <ProFormSelect
                            rules={[
                                {
                                    required: true,
                                    message: '请输入您的所在省!',
                                },
                            ]}
                            width="sm"
                            fieldProps={{
                                labelInValue: true,
                            }}
                            name="province"
                            request={async () => {
                                return queryProvince().then(({ data }) => {
                                    return data.map((item) => {
                                        return {
                                            label: item.name,
                                            value: item.id,
                                        };
                                    });
                                });
                            }}
                        />
                        <ProFormDependency name={['province']}>
                            {({ province }) => {
                                return (
                                    <ProFormSelect
                                        params={{
                                            key: province?.value,
                                        }}
                                        name="city"
                                        width="sm"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入您的所在城市!',
                                            },
                                        ]}
                                        disabled={!province}
                                        request={async () => {
                                            if (!province?.key) {
                                                return [];
                                            }
                                            return queryCity(province.key || '').then(({ data }) => {
                                                return data.map((item) => {
                                                    return {
                                                        label: item.name,
                                                        value: item.id,
                                                    };
                                                });
                                            });
                                        }}
                                    />
                                );
                            }}
                        </ProFormDependency>
                    </ProForm.Group>
                    <ProFormText
                        width="md"
                        name="address"
                        label="街道地址"
                        rules={[
                            {
                                required: true,
                                message: '请输入您的街道地址!',
                            },
                        ]}
                    />
                    <ProFormFieldSet
                        name="phone"
                        label="联系电话"
                        rules={[
                            {
                                required: true,
                                message: '请输入您的联系电话!',
                            },
                            {
                                validator: "Please input your phone number!",
                            },
                        ]}
                    >
                        <Input className="area_code" />
                        <Input className="phone_number" />
                    </ProFormFieldSet> */}
                </ProForm>
            </div>
            <div className="avatar_settings d-flex flex-column mb-1" style={{alignItems:"center",paddingLeft:`${flexDirection==="row"?"80px":"0px"}`}}>
                {flexDirection==="row"?<div className="avatar_title">头像</div>:<></>}
                
                <div className="avatar" style={{ width: "140px", height: "140px",marginBottom:"20px" }}>
                    <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%" }} />
                </div>
                <Upload showUploadList={false}>
                    <div className="button_view">
                        <Button>
                            <UploadOutlined />
                            更换头像
                        </Button>
                    </div>
                </Upload>
            </div>
        </div>
    );
};
export default BaseView;