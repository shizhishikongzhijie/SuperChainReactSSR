import React,{ useState } from 'react';
import ReactDOM from 'react-dom/client';
import ReactDOMServer from 'react-dom/server';
import { BrowserRouter as Router } from "react-router-dom";
import './css/scrollbar.css'
import { HappyProvider } from '@ant-design/happy-work-theme';
import zhCN from 'antd/locale/zh_CN';

import { ConfigProvider, App } from 'antd';
import store from './store';
import { Provider } from 'react-redux'
import CustomProLayout from './components/CustomProLayout/CustomProLayout';
import reportWebVitals from './reportWebVitals';
import { CustomRouter, RouterBeforeEach } from './components/ProtectedRoute/ProtectedRoute';
import { generateRSAKeyPair, RSADecrypt } from './util/RSAUtil';
import { get } from './util/request';
import './App.css';
const Application=({initialData,isLimit,voteView})=> {
  // const [collapsed, setCollapsed] = useState(false);
 // 在客户端使用 useLayoutEffect
  // useLayoutEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     setCollapsed(window.location.pathname !== '/');
  //   }
  // }, []);
  return (
    <HappyProvider>
      <ConfigProvider locale={zhCN}>
        <App>
          <Provider store={store}>
            <CustomProLayout collapsed={true}>
              <Router>
                <RouterBeforeEach initialData={initialData} isLimit={isLimit} voteView={voteView}>
                  <CustomRouter />
                </RouterBeforeEach>
              </Router>
            </CustomProLayout>
          </Provider>
        </App>
      </ConfigProvider>
    </HappyProvider>
  );
}
export default Application;