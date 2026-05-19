import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import requestService from '../../services/request.service';

const initialState = {
    pendingRequests: [],
    status: 'idle',
    error: null,
};

export const fetchMyRequests = createAsyncThunk('request/fetchMyRequests', async (_, { rejectWithValue }) => {
    try {
        const response = await requestService.getMyRequests();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch requests');
    }
});

export const sendFriendRequest = createAsyncThunk('request/sendFriendRequest', async (receiverId, { rejectWithValue }) => {
    try {
        const response = await requestService.sendFriendRequest(receiverId);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Failed to send friend request');
    }
});

export const handleFriendRequest = createAsyncThunk('request/handleFriendRequest', async ({ requestId, status }, { rejectWithValue }) => {
    try {
        const response = await requestService.handleFriendRequest(requestId, status);
        return { requestId, status, data: response.data };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Failed to handle friend request');
    }
});

export const requestSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {
        clearRequestError: (state) => {
            state.error = null;
        },
        addPendingRequest: (state, action) => {
            const exists = state.pendingRequests.find(r => r._id === action.payload._id);
            if (!exists) {
                state.pendingRequests.push(action.payload);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch requests
            .addCase(fetchMyRequests.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMyRequests.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.pendingRequests = action.payload;
            })
            .addCase(fetchMyRequests.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Send request
            .addCase(sendFriendRequest.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Handle request
            .addCase(handleFriendRequest.fulfilled, (state, action) => {
                // Remove the request from pendingRequests once it's handled (accepted or rejected)
                state.pendingRequests = state.pendingRequests.filter(req => req._id !== action.payload.requestId);
            })
            .addCase(handleFriendRequest.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearRequestError, addPendingRequest } = requestSlice.actions;

export default requestSlice.reducer;
