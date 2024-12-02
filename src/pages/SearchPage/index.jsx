import React, { useState, useDeferredValue, useEffect } from 'react';
import { Empty, AutoComplete, App } from 'antd';
import { Pagination } from 'antd';
import './index.css'
import SearchViewCardGrid from '../../components/SearchViewCardGrid/SearchViewCardGrid';
import { get } from '../../util/request';
import { AESEncrypt } from '../../util/AESUtil';
function Search() {
    const { message } = App.useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPageNumber] = useState(1);
    
    const deferredTerm = useDeferredValue(searchTerm);
    const isStale = searchTerm !== deferredTerm;
    const [data, setData] = useState([]);
    const [options, setOptions] = useState([]);// 用于存储搜索建议的数组
    const handleSubmit = (event) => {
        event.preventDefault();
        // 处理搜索逻辑，例如调用API或更新状态以显示搜索结果
        console.log(`搜索: ${searchTerm}`);
        setSearchTerm(searchTerm);
    };
    const onSelect = (data) => {
        console.log('onSelect', data);
    };
    const onChange = (data) => {
        setSearchTerm(data);
        // setOptions(data);
    };
    const fetchSearchPageDataSource = async (searchTerm) => {
        //获取linkKey
        console.log("searchTerm--" + searchTerm);
        const linkKey = JSON.parse(localStorage.getItem('link')).linkKey
        console.log("localStorage.getItem('link')--" + linkKey)
        const res = await get("http://localhost:8080/searchVote", { info: AESEncrypt(searchTerm, linkKey) }).catch(err => {
            console.log("resData--err: " + err)
        })
        console.log(res);
        //如果res有code
        if (res && res.code) {
            message.error(JSON.parse(res.code))
            message.error(res.message);
            //重定向到登录页
            window.location.href = '/login';
        } else {
            return res;
        }
    }
    useEffect(() => {
        if (searchTerm != "") {
            // 在组件挂载后，执行异步操作，例如调用API获取搜索建议
            fetchSearchPageDataSource(searchTerm).then(
                (res) => {
                    res = JSON.parse(res)
                    console.log("res.voteList: " + JSON.stringify(res.data.voteList))
                    if (res.code == 200) {
                        setOptions(res.data.voteList.map(item => {
                            return {
                                value: item.title
                            }
                        }))
                        let voteList = res.data.voteList;
                        //voteList是一个数组，每个元素都是一个对象
                        setData(voteList);
                        setPageNumber(res.data.voteList.length)
                    } else {
                        message.info(res.message);
                    }
                }
            );
        }
    }, [searchTerm])
    const onChangePagination = (pageNumber) => {
        console.log('Page: ', pageNumber);
    };
    return (
        <div className="SearchContainer flex-column align-items-center">
            <form className='SearchForm' onSubmit={handleSubmit}>
                <AutoComplete allowClear size='large'
                    value={searchTerm}
                    options={options}
                    onSelect={onSelect}
                    onChange={onChange}
                    placeholder="搜索..."
                />
            </form>
            <div style={{
                opacity: isStale ? 0.5 : 1,
                transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
            }}>
                {searchTerm === '' ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : <SearchViewCardGrid dataSource={data} pageNumber={page} />}
            </div>
            <Pagination showQuickJumper defaultCurrent={page} total={data.length*8} onChange={onChangePagination} hideOnSinglePage={true} />
        </div>
    );
}

export default Search;