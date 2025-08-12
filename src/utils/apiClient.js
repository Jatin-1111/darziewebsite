import axios from 'axios';
import { API_BASE_URL, isDevelopment } from '../config/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for debugging in development
if (isDevelopment()) {
    apiClient.interceptors.request.use(
        (config) => {
            console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        },
        (error) => {
            console.error('❌ API Request Error:', error);
            return Promise.reject(error);
        }
    );

    apiClient.interceptors.response.use(
        (response) => {
            console.log(`✅ API Response: ${response.config.url} - ${response.status}`);
            return response;
        },
        (error) => {
            console.error('❌ API Response Error:', error.response?.status, error.response?.data);
            return Promise.reject(error);
        }
    );
}

export default apiClient;