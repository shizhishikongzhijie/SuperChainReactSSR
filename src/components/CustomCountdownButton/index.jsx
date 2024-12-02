import React, { useState, useEffect } from "react";
import { Button } from "antd";

const CustomCountdownButton = (props) => {
    const [countdownTime, setCountdownTime] = useState(props.countdownTime);
    const [isDisabled, setIsDisabled] = useState(true);
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        let timer = null;
        const updateCountdown = () => {
            setCountdownTime(prevTime => prevTime - 1);
        };

        if (isDisabled) {
            timer = setTimeout(updateCountdown, 1000);
        } else {
            clearTimeout(timer);
        }

        if (countdownTime <= 0) {
            setIsDisabled(false);
            setCountdownTime(props.countdownTime);
        }

        return () => {
            clearTimeout(timer); // 清除定时器，防止内存泄漏
        };
    }, [isDisabled, countdownTime, props.countdownTime]);

    useEffect(() => {
        setButtonText(isDisabled ? `${countdownTime} 秒后可${props.children}` : props.children);
    }, [isDisabled, countdownTime, props.children]);

    return (
        <Button disabled={isDisabled} type={props.type} onClick={props.onClick}>
            {buttonText}
        </Button>
    );
};

export default CustomCountdownButton;