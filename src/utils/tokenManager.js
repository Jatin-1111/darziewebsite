// src/utils/tokenManager.js - NEW FILE
class TokenManager {
    constructor() {
        this.TOKEN_KEY = 'authToken';
    }

    setToken(token) {
        try {
            if (token) {
                localStorage.setItem(this.TOKEN_KEY, token);
                console.log('🔐 Token stored successfully');
            }
        } catch (error) {
            console.error('❌ Error storing token:', error);
        }
    }

    getToken() {
        try {
            return localStorage.getItem(this.TOKEN_KEY);
        } catch (error) {
            console.error('❌ Error retrieving token:', error);
            return null;
        }
    }

    removeToken() {
        try {
            localStorage.removeItem(this.TOKEN_KEY);
            console.log('🗑️ Token removed successfully');
        } catch (error) {
            console.error('❌ Error removing token:', error);
        }
    }

    isTokenValid(token = null) {
        const tokenToCheck = token || this.getToken();
        if (!tokenToCheck) return false;

        try {
            // Basic JWT structure check
            const parts = tokenToCheck.split('.');
            if (parts.length !== 3) return false;

            // Decode payload to check expiration
            const payload = JSON.parse(atob(parts[1]));

            // Check if token is expired (with 5 minute buffer)
            const now = Math.floor(Date.now() / 1000);
            return payload.exp > (now + 300);
        } catch (error) {
            console.error('❌ Token validation error:', error);
            return false;
        }
    }
}

export const tokenManager = new TokenManager();