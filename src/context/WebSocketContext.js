import React, {createContext, useState, useEffect, useRef} from 'react';

export const WebSocketContext = createContext(false, null, () => {});

export const WebSocketProvider = ({children}) => {
    const [isReady, setIsReady] = useState(false);
    const [data, setData] = useState(null);

    const ws = useRef(null);

    useEffect(() => {
        const WS_URL = process.env.WS_URL || 'ws://localhost:7071';
        ws.current = new WebSocket(WS_URL);

        ws.current.onopen = () => setIsReady(true);
        ws.current.onclose = () => setIsReady(false);
        ws.current.onmessage = event => setData(JSON.parse(event.data));

        return () => {
            ws.current.close();
        };
    }, []);

    const value = {
        ready: isReady,
        data,
        send: ws.current?.send.bind(ws.current)
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};