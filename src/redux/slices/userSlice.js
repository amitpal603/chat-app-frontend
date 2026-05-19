import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/user.service';

const initialState = {
    searchResults: [],
    friends: [],
    selectedUser: null,
    currentUserProfile: null,
    status: 'idle',
    error: null,
};

export const searchUsers = createAsyncThunk('user/search', async (query, { rejectWithValue }) => {
    try {
        const response = await userService.searchUsers(query);
        return response.data;
    } catch (error) {
        return rejectWithValue(error || 'Search failed');
    }
});

export const fetchFriends = createAsyncThunk('user/fetchFriends', async (_, { rejectWithValue }) => {
    try {
        const response = await userService.getFriends();
        return response.data;
    } catch (error) {
        return rejectWithValue(error || 'Failed to fetch friends');
    }
});

export const fetchMe = createAsyncThunk('user/fetchMe', async (_, { rejectWithValue }) => {
    try {
        const response = await userService.getCurrentUser();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch user');
    }
});

export const updateAccount = createAsyncThunk('user/updateAccount', async (data, { rejectWithValue }) => {
    try {
        const response = await userService.updateAccountDetails(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error || 'Failed to update account');
    }
});

export const updateAvatar = createAsyncThunk('user/updateAvatar', async (formData, { rejectWithValue }) => {
    try {
        const response = await userService.updateAvatar(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error || 'Failed to update avatar');
    }
});

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.searchResults = action.payload;
            })
            .addCase(searchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchFriends.fulfilled, (state, action) => {
                state.friends = action.payload;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.currentUserProfile = action.payload;
            })
            .addCase(updateAccount.fulfilled, (state, action) => {
                state.currentUserProfile = action.payload;
            })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.currentUserProfile = action.payload;
            });
    },
});

export const { clearSearchResults, setSelectedUser } = userSlice.actions;

export default userSlice.reducer;
