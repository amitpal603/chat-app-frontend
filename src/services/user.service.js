import API from './api';

const userService = {
    getCurrentUser: async () => {
        return await API.get('/users/me');
    },
    
    updateAccountDetails: async (data) => {
        return await API.patch('/users/update-account', data);
    },
    
    updateAvatar: async (formData) => {
        return await API.patch('/users/update-avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    
    searchUsers: async (query) => {
        return await API.get(`/users/search?query=${query}`);
    },
    
    getFriends: async () => {
        return await API.get('/users/friends');
    }
};

export default userService;
