import { useSelector, useDispatch } from 'react-redux';
import { login, logout, setUser, checkAuth } from '../redux/slices/authSlice';
import { useCallback } from 'react';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, status, error } = useSelector((state) => state.auth);

    const handleLogin = useCallback(async (credentials) => {
        return await dispatch(login(credentials)).unwrap();
    }, [dispatch]);

    const handleCheckAuth = useCallback(async () => {
        return await dispatch(checkAuth()).unwrap();
    }, [dispatch]);

    const handleLogout = useCallback(async () => {
        return await dispatch(logout()).unwrap();
    }, [dispatch]);

    const updateAuthUser = useCallback((userData) => {
        dispatch(setUser(userData));
    }, [dispatch]);

    return {
        user,
        status,
        error,
        handleLogin,
        handleCheckAuth,
        handleLogout,
        updateAuthUser,
        isAuthenticated: !!user,
        isLoading: status === 'loading',
    };
};

export default useAuth;
