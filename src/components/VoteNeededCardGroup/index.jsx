import React,{useState,useEffect} from 'react';
import {
    Avatar,
    Card,
    List,
    Progress,
    Radio,
    Input
} from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;
const ListContent = ({ creator, startDate,limitDate, hasVotedCount,uploaderCount}) => {
    return (
        <div className='d-flex flex-row justify-content-between w-50'>
            <div className='d-flex flex-column justify-content-center'>
                <span>Creator</span>
                <p>{creator}</p>
            </div>
            <div className='d-flex flex-column justify-content-center'>
                <span>开始时间/结束时间</span>
                <p>{startDate}/{limitDate}</p>
            </div>
            <div className='d-flex flex-column justify-content-center'>
                <Progress
                    percent={hasVotedCount/uploaderCount*100}
                    status={hasVotedCount<uploaderCount?'active':'success'}
                    size="small"
                    style={{
                        width: 180,
                    }}
                />
            </div>
        </div>
    );
};
const VoteNeededCardGroup = ({ dataSource }) => {
    const [dataSources, setDataSources] = useState([]);
    const [paginationProps,setPaginationProps] = useState({
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 5,
        total: 0,
    });
    useEffect(() => {
        setDataSources(dataSource);
        setPaginationProps({
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: 5,
            total: dataSource!=null?dataSource.length:0,
        });
    }, [dataSource]);
    const extraContent = (
        <div>
            <RadioGroup defaultValue="all">
                <RadioButton value="all">全部</RadioButton>
                <RadioButton value="progress">进行中</RadioButton>
                <RadioButton value="waiting">等待中</RadioButton>
            </RadioGroup>
            <Search placeholder="请输入" onSearch={() => ({})} />
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
                pagination={paginationProps}
                dataSource={dataSources}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <a
                                key="vote"
                                onClick={(e) => {
                                    e.preventDefault();
                                    //投票，转到投票页面
                                }}
                            >
                                投票
                            </a>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png" shape="square" size="large" />}
                            title={<a href="/voteView">{item.title}</a>}
                            description={item.description}
                        />
                        <ListContent {...item} />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default VoteNeededCardGroup;
