import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

// Backward compatibility: if an old hash URL is opened, normalize it.
if (window.location.hash?.startsWith('#/')) {
    const target = window.location.hash.slice(1);
    window.history.replaceState({}, '', target);
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <AppProvider>
                    <WebSocketProvider>
                        <App />
                    </WebSocketProvider>
                </AppProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
