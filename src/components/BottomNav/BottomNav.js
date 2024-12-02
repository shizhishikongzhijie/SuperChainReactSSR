import React from 'react';
import { MobileView } from 'react-device-detect';
import "./bottomNav.css"
import { Button } from "antd";
import {PlusOutlined, HomeOutlined, SearchOutlined, FilterOutlined, UserOutlined } from '@ant-design/icons';
// 菜单数组
const menu = [
    {
        key: "home",
        title: "首页",
        link: "/",
        type:"text",
        icon: <HomeOutlined />
    },
    {
        key: "vote",
        title: "投票",
        link: "/vote",
        type:"text",
        icon: <FilterOutlined />
    },
    {
        key: "voteCreate",
        title: "发起投票",
        link: "/voteCreate",
        type:"primary",
        icon: <PlusOutlined />
    },
    {
        key: "search",
        title: "搜索",
        link: "/search",
        type:"text",
        icon: <SearchOutlined />
    },
    {
        key: "user",
        title: "我的",
        link: "/user",
        type:"text",
        icon: <UserOutlined />
    }
];

function BottomNav() {
    return (
        <MobileView>
                <ul className="bottomNav">
                    {menu.map(item => (
                        <MenuItem key={item.key} {...item} />
                    ))}
                </ul>
        </MobileView>
    );
}

function MenuItem({ link,type, icon, title }) {
    if (link === "/voteCreate") {
        return (
            <>
                {/* <NavLink to={link} >
                    <span style={{
                        position: " absolute",
                        top: "-70px",
                        backgroundColor: "#4FD675",
                        display: "flex",
                        width: "70px",
                        height: "70px",
                        borderRadius: "100%",
                        left: "-35px"
                    }}>
                        <i style={{ fontSize: "50px", width: "100%", height: "100%" }} className={`fas fa-${icon} d-flex justify-content-center align-items-center`} />
                    </span>
                </NavLink> */}
                <Button type={type} icon={icon}  size="large" href={link} block >
                </Button>
            </>
        );
    }
    else {
        return (

            <>
                {/* <NavLink to={link}>
                    <span>
                        <i className={`fas fa-${icon}`} />
                    </span>
                    <br />
                    <span>{title}</span>
                </NavLink> */}
                <Button type={type} icon={icon} size="large" href={link} block  >
                </Button>
            </>
        );
    }

}

export default BottomNav;
