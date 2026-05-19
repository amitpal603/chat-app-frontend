import { useSelector, useDispatch } from 'react-redux';
import { 
    sendFriendRequest, 
    handleFriendRequest, 
    fetchMyRequests, 
    clearRequestError 
} from '../redux/slices/requestSlice';
import { useCallback } from 'react';

export const useRequest = () => {
    const dispatch = useDispatch();
    const { pendingRequests, status, error } = useSelector((state) => state.request);

    const sendReq = useCallback(async (receiverId) => {
        return await dispatch(sendFriendRequest(receiverId)).unwrap();
    }, [dispatch]);

    const handleReq = useCallback(async (requestId, status) => {
        return await dispatch(handleFriendRequest({ requestId, status })).unwrap();
    }, [dispatch]);

    const getRequests = useCallback(async () => {
        return await dispatch(fetchMyRequests()).unwrap();
    }, [dispatch]);

    const clearError = useCallback(() => {
        dispatch(clearRequestError());
    }, [dispatch]);

    return {
        pendingRequests,
        status,
        error,
        sendReq,
        handleReq,
        getRequests,
        clearError,
        isLoading: status === 'loading',
    };
};

export default useRequest;
