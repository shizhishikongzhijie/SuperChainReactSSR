
import React from 'react';
import {Button,Alert,Popover } from 'antd';
import "./customPopover.css"
function CustomPopover(props) {
    let content = (
        <Alert
            message={props.message}
            description={props.content}
            type={props.type}
            showIcon
        />
    );
    return (
        <Popover content={content} trigger="click" >
            <Button type="primary" id={props.id} style={{display:"none"}}>Hover me</Button>
            {props.children}
        </Popover>
    )
};
export default CustomPopover;