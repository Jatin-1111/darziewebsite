// src/utils/apiClient.js - FIXED VERSION
import axios from 'axios';
import { API_BASE_URL, isDevelopment } from '../config/api';
import { tokenManager } from './tokenManager';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    // withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ FIXED: Request interceptor that properly adds Authorization header
apiClient.interceptors.request.use(
    (config) => {
        const token = tokenManager.getToken();

        if (token && tokenManager.isTokenValid(token)) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (isDevelopment()) {
            console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
            if (token) {
                console.log('🔐 Token attached to request');
            }
        }

        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// ✅ FIXED: Response interceptor that handles auth errors
apiClient.interceptors.response.use(
    (response) => {
        if (isDevelopment()) {
            console.log(`✅ API Response: ${response.config.url} - ${response.status}`);
        }
        return response;
    },
    (error) => {
        if (isDevelopment()) {
            console.error('❌ API Response Error:', error.response?.status, error.response?.data);
        }

        // Handle 401 errors by clearing invalid tokens
        if (error.response?.status === 401) {
            console.warn('🚨 Unauthorized request - clearing token');
            tokenManager.removeToken();

            // Only redirect to login if not already on auth pages
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/auth/') && !currentPath.includes('/login')) {
                window.location.href = '/auth/login';
            }
        }

        return Promise.reject(error);
    }
);

export { tokenManager };
export default apiClient;