import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth.service';
import userService from '../../services/user.service';

const initialState = {
    user: null,
    status: sessionStorage.getItem('accessToken') ? 'loading' : 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await authService.login(credentials);
        return response.data; // Assuming response structure { data, message, statusCode }
    } catch (error) {
        return rejectWithValue(error || 'Login failed');
    }
});

export const checkAuth = createAsyncThunk('auth/check', async (_, { rejectWithValue }) => {
    try {
        const response = await userService.getCurrentUser();
        return response.data;
    } catch (error) {
        // If 401, just return null (no active session), not necessarily an "error" for the UI
        return rejectWithValue(error);
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await authService.logout();
        return null;
    } catch (error) {
        return rejectWithValue(error || 'Logout failed');
    }
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Extract user and tokens from response
                const { user, accessToken, refreshToken } = action.payload;
                state.user = user;
                
                // Save tokens for persistence
                sessionStorage.setItem('accessToken', accessToken);
                sessionStorage.setItem('refreshToken', refreshToken);
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(checkAuth.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.status = 'failed';
                state.user = null;
                // If the check fails on boot, clear potentially stale tokens
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
                // Clear tokens on logout
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
            });
    },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
