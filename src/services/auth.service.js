import API from './api';

const authService = {
    register: async (userData) => {
        return await API.post('/auth/register', userData);
    },
    
    login: async (credentials) => {
        return await API.post('/auth/login', credentials);
    },
    
    logout: async () => {
        return await API.post('/auth/logout');
    },
    
    refreshAccessToken: async () => {
        return await API.post('/auth/refresh-token');
    }
};

export default authService;
