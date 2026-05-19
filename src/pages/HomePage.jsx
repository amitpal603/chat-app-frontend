import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useRequest } from '../hooks/useRequest';
import { useChat } from '../hooks/useChat';
import ChatContainer from '../components/chat/ChatContainer';
import ProfileModal from '../components/profile/ProfileModal';
import toast from 'react-hot-toast';

const HomePage = () => {
    const { user, handleLogout } = useAuth();
    const { searchResults, friends, selectedUser, handleSearch, getFriendsList, selectChat, isSearchLoading } = useUser();
    const { pendingRequests, getRequests, sendReq, handleReq, isLoading: isRequestLoading } = useRequest();
    const { onlineUsers, unreadCounts, isOnline } = useChat();
    
    const [showRequests, setShowRequests] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getRequests();
        getFriendsList();
    }, [getRequests, getFriendsList]);

    const handleSendRequest = async (receiverId) => {
        try {
            await sendReq(receiverId);
            toast.success("Friend request sent!");
        } catch (error) {
            toast.error(error?.message || error || "Failed to send request");
        }
    };

    const handleAction = async (requestId, status) => {
        try {
            await handleReq(requestId, status);
            toast.success(`Friend request ${status}`);
            if (status === 'accepted') {
                setShowRequests(false);
            }
        } catch (error) {
            toast.error(error?.message || error || "Failed to handle request");
        }
    };

    return (
        <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
            {/* Sidebar */}
            <div className={`w-full md:w-80 border-r border-slate-800 flex-col flex-shrink-0 ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-blue-400">Chats</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{onlineUsers.length} Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setShowRequests(!showRequests)}
                            className="relative p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors group"
                            title="Friend Requests"
                        >
                            <svg className="h-5 w-5 text-slate-300 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {pendingRequests?.length > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-[10px] flex items-center justify-center rounded-full border-2 border-slate-950 font-bold">
                                    {pendingRequests.length}
                                </span>
                            )}
                        </button>
                        <button 
                            onClick={() => setIsProfileOpen(true)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-blue-400"
                            title="Profile Settings"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-full transition-all"
                            title="Logout"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                {/* Search */}
                <div className="p-4">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        {isSearchLoading && (
                            <div className="absolute right-3 top-2.5">
                                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Conditional Rendering: Requests or Friends/Search */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {showRequests ? (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                             <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 mb-2">Friend Requests</h3>
                             {pendingRequests?.length > 0 ? (
                                 pendingRequests.map(req => (
                                     <div key={req._id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800 mb-2">
                                         <div className="flex items-center flex-1 min-w-0">
                                             <img src={req.sender.profilePic || "/default-avatar.png"} alt={req.sender.username} className="h-10 w-10 rounded-full object-cover border border-slate-700" />
                                             <div className="ml-3 overflow-hidden">
                                                 <p className="text-sm font-semibold truncate text-slate-200">{req.sender.fullName}</p>
                                                 <p className="text-[10px] text-slate-500 truncate">@{req.sender.username}</p>
                                             </div>
                                         </div>
                                         <div className="flex items-center gap-2 ml-2">
                                             <button 
                                                 onClick={() => handleAction(req._id, 'accepted')}
                                                 className="p-1.5 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-all"
                                                 title="Accept"
                                             >
                                                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                             </button>
                                             <button 
                                                 onClick={() => handleAction(req._id, 'rejected')}
                                                 className="p-1.5 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                 title="Reject"
                                             >
                                                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                             </button>
                                         </div>
                                     </div>
                                 ))
                             ) : (
                                 <div className="text-center py-10">
                                     <svg className="h-10 w-10 text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v16m8-8H4" /></svg>
                                     <p className="text-slate-500 text-xs italic">No pending requests</p>
                                 </div>
                             )}
                        </div>
                    ) : (
                        <>
                            {searchQuery ? (
                                <>
                                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 mb-2">Search Results</h3>
                                    {searchResults.length > 0 ? (
                                        searchResults.map((u) => (
                                            <div key={u._id} className="flex items-center p-3 hover:bg-slate-900 rounded-xl cursor-default transition-all border border-transparent hover:border-slate-800 group">
                                                <img src={u.profilePic || "/default-avatar.png"} alt={u.username} className="h-10 w-10 rounded-full object-cover border border-slate-700" />
                                                <div className="ml-3 flex-1">
                                                    <p className="text-sm font-semibold group-hover:text-blue-400 transition-colors uppercase tracking-tight">{u.fullName}</p>
                                                    <p className="text-xs text-slate-500">@{u.username}</p>
                                                </div>
                                                {friends.some(f => f._id === u._id) ? (
                                                    <button 
                                                        onClick={() => {
                                                            selectChat(u);
                                                            setSearchQuery("");
                                                        }}
                                                        className="ml-2 p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                                                        title="Message"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                        </svg>
                                                    </button>
                                                ) : u._id !== user._id && (
                                                    <button 
                                                        onClick={() => handleSendRequest(u._id)}
                                                        className="ml-2 p-2 bg-slate-800 hover:bg-blue-600 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        title="Add Friend"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-slate-600 text-xs">No users found</div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 mb-2">Friends</h3>
                                    {friends?.length > 0 ? (
                                        friends.map((friend) => {
                                            const active = isOnline(friend._id);
                                            return (
                                                <div 
                                                    key={friend._id} 
                                                    onClick={() => selectChat(friend)}
                                                    className={`flex items-center p-3 rounded-xl cursor-pointer transition-all border ${selectedUser?._id === friend._id ? 'bg-blue-600/10 border-blue-500/50' : 'hover:bg-slate-900 border-transparent'}`}
                                                >
                                                    <div className="relative">
                                                        <img src={friend.profilePic || "/default-avatar.png"} alt={friend.username} className={`h-10 w-10 rounded-full object-cover border ${selectedUser?._id === friend._id ? 'border-blue-500' : 'border-slate-700'}`} />
                                                        {active && (
                                                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-slate-950 rounded-full"></span>
                                                        )}
                                                    </div>
                                                    <div className="ml-3 flex-1 overflow-hidden">
                                                        <p className={`text-sm font-semibold truncate ${selectedUser?._id === friend._id ? 'text-blue-400' : ''}`}>{friend.fullName}</p>
                                                        <p className="text-[10px] text-slate-500 truncate">@{friend.username}</p>
                                                    </div>
                                                    {unreadCounts[friend._id] > 0 && selectedUser?._id !== friend._id && (
                                                        <div className="bg-blue-600 text-white text-[10px] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full font-bold shadow-lg shadow-blue-600/30">
                                                            {unreadCounts[friend._id]}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-slate-600 text-xs italic">Build your network!</p>
                                            <p className="text-[10px] text-slate-700 mt-1">Search users to add friends</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* My Profile */}
                <div className="p-4 border-t border-slate-800 flex items-center bg-slate-900/30">
                    <img src={user?.profilePic || "/default-avatar.png"} alt="me" className="h-10 w-10 rounded-full border-2 border-blue-500" />
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-bold truncate uppercase">{user?.fullName}</p>
                        <p className="text-xs text-slate-400 truncate">@{user?.username}</p>
                    </div>
                </div>
                <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex-col bg-slate-900/50 overflow-hidden ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
                {selectedUser ? (
                    <ChatContainer />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="text-center space-y-4 max-w-md px-6">
                            <div className="h-20 w-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
                                <svg className="h-10 w-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold uppercase tracking-widest">Select a contact</h1>
                            <p className="text-slate-400 text-sm">Choose a friend from the sidebar or search for new users to begin your conversation.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
