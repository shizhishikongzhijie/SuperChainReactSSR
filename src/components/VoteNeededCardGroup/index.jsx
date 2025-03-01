import React, {useEffect, useState} from 'react';
import {Button, Card, Input, List, Pagination, Progress, Radio} from 'antd';
import './index.css'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {Search} = Input;
const ListContent = ({creator, startDate, limitDate, hasVotedCount, uploaderCount}) => {
    return (
        <div className='d-flex flex-row justify-content-between w-50'>
            <div className='d-flex flex-column justify-content-center'>
                <span>Creator</span>
                <div className={'creator-text'}>{creator}</div>
            </div>
            <div className='d-flex flex-column justify-content-center'>
                <span>开始时间/结束时间</span>
                <p>{startDate}/{limitDate}</p>
            </div>
            <div className='d-flex flex-column justify-content-center'>
                <Progress
                    percent={hasVotedCount / uploaderCount * 100}
                    status={hasVotedCount < uploaderCount ? 'active' : 'success'}
                    size="small"
                    style={{
                        width: 120,
                    }}
                />
            </div>
        </div>
    );
};
const VoteNeededCardGroup = ({dataSource}) => {
    const [dataSources, setDataSources] = useState(dataSource);
    const [index, setIndex] = useState(1);
    const [paginationProps, setPaginationProps] = useState({
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 5,
        total: 0,
    });
    useEffect(() => {
        // setDataSources(dataSource);
        setPaginationProps({
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: 5,
            total: dataSource != null ? dataSource.length : 0,
        });
    }, [dataSource]);
    const extraContent = (
        <div>
            <RadioGroup defaultValue="all">
                <RadioButton value="all">全部</RadioButton>
                <RadioButton value="progress">进行中</RadioButton>
                <RadioButton value="waiting">等待中</RadioButton>
            </RadioGroup>
            <Search placeholder="请输入" onSearch={() => ({})}/>
        </div>
    );
    return (
        <Card
            bordered={false}
            style={{
                marginTop: 24,
            }}
            styles={{
                body: {
                    padding: '0 32px 40px 32px',
                },
            }}
            // extra={extraContent}
        >
            <List
                size="large"
                rowKey="id"
                dataSource={dataSources.slice((index - 1) * 5, index * 5)}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button
                                key="vote"
                                onClick={(e) => {
                                    e.preventDefault();
                                    //投票，转到投票页面
                                    window.location.href = `/voteView?vid=${item.voteId}&type=edit`;
                                }}
                            >
                                投票
                            </Button>
                        ]}
                    >
                        <List.Item.Meta
                            // avatar={<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png"
                            //                 shape="square" size="large"/>}
                            title={item.title}
                            description={item.description}
                            style={{
                                width: '100px'
                            }}
                        />
                        <ListContent {...item} />
                    </List.Item>
                )}
            />
            <Pagination
                align="center"
                defaultCurrent={1}
                current={index}
                total={dataSources.length}
                pageSize={5}
                onChange={setIndex}
                hideOnSinglePage={true}/>
        </Card>
    );
};

export default VoteNeededCardGroup;
