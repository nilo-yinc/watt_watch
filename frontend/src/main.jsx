import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HashRouter>
            <ThemeProvider>
                <AppProvider>
                    <WebSocketProvider>
                        <App />
                    </WebSocketProvider>
                </AppProvider>
            </ThemeProvider>
        </HashRouter>
    </React.StrictMode>
);
