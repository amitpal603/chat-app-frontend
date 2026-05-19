import { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { fetchMessages, sendMessage as sendMessageThunk, addMessage, removeMessage, setOnlineUsers, clearMessages, fetchUnreadCounts, markAsRead } from '../redux/slices/messageSlice';
import { addPendingRequest } from '../redux/slices/requestSlice';
import { fetchFriends } from '../redux/slices/userSlice';
import toast from 'react-hot-toast';
import { useAuth } from './useAuth';

const SOCKET_URL = 'http://localhost:5000';

let socketInstance = null;

export const useChat = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { messages, onlineUsers, unreadCounts, status, error } = useSelector((state) => state.message);
    const { selectedUser } = useSelector((state) => state.user);

    const selectedUserRef = useRef(selectedUser);
    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    // Initialize/Cleanup Socket
    useEffect(() => {
        if (user?._id) {
            if (!socketInstance) {
                socketInstance = io(SOCKET_URL, {
                    query: { userId: user._id },
                });

                socketInstance.on('getOnlineUsers', (users) => {
                    dispatch(setOnlineUsers(users));
                });

                socketInstance.on('newMessage', (message) => {
                    const currentSelected = selectedUserRef.current;
                    const isForSelected = currentSelected?._id === message.senderId || currentSelected?._id === message.receiverId;
                    
                    if (isForSelected) {
                        dispatch(addMessage(message));
                    }
                    dispatch(fetchUnreadCounts()); // Refresh counts on new message
                });

                socketInstance.on('newFriendRequest', (request) => {
                    dispatch(addPendingRequest(request));
                });

                socketInstance.on('friendRequestAccepted', () => {
                    dispatch(fetchFriends());
                    toast.success("Someone accepted your friend request!");
                });

                socketInstance.on('messageDeleted', (messageId) => {
                    dispatch(removeMessage(messageId));
                });
            }
        } else {
            if (socketInstance) {
                socketInstance.close();
                socketInstance = null;
            }
        }
        
        // We intentionally don't close the socket on unmount here
        // to support the singleton pattern across components.
        // It will be closed when the user logs out (user._id becomes null).
    }, [user?._id, dispatch]);

    // Fetch messages and mark as read when a user is selected
    useEffect(() => {
        if (selectedUser?._id) {
            dispatch(fetchMessages(selectedUser._id));
            dispatch(markAsRead(selectedUser._id));
        } else {
            dispatch(clearMessages());
        }
    }, [selectedUser?._id, dispatch]);

    // Initial fetch for unread counts
    useEffect(() => {
        if (user?._id) {
            dispatch(fetchUnreadCounts());
        }
    }, [user?._id, dispatch]);

    const sendMsg = useCallback(async (messageData) => {
        if (!selectedUser?._id) return;
        return await dispatch(sendMessageThunk({ 
            receiverId: selectedUser._id, 
            messageData 
        })).unwrap();
    }, [selectedUser?._id, dispatch]);

    return {
        messages,
        onlineUsers,
        unreadCounts,
        status,
        error,
        sendMsg,
        isLoading: status === 'loading',
        isOnline: (userId) => onlineUsers.includes(userId),
    };
};
