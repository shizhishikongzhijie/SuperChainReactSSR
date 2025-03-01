import React, {useCallback, useEffect, useRef, useState} from 'react';
import VoteViewCardGroup from '../../components/VoteViewCardGroup/VoteViewCardGroup';
import VoteNeededCardGroup from '../../components/VoteNeededCardGroup';
import {Card, Col, Empty, Input, Row, Select, Spin} from 'antd';
import {get} from '../../util/request';
import {AESEncrypt} from '../../util/AESUtil';
import './index.css'

const {Search} = Input;
const Info = ({title, value, bordered}) => {
    return (
        <div className='d-flex flex-column align-items-center'>
            <span>{title}</span>
            <p style={{fontSize: '1.6rem'}}>{value}</p>
            {bordered && <em/>}
        </div>
    );
};

// 投票组件
function Vote() {
    // 状态：当前选中的部分
    const [activeSection, setActiveSection] = useState('managing');
    const [managerCountList, setManagerCountList] = useState([0, 0, 0])
    const [searchType, setSearchType] = useState('1')//Type:  0:已投 1:未投 2:所有
    // 参考：投票列表详情视图的引用
    const tipsViewRef = useRef(null);
    // 状态：投票列表
    const [voteList, setVoteList] = useState([]);
    // 状态：当前选中的投票ID
    const [currentVoteId, setCurrentVoteId] = useState('');

    const [loading, setLoading] = useState(true);

    const onSearch = (value) => {
        console.log(value);
    }

    function searchVoteList() {
        const key = JSON.parse(localStorage.getItem('link')).linkKey
        let creator = JSON.parse(localStorage.getItem('key')).publicKey
        // 获取投票列表数据
        const fetchData = async () => {
            console.log("searchVoteList")
            let res = await get(process.env.BACKEND_URL + '/searchVoteByCreator', {creator: AESEncrypt(creator, key)});
            console.log(JSON.parse(res).data)
            // console.log(JSON.parse(res).data)
            setVoteList(JSON.parse(res).data.voteList)
        }
        fetchData().then(() => setLoading(false))
    }

    function searchVoteByPkType() {
        const key = JSON.parse(localStorage.getItem('link')).linkKey
        // 获取投票列表数据
        get(process.env.BACKEND_URL + '/searchVoteByPkType', {type: AESEncrypt(searchType, key)}).then(res => {
            console.log(res)
            console.log(JSON.parse(res).data)
            let data = JSON.parse(res).data.voteList;
            if (data) {
                setVoteList(data);
                // setLoading(false);
            }
        })
    }

    function searchManagerCount() {
        // 获取投票列表数据
        get(process.env.BACKEND_URL + '/searchManagerCount', {}).then(res => {
            console.log(res)
            console.log(JSON.parse(res).data)
            setManagerCountList(JSON.parse(res).data.managerCountList);
        })
    }

    useEffect(() => {
        searchManagerCount();
        searchVoteList();
    }, [])

    useEffect(() => {
        if (activeSection === 'managing') {
            setLoading(true);

            searchVoteList()
        } else {
            searchVoteByPkType()
        }

    }, [activeSection, searchType])

    // 使用Effect Hook来获取投票列表
    // useEffect(() => {
    //     const fetchVoteList = async () => {
    //         try {
    //             const response = await fetch(process.env.BACKEND_URL+'/getBlockList', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify({ activeSection })
    //             });
    //             const data = await response.json();
    //             if (response.ok) {
    //                 setVoteList(data); // 假设返回的是数组
    //             } else {
    //                 console.error('Failed to fetch vote list:', data);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching vote list:', error);
    //         }
    //     };
    //     fetchVoteList();
    // }, [activeSection]);

    // 回调函数：点击投票详情时触发
    const handleDetailsClick = useCallback((vote) => {
        setCurrentVoteId(vote.id);
        tipsViewRef.current.toggleProfile();
    }, []);

    return (
        <>
            <Card bordered={false}>
                <Row>
                    <Col sm={8} xs={24}>
                        <Info title="管理中" value={managerCountList[0] + "个任务"} bordered/>
                    </Col>
                    <Col sm={8} xs={24}>
                        <Info title="已投票" value={managerCountList[1] + "个任务"} bordered/>
                    </Col>
                    <Col sm={8} xs={24}>
                        <Info title="未投票" value={managerCountList[2] + "个任务"}/>
                    </Col>
                </Row>
            </Card>
            <div className="Vote">

                <div className="vote-navigation">
                    <button onClick={() => setActiveSection('managing')}
                            className={activeSection === 'managing' ? 'active' : ' opacity-50'}>
                        管理
                    </button>
                    <button onClick={() => setActiveSection('voted')}
                            className={activeSection === 'voted' ? 'active' : 'opacity-50 '}>
                        投票
                    </button>
                </div>
                <div className="vote-content">
                    {/* 管理中投票列表 */}
                    {/* {activeSection === 'managing' && <p>这里可以放置管理中的投票列表。</p>} */}
                    {/* 已投票列表 */}
                    {/* {activeSection === 'voted' && <p>这里可以展示用户已投票的列表。</p>} */}
                    {/* 表格 */}
                    <Row justify="end" gutter={{
                        xs: 8,
                        sm: 16,
                        md: 24,
                        lg: 32,
                    }}>
                        <Col>
                            <Select
                                defaultValue="未投票"
                                style={{
                                    width: 120,
                                }}
                                allowClear
                                options={[
                                    {
                                        value: '未投票',
                                        label: '未投票',
                                    },
                                    {
                                        value: '已投票',
                                        label: '已投票',
                                    },
                                    {
                                        value: '已结束',
                                        label: '已结束',
                                    },
                                    {
                                        value: '已过期',
                                        label: '已过期',
                                    },
                                    {
                                        value: '已取消',
                                        label: '已取消',
                                    }
                                ]}
                                onChange={(value) => {
                                    setSearchType(value)
                                    console.log(value)
                                }}
                                placeholder="select it"
                            />
                        </Col>
                        <Col>
                            <Search
                                placeholder="input search text"
                                allowClear
                                onSearch={onSearch}
                                style={{
                                    width: 200,
                                }}
                            />
                        </Col>

                        <Col>
                            Col
                        </Col>
                    </Row>
                    <Spin spinning={loading} delay={500}>
                        {voteList.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/> :
                            activeSection === 'managing' ? <VoteViewCardGroup dataSource={voteList}/> :
                                <VoteNeededCardGroup dataSource={voteList}/>
                        }
                    </Spin>

                </div>
            </div>
            {/* 投票详情视图 */}
        </>
    );
}

export default Vote;