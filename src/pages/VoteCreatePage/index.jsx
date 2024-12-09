import React, { useRef, useState } from 'react';
import TipsViewWindow from '../../components/TipsViewWindow/TipsViewWindow';
import CustomDatePicker from '../../components/DatePicker/CustomDatePicker';
import CustomPopover from '../../components/Popover/CustomPopover';
import { setVote } from '../../rouder/voteSlice';
import { Input, Button, Space, InputNumber, App, Switch } from 'antd';
import {
    ProCard,
    ProForm,
    ProFormList,
    ProFormText,
} from '@ant-design/pro-components';
import { useSelector, useDispatch } from 'react-redux'
import { get } from '../../util/request';
import { AESEncrypt } from '../../util/AESUtil';
const { TextArea } = Input;


function VoteCreateForm() {
    const dispatch = useDispatch();
    const title = useSelector(state => state.vote.title)
    const tipsViewRef = useRef(true);
    let Vote = {
        voteId: '',
        creator: '',
        uploaderCount: '',
        title: '',
        privacy: '',
        description: '',
        startDate: '',
        limitDate: '',
        publicKeyList: '',
        ECPointList: '',
        question: '',
        isMultiple: '',
    };
    let VoteRef = useRef(Vote);
    return (
        <>
            <div className="vote-create-form d-flex flex-column">
                <h3 >{VoteRef.current.title === '' ? '创建投票' : VoteRef.current.title}</h3>
                <div >
                    <div>投票名称 : {VoteRef.current.title}</div>
                    <OptionsItem />
                </div>
            </div>
            <TipsViewWindow ref={tipsViewRef} show={true} closeBtn={false}>
                <form className='d-flex flex-column align-items-center'>
                    <div className="mb-3 mt-3 d-flex flex-column align-items-center">
                        <label className='form-label w-75 m-2'>
                            <CustomPopover id='titlePopover' message='警告' type='warning' content='标题不能为空' />
                            <Input id='title' showCount allowClear maxLength={20} placeholder="请输入投票标题" />
                        </label>
                        <label className='form-label w-75 mb-4 mt-2'>
                            <CustomPopover id='descriptionPopover' message='警告' type='warning' content='描述不能为空' />
                            <TextArea id='description' autoSize={{
                                minRows: 2,
                                maxRows: 6,
                            }}
                                showCount allowClear maxLength={100} placeholder="请输入投票详情（描述）" />
                        </label>
                        <label className='form-label w-75 m-2'>
                            <CustomPopover id='privacyPopover' message='警告' type='warning' content='隐私度不能为空' />
                            <CustomPopover id='privacyPopover' message='提示' type='info' content='隐私度 0 or 1 or 2' >
                                {/* <input className='form-control' type='number' min="0" max="1" step="1" id='privacy' placeholder="请输入投票隐私度" required /> */}
                                <InputNumber id='privacy' min="0" max="2" step="1" maxLength={1} addonBefore="请输入投票隐私度" />
                            </CustomPopover>
                        </label>
                        <label className='form-label w-75 m-2'>
                            <CustomPopover id="uploaderCountPopover" message='警告' type='warning' content='规定的投票者数量不能为空' />
                            <InputNumber id='uploaderCount' min="1" step="1" addonBefore="请输入规定的投票者数量" />
                            <CustomPopover />
                        </label>
                        <label className='form-label w-75 m-2' id='voteDate'>
                            <CustomPopover id='voteDatePopover' message='警告' type='warning' content='投票日期不能为空' />
                            <CustomDatePicker />
                        </label>
                    </div>
                    <Button type="primary" shape="round" size='large' onClick={
                        (event) => {
                            //阻止默认事件
                            //event.preventDefault();
                            if (checkInputIsNotNull(["title", "description", "privacy", "voteDate"])) {
                                VoteRef.current.title = document.getElementById('title').value;
                                VoteRef.current.description = document.getElementById('description').value;
                                VoteRef.current.uploaderCount = document.getElementById('uploaderCount').value;
                                VoteRef.current.startDate = document.getElementById('voteDate').getElementsByTagName('input')[0].value;
                                VoteRef.current.limitDate = document.getElementById('voteDate').getElementsByTagName('input')[1].value;
                                VoteRef.current.privacy = document.getElementById('privacy').value;
                                console.log("投票初始化完成: " + JSON.stringify(Vote));
                                dispatch(setVote(Vote))
                                tipsViewRef.current.toggleProfile()
                            }
                        }}>确定</Button>
                </form>
            </TipsViewWindow>
        </>

    );
}


function checkInputIsNotNull(idList) {


    let isNotNull = true;
    for (let i = 0; i < idList.length; i++) {
        if (idList[i] !== 'voteDate') {
            if (document.getElementById(idList[i]).value === '') {
                let node = document.getElementById(idList[i] + 'Popover');
                node.click();
                setTimeout(() => {
                    node.click();
                }, 1000)
                isNotNull = false;
                break;
            }
        } else {
            if (document.getElementById(idList[i]).getElementsByTagName('input')[0].value === '' || document.getElementById(idList[i]).getElementsByTagName('input')[1].value === '') {
                let node = document.getElementById(idList[i] + 'Popover');
                node.click();
                setTimeout(() => {
                    node.click();
                }, 1000)
                isNotNull = false;
                break;
            }
        }
    }
    return isNotNull;
}



const OptionsItem = () => {
    const isMultipleList = useRef([])
    const actionRef = useRef();
    const dispatch = useDispatch();
    const { message } = App.useApp();
    let initVote = useSelector(state => state.vote);
    const [vote, setVote] = useState({});
    // 转换函数
    function convertDataToMap(data) {
        const resultMap = new Map();

        // 遍历原始数据数组
        data.forEach(item => {
            // 提取问题名称
            const questionName = item.name;
            // 提取选项数组
            const options = item.options.map(option => option.name);

            // 将问题名称和选项数组添加到 Map 中
            resultMap.set(questionName, options);
        });

        return resultMap;
    }
    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        // let itemListString = "";
        values = values.question;
        //遍历values [{"name":"","options":[{"name":"","value":""},{"name":"","value":""}]}]
        // for (let i = 0; i < values.length; i++) {
        //     let item = values[i];
        //     let items = item.options;
        //     if (items.length > 1) {
        //         itemListString += "1"
        //     } else {
        //         itemListString += "0"
        //     }
        // }
        // setVote({
        //     ...initVote,
        //     question: values,
        //     isMultiple: isMultipleList.current.join("")
        // })
        setVote({
            ...initVote,
            question: values,
            isMultiple: isMultipleList.current.join("")
        })
        console.log("投票初始化完成: " + JSON.stringify(vote));
        //第一遍取不到值是对的，因为方法结束后，setVote才会把数值更新
        if (vote.question.length > 0) {
            const voteFomat = vote;
            let question = vote.question;
            voteFomat.question =  Object.fromEntries(convertDataToMap(question));
            voteFomat.creator = JSON.parse(localStorage.getItem('key')).publicKey;
            const key = JSON.parse(localStorage.getItem('link')).linkKey
            let res = await get("http://localhost:8080/setVote", { vote: AESEncrypt(JSON.stringify(voteFomat), key) }).catch(err => {
                message.error("服务器连接失败");
            })
            //如果res有code
            console.log("res:"+res);
            res = JSON.parse(res);
            if (res.code == 200) {
                message.success(res.message);
                window.location.href = '/vote';
            } else if (res.code == 400) {
                message.error(res.message);
            }
        }
    };
    return (
        <ProForm layout="horizontal"
            onFinish={async (values) => {
                await onFinish(values);
            }}
        >
            <Space
                style={{
                    marginBlockEnd: 24,
                }}
            >
                <Button
                    type="primary"
                    onClick={() => {
                        const row = actionRef.current?.getList();
                        console.log(row);
                    }}
                >
                    获取所有数据
                </Button>
            </Space>

            <ProFormList
                name="question"
                label="规格"
                creatorButtonProps={{
                    creatorButtonText: '添加规格项',
                }}
                min={1}
                copyIconProps={false}
                itemRender={({ listDom, action }, { index }) => (
                    <>
                        <ProCard
                            bordered
                            style={{ marginBlockEnd: 8 }}
                            title={`规格${index + 1}`}
                            extra={action}
                            bodyStyle={{ paddingBlockEnd: 0 }}
                        >
                            {listDom}
                        </ProCard>
                        <Switch
                            checkedChildren="单选"
                            unCheckedChildren="多选"
                            defaultChecked
                            onChange={(checked) => {
                                isMultipleList.current[index] = checked ? 0 : 1;
                            }}
                        />
                    </>
                )}
                creatorRecord={{ name: '', options: [{ name: '' }] }}
                initialValue={[
                    { name: '问题', options: [{ name: '红' }, { name: '黄' }] },
                ]}
                actionRef={actionRef}
            >
                <ProFormText
                    style={{ padding: 0 }}

                    name="name"
                    label="问题名"
                />
                <ProForm.Item isListField style={{ marginBlockEnd: 0 }} label="选项值">
                    <ProFormList
                        name="options"
                        creatorButtonProps={{
                            creatorButtonText: '新建',
                            icon: false,
                            type: 'link',
                            style: { width: 'unset' },
                        }}
                        min={1}
                        copyIconProps={false}
                        deleteIconProps={{ tooltipText: '删除' }}
                        itemRender={({ listDom, action }, { index }) => (
                            <>
                                <div
                                    style={{
                                        display: 'inline-flex',
                                        marginInlineEnd: 25,
                                    }}>
                                    {/* {listDom}  相当与这个组件的children*/}
                                    <ProFormText addonBefore={["A:", "B:", "C:", "D:"][index]} allowClear={false} width="xs" name={['name']} />
                                    {action}
                                </div>
                            </>
                        )}
                    >
                    </ProFormList>
                </ProForm.Item>
            </ProFormList>

        </ProForm>
    );
};


export default VoteCreateForm;