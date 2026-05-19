import API from './api';

const messageService = {
    getMessages: async (userToChatId) => {
        return await API.get(`/messages/${userToChatId}`);
    },

    sendMessage: async (receiverId, messageData) => {
        // messageData can be { text } or a FormData for image upload
        return await API.post(`/messages/send/${receiverId}`, messageData);
    },

    deleteMessage: async (messageId) => {
        return await API.delete(`/messages/${messageId}`);
    },

    markAsRead: async (userToChatId) => {
        return await API.patch(`/messages/read/${userToChatId}`);
    },

    getUnreadCounts: async () => {
        return await API.get('/messages/unread-counts');
    }
};

export default messageService;
