import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://watt-watch-node.onrender.com',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.warn('[API] Request failed:', error.message);
        return Promise.reject(error);
    }
);

export default api;
