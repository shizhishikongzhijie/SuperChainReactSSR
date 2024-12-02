import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, Children } from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
// 定义TipsViewWindow组件，接收user作为属性
const TipsViewWindow = forwardRef((props, ref) => {
    // 使用useState钩子管理资料卡片的显示状态
    const [isOpen, setIsOpen] = useState(props.show ? true : false);
    // 使用useRef钩子创建对DOM元素的引用
    const profileRef = useRef(null);

    // 定义切换资料卡片显示状态的函数
    useImperativeHandle(ref, () => ({
        toggleProfile() {
            setIsOpen(!isOpen);
        }
    }));
    // const toggleProfile = () => setIsOpen(!isOpen);
    // 定义关闭资料卡片的函数
    const closeProfile = () => setIsOpen(false);

    // 使用useEffect钩子在isOpen状态改变时执行操作
    useEffect(() => {
        // 当资料卡片打开且profileRef.current存在时，滚动到该元素的视图内
        if (isOpen && profileRef.current) {
            profileRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isOpen]);

    // const scrollIntoView = () => {
    //     // 当资料卡片打开且profileRef.current存在时，滚动到该元素的视图内
    //     if (isOpen && profileRef.current) {
    //         profileRef.current.scrollIntoView({ behavior: 'smooth' });
    //     }
    // }
    // scrollIntoView();

    // 当isOpen为false时不渲染组件
    if (!isOpen) return null;

    // 组件的JSX结构
    return (
        <div
            ref={profileRef} // 设置ref属性为profileRef
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.515)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                zIndex: 1000,
            }}
            className="position-fixed-top fixed-top"
        >
            <div className={`col-md-6 col-lg-4 col-xl-3 ${props.className}`}
                style={{
                    // width: '200px',
                    margin: '0 auto',
                    zIndex: 'inherit',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    borderBottomLeftRadius: '15px',
                    borderBottomRightRadius: '15px',
                }}
            >
                <Button className="close" style={{ border: 'none', display: props.closeBtn === false ? 'none' : 'block' }}
                    onClick={closeProfile} // 点击时调用closeProfile函数
                    aria-label="关闭"
                    type="primary"
                    icon={<CloseOutlined />} />
                {Children.toArray(props.children)}
            </div>
        </div>
    );
});

export default TipsViewWindow; // 导出组件