import { useSelector, useDispatch } from 'react-redux';
import { searchUsers, fetchMe, clearSearchResults, fetchFriends, setSelectedUser } from '../redux/slices/userSlice';
import { useCallback } from 'react';

export const useUser = () => {
    const dispatch = useDispatch();
    const { searchResults, friends, selectedUser, currentUserProfile, status, error } = useSelector((state) => state.user);

    const handleSearch = useCallback(async (query) => {
        if (!query) {
            dispatch(clearSearchResults());
            return;
        }
        return await dispatch(searchUsers(query)).unwrap();
    }, [dispatch]);

    const getFriendsList = useCallback(async () => {
        return await dispatch(fetchFriends()).unwrap();
    }, [dispatch]);

    const selectChat = useCallback((userData) => {
        dispatch(setSelectedUser(userData));
    }, [dispatch]);

    const getMe = useCallback(async () => {
        return await dispatch(fetchMe()).unwrap();
    }, [dispatch]);

    const resetSearch = useCallback(() => {
        dispatch(clearSearchResults());
    }, [dispatch]);

    return {
        searchResults,
        friends,
        selectedUser,
        currentUserProfile,
        status,
        error,
        handleSearch,
        getFriendsList,
        selectChat,
        getMe,
        resetSearch,
        isSearchLoading: status === 'loading',
    };
};

export default useUser;
