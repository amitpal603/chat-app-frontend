import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import requestReducer from './slices/requestSlice';
import messageReducer from './slices/messageSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        request: requestReducer,
        message: messageReducer,
    },
});

export default store;
