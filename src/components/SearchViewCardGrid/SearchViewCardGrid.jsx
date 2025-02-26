import React, {useEffect, useState} from "react";

import {Card, Divider, Popover, Segmented, Switch, Tabs} from "antd";
import {updateIsChecked, updateSegmentedValue, updateStatus} from "../../rouder/searchFilterSlice";
import {useDispatch, useSelector} from "react-redux";
import {EditOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons';

const SearchViewCardGrid = (props) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(props.pageNumber || 1);
    const [cardNum, setCardNum] = useState(8);
    const dispatch = useDispatch();
    const userpublicKey = useSelector(state => state.user.publicKey);
    const segmentedValue = useSelector(state => state.searchFilter.segmentedValue);
    const isChecked = useSelector(state => state.searchFilter.isChecked);

    useEffect(() => {
        // 每次状态或参数变化时重新过滤并分页
        const filteredData = filterTimer(props.status, segmentedValue, isChecked);
        setData(splitData(filteredData, cardNum));
    }, [props.dataSource, cardNum, props.status, segmentedValue, isChecked]);

    const currentTime = new Date().getTime();

    const filterTimer = (filterType, segmentedValue, isChecked) => {
        let filteredData = props.dataSource;

        // 根据标签类型过滤
        switch (filterType) {
            case '1':
                break;
            case '2':
                filteredData = filteredData.filter(item => item.limitDate > currentTime);
                break;
            case '3':
                filteredData = filteredData.filter(item => item.limitDate < currentTime);
                break;
            case '4':
                filteredData = filteredData.filter(item => item.startDate > currentTime);
                break;
            default:
                break;
        }

        // 根据排序选项过滤
        switch (segmentedValue) {
            case '最多投票':
                filteredData = filteredData.sort((a, b) => b.votes - a.votes);
                break;
            case '最多问题':
                filteredData = filteredData.sort((a, b) => b.questions - a.questions);
                break;
            case '最新发布':
                filteredData = filteredData.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
                break;
            case '最晚结束':
                filteredData = filteredData.sort((a, b) => new Date(b.limitDate) - new Date(a.limitDate));
                break;
            default:
                break;
        }

        // 根据是否开启筛选可填投票过滤
        if (isChecked) {
            filteredData = filteredData.filter(item => item.isFillable);
        }

        return filteredData;
    };

    const splitData = (data, num) => {
        let result = [];
        for (let i = 0; i < data.length; i += num) {
            result.push(data.slice(i, i + num));
        }
        return result;
    };

    return (
        <>
            <Tabs
                activeKey={props.status}
                size="large"
                items={[
                    {label: '全部', key: '1'},
                    {label: '进行中', key: '2'},
                    {label: '已结束', key: '3'},
                    {label: '未开始', key: '4'},
                ]}
                onChange={(value) => {
                    dispatch(updateStatus(value));
                    setPage(1); // 切换标签时重置到第一页
                }}
            />
            <CustomFilter/>
            <div style={{
                marginBlock: "20px",
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(300px, 1fr))",
            }}>
                {data?.[page - 1]?.map((item, index) => (
                        <CustomCard
                            key={index}
                            isCreater={item.creator === userpublicKey}
                            vid={item.voteId}
                            title={item.title}
                            creator={item.creator}
                            description={item.description}
                            limitDate={item.limitDate}
                        />
                ))}
            </div>

        </>
    );
};

const CustomCard = (props) => (
    <Card
        title={props.title}
        bordered={false}
        hoverable={true}
        style={{width: 300}}
        actions={[
            props.isCreater && <SettingOutlined key="setting"/>,
            <EditOutlined key="edit" onClick={() => window.location.href = `/voteView?vid=${props.vid}&type=edit`}/>,
            <EllipsisOutlined key="ellipsis"/>,
        ].filter(Boolean)}
    >
        <p style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{props.creator}</p>
        <p>{props.description}</p>
        <p>{props.limitDate}</p>
    </Card>
);

const CustomFilter = () => {
    const dispatch = useDispatch();
    const segmentedValue = useSelector(state => state.searchFilter.segmentedValue);
    const isChecked = useSelector(state => state.searchFilter.isChecked);

    return (
        <>
            <Segmented
                defaultValue="最多投票"
                style={{marginBottom: 8}}
                size="large"
                onChange={(value) => dispatch(updateSegmentedValue(value))}
                options={['最多投票', '最多问题', '最新发布', '最晚结束']}
                value={segmentedValue}
            />
            <Divider type="vertical"/>
            <Popover content="筛选可填投票" trigger="hover">
                <Switch
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    checked={isChecked}
                    onChange={(value) => dispatch(updateIsChecked(value))}
                />
            </Popover>
        </>
    );
};

export default SearchViewCardGrid;