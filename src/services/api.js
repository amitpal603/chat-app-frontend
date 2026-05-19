import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    withCredentials: false, // Set to false to support tab-isolated sessions (avoid sharing cookies across tabs)
});

// Request interceptor for adding tokens
API.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for handling errors & refreshing tokens
API.interceptors.response.use(
    (response) => {
        // If the response contains new tokens, update sessionStorage
        if (response.data?.data?.accessToken) {
            sessionStorage.setItem('accessToken', response.data.data.accessToken);
        }
        if (response.data?.data?.refreshToken) {
            sessionStorage.setItem('refreshToken', response.data.data.refreshToken);
        }
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = sessionStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error("No refresh token");

                // Attempt to refresh token manually passing the refresh token in body 
                const response = await axios.post('http://localhost:5000/api/v1/auth/refresh-token', { refreshToken }, { withCredentials: true });
                
                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                sessionStorage.setItem('accessToken', accessToken);
                sessionStorage.setItem('refreshToken', newRefreshToken);

                // Update headers and retry
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return API(originalRequest);
            } catch (refreshError) {
                // Clear tokens if refresh fails
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                return Promise.reject(refreshError.response?.data?.message || refreshError.message);
            }
        }
        
        const errorMessage = error.response?.data?.message || error.message;
        return Promise.reject(errorMessage);
    }
);

export default API;
