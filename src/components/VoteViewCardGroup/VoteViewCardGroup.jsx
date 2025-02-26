import React, {useRef, useState} from 'react';
import {ProCard, ProDescriptions} from '@ant-design/pro-components';
import {Button, Pagination} from 'antd';
import RcResizeObserver from 'rc-resize-observer'

const VoteViewCard = ({dataSourceItem}) => {
    const [data, setData] = useState(dataSourceItem);
    const actionRef = useRef();
    const [isEditable, setIsEditable] = useState(false);
    return (
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
            dataSource={{...data}}
            editable={isEditable}

            columns={[
                {
                    key: 'title',
                    title: '标题',
                    dataIndex: 'title',
                    copyable: true,
                    ellipsis: true,
                },
                {
                    key: 'startDate',
                    title: '开始时间',
                    dataIndex: 'startDate',

                },
                {
                    key: 'limitDate',
                    title: '结束时间',
                    dataIndex: 'limitDate',

                },
                {
                    key: 'privacy',
                    title: 'privacy',
                    dataIndex: 'privacy',
                },
                {
                    key: 'action',
                    title: '操作',
                    valueType: 'option',
                    render: () =>
                        [
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
                                    setIsEditable(!isEditable);
                                }}
                            >
                                {isEditable ? "保存" : "查看"}
                            </Button>,
                        ]

                }
            ]}

        >
            <ProDescriptions.Item label="进度条" valueType="progress">
                {data.uploaderCount !== 0 ? (data.hasVotedCount / data.uploaderCount) * 100 : 0}
            </ProDescriptions.Item>
        </ProDescriptions>
    );
};

const VoteViewCardGroup = ({dataSource}) => {
    const [responsive, setResponsive] = useState(false);
    const [dataSources, setDataSources] = useState(dataSource);
    const [page, setPageNumber] = useState(1);
    // useEffect(() => {
    //     setDataSources(dataSource);
    // }, [dataSource]);
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
            <>
                <ProCard.Group ghost direction={responsive ? 'row' : 'column'} style={{marginTop: '16px'}}>
                    {dataSources && dataSources.map((item, index) => (
                        // <Badge.Ribbon key={index} text="Hippies" color="purple">
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
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '16px'}}>
                    <Pagination showQuickJumper defaultCurrent={page} total={500} onChange={onChangePagination}
                                hideOnSinglePage={true}/>
                </div>
            </>
        </RcResizeObserver.Collection>
    )
}

export default VoteViewCardGroup;