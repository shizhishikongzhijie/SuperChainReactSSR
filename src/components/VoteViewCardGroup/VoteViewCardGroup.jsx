import React, {useEffect, useRef, useState} from 'react';
import {ProCard, ProDescriptions} from '@ant-design/pro-components';
import {Button, Drawer, message, Pagination} from 'antd';
import RcResizeObserver from 'rc-resize-observer'
import {get} from "../../util/request";
import CountGroup from "../CountGroup";

const VoteViewCard = ({dataSourceItem}) => {
    const actionRef = useRef();
    const [isEditable, setIsEditable] = useState(false);
    const [open, setOpen] = useState(false);
    const [countVoteData, setCountVoteData] = useState({});
    const [countVoteVid, setCountVoteVid] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            const res = await get(process.env.BACKEND_URL + '/countVote', {voteId: countVoteVid}).catch(err => {
                message.error("服务器连接失败");
            })
            // console.log(res);
            setCountVoteData(JSON.parse(res).data);
        };
        fetchData();
    }, [countVoteVid]);
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const countClick = () => {
        console.log("data: " + JSON.stringify(dataSourceItem))
        setCountVoteVid(dataSourceItem.voteId)
        showDrawer()
    }
    return (<>
        <ProDescriptions
            // loading={false}
            actionRef={actionRef}
            //  bordered
            formProps={{
                onValuesChange: (e, f) => {
                    console.log(e)
                    console.log(f)
                },
            }}
            title="可编辑的定义列表"
            // request={async () => {
            //     return Promise.resolve({
            //         success: true,
            //         data: {...data},
            //     });
            // }}
            dataSource={{...dataSourceItem}}
            editable={isEditable}

            columns={[{

                key: 'title', title: '标题', dataIndex: 'title', copyable: true, ellipsis: true,
            },
                {
                    key: 'startDate', title: '开始时间', dataIndex: 'startDate',
                },
                {
                    key: 'limitDate', title: '结束时间', dataIndex: 'limitDate',

                },
                {
                    key: 'privacy', title: 'privacy', dataIndex: 'privacy',
                },
                {
                    key: 'action',
                    title: '操作',
                    valueType: 'option',
                    render: (index) => [
                        <Button rel="noopener noreferrer"
                                onClick={() => {
                                    setIsEditable(!isEditable);
                                    //开始编辑
                                }}
                        >
                            {isEditable ? "取消编辑" : "编辑"}
                        </Button>,
                        <Button rel="noopener noreferrer"
                                onClick={() => {
                                    if (isEditable) {
                                        setIsEditable(!isEditable);
                                    } else {
                                        window.location.href = `/voteView?vid=${dataSourceItem.voteId}&type=view`;
                                    }
                                }}
                        >
                            {isEditable ? "保存" : "查看"}
                        </Button>,
                        <Button rel="noopener noreferrer"
                                onClick={countClick}
                        >
                            计票
                        </Button>,]

                }]}

        >
            <ProDescriptions.Item label="进度条" valueType="progress">
                {dataSourceItem.uploaderCount !== 0 ? (dataSourceItem.hasVotedCount / dataSourceItem.uploaderCount) * 100 : 0}
            </ProDescriptions.Item>
        </ProDescriptions>
        <Drawer width={640} placement="right" closable={false} onClose={onClose} open={open}>
            <p className="site-description-item-profile-p" style={{marginBottom: 24}}>
                {dataSourceItem.title}
            </p>
            <CountGroup countVoteData={countVoteData}/>
        </Drawer>
    </>);
};

const VoteViewCardGroup = ({dataSource}) => {
    const [responsive, setResponsive] = useState(false);
    const [dataSources, setDataSources] = useState(dataSource);
    const [page, setPageNumber] = useState(1);
    // useEffect(() => {
    //     setDataSources(dataSource);
    // }, [dataSource]);
    //设置dataSource默认值

    return (
        <RcResizeObserver.Collection
            key="resize-observer-a"
            onResize={(offset) => {
                setResponsive(offset.width < 596);
            }}
        >
            <>
                <ProCard.Group ghost direction={responsive ? 'row' : 'column'} style={{marginTop: '16px'}}>
                    {dataSources && dataSources.slice((page - 1) * 5, page * 5).map((item, index) => (// <Badge.Ribbon key={index} text="Hippies" color="purple">
                        <div key={index}>
                            <ProCard
                                style={{marginBottom: 24}}
                                //bordered
                                hoverable
                            >
                                <VoteViewCard dataSourceItem={item}/>
                            </ProCard>
                        </div>

                        // </Badge.Ribbon>
                    ))}

                </ProCard.Group>
                <Pagination
                    align="center"
                    showQuickJumper
                    defaultCurrent={1}
                    total={dataSources.length}
                    current={page}
                    onChange={setPageNumber}
                    pageSize={5}
                    hideOnSinglePage={true}/>
            </>
        </RcResizeObserver.Collection>)
}

export default VoteViewCardGroup;