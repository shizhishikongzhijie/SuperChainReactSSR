import React, { useEffect, useState, useRef } from 'react';

const MessageQueueComponent = ({ publicKey }) => {
    const [messages, setMessages] = useState([]);
    const ws = useRef(null);

    useEffect(() => {
        if (!publicKey) return;

        // 使用正确的 WebSocket URL
        ws.current = new WebSocket(`ws://localhost:8001/`);

        ws.current.onopen = () => {
            console.log('WebSocket connection opened');
            ws.current.send(JSON.stringify({ type: 'subscribe', publicKey }));
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'newMessages') {
                    setMessages((prevMessages) => [...prevMessages, ...data.messages]);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
            ws.current = null;
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [publicKey]);

    return (
        <div>
            <h2>Your Messages</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{JSON.stringify(msg)}</li>
                ))}
            </ul>
        </div>
    );
};

export default MessageQueueComponent;