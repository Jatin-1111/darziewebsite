// src/config/api.js - FIXED WITH ABSOLUTE URLS
const getApiBaseUrl = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    if (!baseUrl) {
        console.warn('VITE_API_BASE_URL not found, falling back to production URL');
        return 'http://darziecoulture-env-1.eba-nidg3atv.ap-south-1.elasticbeanstalk.com';
    }

    return baseUrl;
};

export const API_BASE_URL = getApiBaseUrl();

// ✅ FIXED: Use absolute URLs to ensure proper API calls
export const API_ENDPOINTS = {
    // Auth endpoints - ABSOLUTE URLS
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    CHECK_AUTH: `${API_BASE_URL}/api/auth/check-auth`,

    // Admin Product endpoints
    ADMIN_PRODUCTS_ADD: `${API_BASE_URL}/api/admin/products/add`,
    ADMIN_PRODUCTS_GET: `${API_BASE_URL}/api/admin/products/get`,
    ADMIN_PRODUCTS_EDIT: (id) => `${API_BASE_URL}/api/admin/products/edit/${id}`,
    ADMIN_PRODUCTS_DELETE: (id) => `${API_BASE_URL}/api/admin/products/delete/${id}`,
    ADMIN_UPLOAD_IMAGE: `${API_BASE_URL}/api/admin/products/upload-image`,

    // Admin Order endpoints
    ADMIN_ORDERS_GET: `${API_BASE_URL}/api/admin/orders/get`,
    ADMIN_ORDER_DETAILS: (id) => `${API_BASE_URL}/api/admin/orders/details/${id}`,
    ADMIN_ORDER_UPDATE: (id) => `${API_BASE_URL}/api/admin/orders/update/${id}`,

    // Shop Product endpoints
    SHOP_PRODUCTS_GET: `${API_BASE_URL}/api/shop/products/get`,
    SHOP_PRODUCT_DETAILS: (id) => `${API_BASE_URL}/api/shop/products/get/${id}`,

    // Shop Cart endpoints
    SHOP_CART_ADD: `${API_BASE_URL}/api/shop/cart/add`,
    SHOP_CART_GET: (userId) => `${API_BASE_URL}/api/shop/cart/get/${userId}`,
    SHOP_CART_DELETE: (userId, productId) => `${API_BASE_URL}/api/shop/cart/${userId}/${productId}`,
    SHOP_CART_UPDATE: `${API_BASE_URL}/api/shop/cart/update-cart`,

    // Shop Address endpoints
    SHOP_ADDRESS_ADD: `${API_BASE_URL}/api/shop/address/add`,
    SHOP_ADDRESS_GET: (userId) => `${API_BASE_URL}/api/shop/address/get/${userId}`,
    SHOP_ADDRESS_UPDATE: (userId, addressId) => `${API_BASE_URL}/api/shop/address/update/${userId}/${addressId}`,
    SHOP_ADDRESS_DELETE: (userId, addressId) => `${API_BASE_URL}/api/shop/address/delete/${userId}/${addressId}`,

    // Shop Order endpoints
    SHOP_ORDER_CREATE: `${API_BASE_URL}/api/shop/order/create`,
    SHOP_ORDER_CAPTURE: `${API_BASE_URL}/api/shop/order/capture`,
    SHOP_ORDER_LIST: (userId) => `${API_BASE_URL}/api/shop/order/list/${userId}`,
    SHOP_ORDER_DETAILS: (id) => `${API_BASE_URL}/api/shop/order/details/${id}`,

    // Shop Search & Review endpoints
    SHOP_SEARCH: (keyword) => `${API_BASE_URL}/api/shop/search/${keyword}`,
    SHOP_REVIEW_ADD: `${API_BASE_URL}/api/shop/review/add`,
    SHOP_REVIEW_GET: (id) => `${API_BASE_URL}/api/shop/review/${id}`,

    // Common Feature endpoints
    FEATURE_IMAGES_GET: `${API_BASE_URL}/api/common/feature/get`,
    FEATURE_IMAGES_ADD: `${API_BASE_URL}/api/common/feature/add`,
};

// Environment helper functions
export const isDevelopment = () => import.meta.env.VITE_NODE_ENV === 'development';
export const isProduction = () => import.meta.env.VITE_NODE_ENV === 'production';

// Debug logging in development
if (isDevelopment()) {
    console.log('🚀 Development Mode Active');
    console.log('📡 API Base URL:', API_BASE_URL);
    console.log('🔍 CHECK_AUTH URL:', API_ENDPOINTS.CHECK_AUTH);
}