import React, { Suspense, useRef, useEffect, lazy } from "react";
import { useLocation, useRoutes, useNavigate } from 'react-router-dom';
import Loading from '../../components/LoadingProcess/LoadingProcess';
import { MobileView } from 'react-device-detect';
import BottomNav from '../../components/BottomNav/BottomNav';
import CustomFloatButtonGroup from '../../components/FloatButtonGroup/CustomFloatButtonGroup';
import { setLinkData } from '../../rouder/linkSlice';
import { useSelector, useDispatch } from 'react-redux'
import { Limit } from '../../pages/IpLimitPage';
import { setKeyData } from "../../rouder/userSlice";
import { setVoteView } from "../../rouder/voteViewSlice";
const Home = lazy(() => {
    return import('../../pages/HomePage');
});
const App = lazy(() => {
    return import('../../App');
});
const Vote = lazy(() => {
    return import('../../pages/VotePage');
});
const Search = lazy(() => {
    return import('../../pages/SearchPage');
})
const VoteCreate = lazy(() => {
    return import('../../pages/VoteCreatePage');
});
const User = lazy(() => {
    return import('../../pages/UserPage');
});

const Login = lazy(() => {
    return import('../../pages/LoginPage');
});
const Settings = lazy(() => {
    return import('../../pages/UserPage/settings');
});

const Bind = lazy(() => {
    return import('../../pages/BindPage');
});
const VoteView = lazy(() => {
    return import('../../pages/VoteViewPage');
});

function getFromLocalStorage(key) {
    return localStorage.getItem(key);
}

function setToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}
// 模拟从客户端获取请求头
function getHeaders() {
    // 实际应用中应该从客户端获取请求头
    const Authtooken = {
        Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQcml2YXRlS2V5IjoiMTExMSIsIlB1YmxpY0tleSI6IjIyMjIiLCJleHAiOjE3MjUxMjYyOTYsImlhdCI6MTcyNTEyNDQ5Nn0.HiSRCdB431HtymvLTcYEaS7WZXgvvJHtWKbK2k5A97s"
    };
    // const Authtooken = {
    //     Authorization: ""
    // };
    return Authtooken.Authorization;
}
const CustomRouter = () => {
    const userpublicKey = useSelector(state => state.user.publicKey)
    const userprivateKey = useSelector(state => state.user.privateKey)
    const linkedState = getFromLocalStorage("link") === null ? false : true;
    const Myrouters = [
        {
            path: '/',
            element: <Home />
        },
        {
            path: '/app',
            element: <App />
        },
        {
            path: '/voteCreate',
            element: <VoteCreate />,
            auth: true
        },
        {
            path: '/voteView',
            element: <VoteView />,
            auth: true
        },
        {
            path: '/index',
            element: <Home />
        },
        {
            path: '/vote',
            element: <Vote />,
            auth: true
        },
        {
            path: '/search',
            element: <Search />,
            auth: true
        },
        {
            path: '/user',
            element: <User />,
            auth: true
        },
        {
            path: '/settings',
            element: <Settings />,
            auth: true
        }, {
            path: '/bind',
            element: <Bind />,
            auth: true
        },
        {
            path: '/login',
            element: <Login />
        }
    ];
    return (
        <>
            <Suspense fallback={<Loading />}>{useRoutes(Myrouters)}</Suspense>
            <MobileView><BottomNav /></MobileView>
            <CustomFloatButtonGroup />
        </>
    )
}

const RouterBeforeEach = ({ children, initialData, isLimit,voteView }) => {

    const dispatch = useDispatch()
    const location = useLocation();
    const navigator = useNavigate();
    const token = getFromLocalStorage("token");
    const Authtoken = getHeaders();
    const originalFetch = useRef(global.fetch);
    useEffect(() => {
        console.log("token: " + token);
        console.log("Authtoken: " + Authtoken);
        // 检查是否有认证令牌
        if (!token && !getHeaders()) {
            navigator('/login')
        } else {
            // 如果有认证令牌，设置请求头
            global.fetch = (...args) => {
                const [url, config] = args;
                let headers = config?.headers;

                // 确保 headers 是一个可以修改的对象
                if (headers instanceof Headers) {
                    headers = new Headers(Array.from(headers.entries()));
                } else if (!headers) {
                    headers = new Headers();
                }

                // 添加 Authorization 头
                headers.set('Authorization', `Bearer ${token || Authtoken}`);
                headers.set('LinkId', JSON.parse(window.localStorage.getItem('link')).linkId);
                const newConfig = {
                    ...config,
                    headers
                };

                console.log(newConfig);
                return originalFetch.current(url, newConfig);
            };
        }
    }, [token, Authtoken]);
    console.log(location.pathname);

    let link = getFromLocalStorage("link");
    if (initialData && initialData !== link) {
        console.log("更新storage的link");
        localStorage.setItem("link", initialData)
        console.log("initialData: " + JSON.stringify(initialData));
    }
    link = JSON.parse(getFromLocalStorage("link"));
    if (link) {
        console.log("更新Rudex的link");
        let data = { linkId: link.linkId, linkKey: link.linkKey }
        dispatch(setLinkData(data))
        console.log("linkA: " + JSON.stringify(link));
    }
    const key = JSON.parse(localStorage.getItem("key"));
    if (key) {
        console.log("更新Rudex的key");
        let data = { publicKey: key.publicKey, privateKey: key.privateKey }
        dispatch(setKeyData(data))
        console.log("key: " + JSON.stringify(key));
    }
    voteView = JSON.parse(JSON.stringify(voteView));
    if(voteView.vid!=""&&voteView.type!=""){
        console.log("更新Rudex的voteView");
        dispatch(setVoteView({vid:voteView.vid,type:voteView.type}));
        console.log("voteView: " + JSON.stringify(voteView));
    }
    if (isLimit) {
        return <Limit />;
    } else {
        return children;
    }

};
export { CustomRouter, RouterBeforeEach };