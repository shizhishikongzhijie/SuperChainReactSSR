import React, {useCallback, useEffect, useState} from 'react';
import CustomCarousel from '../../components/Carousel/CustomCarousel';
import HomeDataCarousel from '../../components/HomeDataCarousel/HomeDataCarousel';
import {get} from '../../util/request';
import {App} from 'antd';

function Home() {
    let [dataSource, setDataSource] = useState({});
    const {message} = App.useApp();
    // 使用 useCallback 确保函数不会在每次渲染时都重新创建
    const fetchHomePageDataSource = useCallback(async () => {
        if (typeof window !== 'undefined') {
            const res = await get(`${process.env.BACKEND_URL}/api/getHomePage`).catch((error) => {
                console.error("Error fetching home page data:", error);
            });
            return res;
        } else {
            return {};
        }
    }, []);
    // 使用 useEffect 来监听 fetchHomePageDataSource 的变化
    useEffect(() => {
        fetchHomePageDataSource().then(
            (data) => {
                console.log("data: " + data)
                setDataSource(JSON.parse(data));
            }
        );
    }, [fetchHomePageDataSource]);  // 注意依赖数组中包含 fetchHomePageDataSource
    return (
        <>
            {/* end of banner */}
            {dataSource.carouselCard === 1 ? <CustomCarousel/> : <></>}
            <HomeDataCarousel
                ifRender={dataSource}
            />
        </>
    );
}

export default Home;