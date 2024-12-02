import React from 'react';
import { ProDescriptions, ProCard, ProList } from '@ant-design/pro-components';
import { Input, Tooltip, Pagination, Button,Progress } from 'antd';
import { useState } from 'react';
import { useRef } from 'react';
import RcResizeObserver from 'rc-resize-observer';
import data from '../../testdata/TestData';
const VoteViewCard = ({dataSourceItem}) => {
    const actionRef = useRef();
    const [isEditable, setIsEditable] = useState(false);
    return (
        <ProDescriptions
            actionRef={actionRef}
            //  bordered
            formProps={{
                onValuesChange: (e, f) => console.log(f),
            }}
            title="可编辑的定义列表"
            request={async () => {
                return Promise.resolve({
                    success: true,
                    data: {...dataSourceItem},
                });
            }}
            editable={isEditable}

            columns={[
                {
                    title: '标题',
                    key: 'text',
                    dataIndex: 'title',
                    copyable: true,
                    ellipsis: true,
                },
                // {
                //     title: '状态',
                //     key: 'state',
                //     dataIndex: 'state',
                //     valueType: 'select',

                //     valueEnum: {
                //         all: { text: '全部', status: 'Default' },
                //         open: {
                //             text: '未解决',
                //             status: 'Error',
                //         },
                //         closed: {
                //             text: '已解决',
                //             status: 'Success',
                //         },
                //     },
                // },
                // {
                //     title: '分值',
                //     dataIndex: 'fraction',

                //     valueType: (record) => {
                //         const scoringMethod = record?.state2;
                //         if (scoringMethod === 'Success') return 'select';
                //         return 'digit';
                //     },
                //     fieldProps: {
                //         mode: 'multiple',
                //     },
                //     request: async () =>
                //         ['A', 'B', 'D', 'E', 'F'].map((item, index) => ({
                //             label: item,
                //             value: index,
                //         })),
                // },

                {
                    title: '开始时间',
                    key: 'startDate',
                    dataIndex: 'startDate',

                },
                {
                    title: '结束时间',
                    key: 'limitDate',
                    dataIndex: 'limitDate',

                },
                {
                    title: 'progress',
                    key: 'progress',
                    render: (_, record) => (
                        <Progress
                            percent={dataSourceItem.hasVotedCount / dataSourceItem.uploaderCount * 100}
                            status={dataSourceItem.hasVotedCount < dataSourceItem.uploaderCount ? 'active' : 'success'}
                            size="small"
                            style={{
                                width: 180,
                            }}
                        />
                    ),
                },
                {
                    title: '操作',
                    valueType: 'option',
                    render: () =>
                        [
                            <Button rel="noopener noreferrer" key="link"
                                onClick={() => {
                                    setIsEditable(!isEditable);
                                }}
                            >
                                {isEditable ? "取消编辑" : "编辑"}
                            </Button>,
                            <Button rel="noopener noreferrer" key="link"
                            // onClick={() => {
                            //     setIsEditable(!isEditable);
                            // }}
                            >
                                {isEditable ? "保存" : "查看"}
                            </Button>,
                        ]

                }
            ]}

        >
            {/* <ProDescriptions.Item
                label="进度条"
            >
                <Progress
                            percent={dataSourceItem.hasVotedCount / dataSourceItem.uploaderCount * 100}
                            status={dataSourceItem.hasVotedCount < dataSourceItem.uploaderCount ? 'active' : 'success'}
                            size="small"
                            style={{
                                width: 180,
                            }}
                        />
            </ProDescriptions.Item> */}
        </ProDescriptions>
    );
};

const VoteViewCardGroup = ({dataSource}) => {
    const [responsive, setResponsive] = useState(false);
    const [dataSources, setDataSources] = useState(dataSource || []);
    const [page, setPageNumber] = useState(1);
    const onChangePagination = (pageNumber) => {
        console.log('Page: ', pageNumber);
    };
    //设置dataSource默认值

    return (
        <RcResizeObserver.Collection
            key="resize-observer-a"
            onResize={(offset) => {
                setResponsive(offset.width < 596);
            }}
        >
            <ProCard.Group ghost direction={responsive ? 'row' : 'column'} style={{ marginTop: '16px' }}>
                {(dataSources || []).map((item, index) => (

                    <ProCard key={index}
                        style={{ marginBottom: 24 }}
                        //bordered
                        hoverable
                    >
                        <VoteViewCard dataSourceItem={item} />
                    </ProCard>
                ))}

            </ProCard.Group>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <Pagination showQuickJumper defaultCurrent={page} total={500} onChange={onChangePagination} hideOnSinglePage={true} />
            </div>
        </RcResizeObserver.Collection>
    )
}

export default VoteViewCardGroup;