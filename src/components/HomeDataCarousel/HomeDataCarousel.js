import React from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Statistic, Avatar } from 'antd';
import RcResizeObserver from 'rc-resize-observer';
import { useState } from 'react';
import CustomTimeline from '../../components/CustomTimeline/CustomTimeline';
const { Divider } = ProCard;

const HomeDataCarousel = ({ id, ifRender }) => {

    const [responsive, setResponsive] = useState(false);
    return (
        <>
            <RcResizeObserver.Collection
                key="resize-observer-a"
                onResize={(offset) => {
                    setResponsive(offset.width < 596);
                }}
            >
                <>
                    <ProCard.Group title="核心指标" direction={responsive ? 'column' : 'row'}>
                        <ProCard>
                            <Statistic title="今日UV" value={79.0} precision={2} />
                        </ProCard>
                        <Divider type={responsive ? 'horizontal' : 'vertical'} />
                        <ProCard>
                            <Statistic title="冻结金额" value={112893.0} precision={2} />
                        </ProCard>
                        <Divider type={responsive ? 'horizontal' : 'vertical'} />
                        <ProCard>
                            <Statistic title="信息完整度" value={93} suffix="/ 100" />
                        </ProCard>
                        <Divider type={responsive ? 'horizontal' : 'vertical'} />
                        <ProCard>
                            <Statistic title="冻结金额" value={112893.0} />
                        </ProCard>
                    </ProCard.Group>
                </>
                <Divider type={responsive ? 'horizontal' : 'vertical'} />
                <>
                    <ProCard.Group title="核心指标" bordered direction={responsive ? 'column' : 'row'}>
                        <ProCard>
                            <Avatar size={{
                                xs: 24,
                                sm: 32,
                                md: 40,
                                lg: 64,
                                xl: 80,
                                xxl: 100,
                            }} src="https://xuper-fe-assets.cdn.bcebos.com/static/platform-home/static/images/index/features/icon_01_087c075.svg" />
                            <Statistic title="今日UV" value={79.0} precision={2} />
                        </ProCard>
                        <Divider type={responsive ? 'horizontal' : 'vertical'} />
                        <ProCard>
                            <Avatar size={{
                                xs: 24,
                                sm: 32,
                                md: 40,
                                lg: 64,
                                xl: 80,
                                xxl: 100,
                            }} src="https://xuper-fe-assets.cdn.bcebos.com/static/platform-home/static/images/index/features/icon_01_087c075.svg" />
                            <Statistic title="冻结金额" value={112893.0} precision={2} />
                        </ProCard>
                        <Divider type={responsive ? 'horizontal' : 'vertical'} />
                        <ProCard>
                            <Avatar size={{
                                xs: 24,
                                sm: 32,
                                md: 40,
                                lg: 64,
                                xl: 80,
                                xxl: 100,
                            }} src="https://xuper-fe-assets.cdn.bcebos.com/static/platform-home/static/images/index/features/icon_01_087c075.svg" />
                            <Statistic title="信息完整度" value={93} suffix="/ 100" />
                        </ProCard>
                    </ProCard.Group>

                    <ProCard.Group title="核心指标" bordered direction={responsive ? 'column' : 'row'}>
                        <ProCard>
                            <Avatar size={{
                                xs: 24,
                                sm: 32,
                                md: 40,
                                lg: 64,
                                xl: 80,
                                xxl: 100,
                            }} src="https://xuper-fe-assets.cdn.bcebos.com/static/platform-home/static/images/index/features/icon_01_087c075.svg" />
                            <Statistic title="今日UV" value={79.0} precision={2} />
                        </ProCard>
                        <Divider type={responsive ? 'horizontal' : 'vertical'} />
                        <ProCard>
                            <Avatar size={{
                                xs: 24,
                                sm: 32,
                                md: 40,
                                lg: 64,
                                xl: 80,
                                xxl: 100,
                            }} src="https://xuper-fe-assets.cdn.bcebos.com/static/platform-home/static/images/index/features/icon_01_087c075.svg" />
                            <Statistic title="冻结金额" value={112893.0} precision={2} />
                        </ProCard>
                        <Divider type={responsive ? 'horizontal' : 'vertical'} />
                        <ProCard>
                            <Avatar size={{
                                xs: 24,
                                sm: 32,
                                md: 40,
                                lg: 64,
                                xl: 80,
                                xxl: 100,
                            }} src="https://xuper-fe-assets.cdn.bcebos.com/static/platform-home/static/images/index/features/icon_01_087c075.svg" />
                            <Statistic title="信息完整度" value={93} suffix="/ 100" />
                        </ProCard>
                    </ProCard.Group>
                </>
                <Divider type={responsive ? 'horizontal' : 'vertical'} />
                <ProCard.Group gutter={[100, 100]} ghost>
                    <ProCard style={{ maxWidth: 300, height: 300 }} hoverable bordered>
                        内容
                    </ProCard>
                    <ProCard style={{ maxWidth: 300, height: 300 }} hoverable bordered>
                        内容
                    </ProCard>
                    <ProCard style={{ maxWidth: 300, height: 300 }} hoverable bordered>
                        内容
                    </ProCard>
                    <ProCard style={{ maxWidth: 300, height: 300 }} hoverable bordered>
                        内容
                    </ProCard>
                </ProCard.Group>
                {ifRender.timelineDataCard == 1 ? <ProCard.Group style={{ marginTop: 20 }} ghost>
                    <CustomTimeline />
                </ProCard.Group> : <></>}

            </RcResizeObserver.Collection>
        </>
    );
};




export default HomeDataCarousel;