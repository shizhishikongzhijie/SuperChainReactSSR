import React from 'react';
import { QuestionCircleOutlined, SyncOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { BrowserView, MobileView } from 'react-device-detect';

const CustomFloatButtonGroup = () => {
    return (
        <>
            <BrowserView>
                <FloatButton.Group style={{ insetInlineEnd: 24, }} trigger="hover"
                    icon={<EllipsisOutlined />}
                >
                    <FloatButton href='/voteCreate' icon={<PlusOutlined />} tooltip={<div>新建投票</div>} />
                    <FloatButton icon={<QuestionCircleOutlined />} />
                    <FloatButton />
                    <FloatButton icon={<SyncOutlined />} tooltip={<div>刷新</div>} onClick={() => {
                        window.location.reload();
                    }} />
                    <FloatButton.BackTop visibilityHeight={400} />
                </FloatButton.Group>
            </BrowserView>
            <MobileView>
                <FloatButton.Group style={{ insetInlineEnd: 24, marginBottom: 150 }}>
                    <FloatButton icon={<SyncOutlined />} />
                    <FloatButton.BackTop visibilityHeight={200} />
                </FloatButton.Group>
            </MobileView>
        </>
    );
}
export default CustomFloatButtonGroup;