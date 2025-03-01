import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import './css/scrollbar.css'
import zhCN from 'antd/locale/zh_CN';

import {App, ConfigProvider} from 'antd';
import store from './store';
import {Provider} from 'react-redux'
import CustomProLayout from './components/CustomProLayout/CustomProLayout';
import {CustomRouter, RouterBeforeEach} from './components/ProtectedRoute/ProtectedRoute';
import './App.css';

const Application = ({initialData, isLimit, voteView}) => {


    return (
        // <HappyProvider>
            <ConfigProvider locale={zhCN}>
                <App>
                    <Provider store={store}>
                        <CustomProLayout collapsed={true}>
                            <Router>
                                <RouterBeforeEach initialData={initialData} isLimit={isLimit} voteView={voteView}>
                                    <CustomRouter/>
                                </RouterBeforeEach>
                            </Router>
                        </CustomProLayout>
                    </Provider>
                </App>
            </ConfigProvider>
        // </HappyProvider>
    );
}
export default Application;