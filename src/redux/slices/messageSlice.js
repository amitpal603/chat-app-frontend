import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageService from '../../services/message.service';

const initialState = {
    messages: [],
    onlineUsers: [],
    unreadCounts: {}, // { senderId: count }
    status: 'idle',
    error: null,
};

export const fetchMessages = createAsyncThunk('message/fetchMessages', async (userId, { rejectWithValue }) => {
    try {
        const response = await messageService.getMessages(userId);
        return response.data;
    } catch (error) {
        return rejectWithValue(error || 'Failed to fetch messages');
    }
});

export const sendMessage = createAsyncThunk('message/sendMessage', async ({ receiverId, messageData }, { rejectWithValue }) => {
    try {
        const response = await messageService.sendMessage(receiverId, messageData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error || 'Failed to send message');
    }
});

export const deleteMessage = createAsyncThunk('message/deleteMessage', async (messageId, { rejectWithValue }) => {
    try {
        await messageService.deleteMessage(messageId);
        return messageId;
    } catch (error) {
        return rejectWithValue(error || 'Failed to delete message');
    }
});

export const markAsRead = createAsyncThunk('message/markAsRead', async (userToChatId, { rejectWithValue }) => {
    try {
        await messageService.markAsRead(userToChatId);
        return userToChatId;
    } catch (error) {
        return rejectWithValue(error || 'Failed to mark as read');
    }
});

export const fetchUnreadCounts = createAsyncThunk('message/fetchUnreadCounts', async (_, { rejectWithValue }) => {
    try {
        const response = await messageService.getUnreadCounts();
        return response.data;
    } catch (error) {
        return rejectWithValue(error || 'Failed to fetch unread counts');
    }
});

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        addMessage: (state, action) => {
            const exists = state.messages.find(m => m._id === action.payload._id);
            if (!exists) {
                state.messages.push(action.payload);
            }
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        removeMessage: (state, action) => {
            state.messages = state.messages.filter(m => m._id !== action.payload);
        },
        updateUnreadCount: (state, action) => {
            const { senderId, count } = action.payload;
            state.unreadCounts[senderId] = count;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload);
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.messages = state.messages.filter(m => m._id !== action.payload);
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                delete state.unreadCounts[action.payload];
            })
            .addCase(fetchUnreadCounts.fulfilled, (state, action) => {
                state.unreadCounts = action.payload;
            });
    },
});

export const { setOnlineUsers, addMessage, clearMessages, removeMessage, updateUnreadCount } = messageSlice.actions;

export default messageSlice.reducer;
