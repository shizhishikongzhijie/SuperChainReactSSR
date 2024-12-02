import React from 'react';
import { Popover, Steps } from 'antd';
const customDot = (dot, { status, index }) => (
    <Popover
        content={
            <span>
                step {index} status: {status}
            </span>
        }
    >
        {dot}
    </Popover>
);
const description = 'You can hover on the dot.';
const CustomTimeline = () => {
    return (
        <Steps
            current={1}
            progressDot={customDot}
            items={[
                {
                    title: 'Finished',
                    description,
                },
                {
                    title: 'In Progress',
                    description,
                },
                {
                    title: 'Waiting',
                    description,
                },
                {
                    title: 'Waiting',
                    description,
                },
            ]}
        />)
};
export default CustomTimeline;