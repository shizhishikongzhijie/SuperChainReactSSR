import React, {useEffect, useState} from 'react';
import {App, Button, Card, Checkbox, DatePicker, Form, Input, Radio, Select, TimePicker} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {get} from '../../util/request';
import {AESEncrypt} from '../../util/AESUtil';

const {Option} = Select;

// 示例数据：问题列表
const questions = [
    {
        id: 1,
        title: '你喜欢什么颜色？',
        type: 'radio',
        options: ['红色', '蓝色', '绿色', '黄色'],
    },
    {
        id: 2,
        title: '选择你喜欢的水果（多选）',
        type: 'checkbox',
        options: ['苹果', '香蕉', '橙子', '葡萄'],
    }
];

const VoteView = () => {
    const {message} = App.useApp();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const voteView = useSelector(state => state.voteView);
    const [type, setType] = useState("");
    const [dataSource, setDataSource] = useState({});
    useEffect(() => {
        setType(voteView.type);
        fetchVoteViewPageDataSource().then(
            (res) => {
                res = JSON.parse(res)
                if (res.code == 200) {
                    res.data.voteView.question = formatVoteQuestion(res.data.voteView.question)
                    setDataSource(res.data.voteView)
                    console.log("dataSource--" + JSON.stringify(res.data.voteView))
                } else {
                    message.info(res.message);
                }
            }
        );
    }, [voteView])


    function formatVoteQuestion(questions) {
        let data = [];
        // 遍历对象的每个键
        let i = 1;
        for (const key in questions) {
            if (questions.hasOwnProperty(key)) {
                console.log(`键: ${key}`);

                // 遍历每个键对应的数组
                data.push({
                    id: i,
                    title: key,
                    type: questions[key].length > 1 ? 'checkbox' : 'radio',
                    options: questions[key]
                });
                i++;
            }
        }
        console.log("dataSource--" + JSON.stringify(data));
        return data;
    }

    const fetchVoteViewPageDataSource = async () => {
        const linkKey = JSON.parse(localStorage.getItem('link')).linkKey
        let requestData = {
            vid: voteView.vid,
            key: JSON.parse(localStorage.getItem("key"))
        }
        //获取linkKey
        const res = await get(process.env.BACKEND_URL + "/voteView", {requestData: AESEncrypt(JSON.stringify(requestData), linkKey)}).catch(err => {
            console.log("resData--err: " + err)
        })
        console.log(res);
        //如果res有code
        return res;
    }
    const onFinish = (values) => {
        const key = JSON.parse(localStorage.getItem('link')).linkKey
        console.log('Received values of form: ', values);
        let req = {
            voteId: voteView.vid,
            data: AESEncrypt(JSON.stringify(values), key),
            uploader: JSON.parse(localStorage.getItem('key')).publicKey
        }
        get(process.env.BACKEND_URL + '/vote', req).then(res => {

        })
        message.success('提交成功！');
    };


    return (
        <div className='d-flex justify-content-center'>
            <Card title={"投票（填写问卷）" + dataSource.title} className='w-75' bordered={false}>
                <Form
                    form={form}
                    name="voteForm"
                    onFinish={onFinish}
                    layout="vertical"
                    scrollToFirstError
                >
                    <CustomFormItems dataSource={dataSource}/>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>

    );
};

const CustomFormItems = (props) => {
    const dataSource = props.dataSource
    console.log("dataSource--" + JSON.stringify(dataSource))
    if (JSON.stringify(dataSource) == "{}") {
        return <div>加载中...</div>
    } else {
        console.log("dataSource--" + JSON.stringify(dataSource.question))

        return dataSource.question.map((item) => (
            <Form.Item
                key={item.id}
                label={item.title}
                // name={`question_${item.id}`}
                name={item.title}
                rules={[
                    {
                        required: true,
                        message: '请回答此问题！',
                    },
                ]}
            >
                {renderQuestion(item)}
            </Form.Item>
        ))
    }
};
const renderQuestion = (question) => {
    switch (question.type) {
        case 'text':
            return <Input placeholder="请输入"/>;
        case 'number':
            return <Input type="number" placeholder="请输入数字"/>;
        case 'radio':
            return (
                <Radio.Group>
                    {question.options.map((option, index) => (
                        <Radio key={index} value={option}>
                            {option}
                        </Radio>
                    ))}
                </Radio.Group>
            );
        case 'checkbox':
            return (
                <Checkbox.Group>
                    {question.options.map((option, index) => (
                        <Checkbox key={index} value={option}>
                            {option}
                        </Checkbox>
                    ))}
                </Checkbox.Group>
            );
        case 'select':
            return (
                <Select placeholder="请选择">
                    {question.options.map((option, index) => (
                        <Option key={index} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>
            );
        case 'date':
            return <DatePicker style={{width: '100%'}}/>;
        case 'time':
            return <TimePicker style={{width: '100%'}}/>;
        default:
            return null;
    }
};
export default VoteView;