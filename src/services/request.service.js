import API from './api';

const requestService = {
    sendFriendRequest: async (receiverId) => {
        return await API.post(`/requests/send/${receiverId}`);
    },

    handleFriendRequest: async (requestId, status) => {
        return await API.patch(`/requests/handle/${requestId}`, { status });
    },

    getMyRequests: async () => {
        return await API.get('/requests/my-requests');
    }
};

export default requestService;
