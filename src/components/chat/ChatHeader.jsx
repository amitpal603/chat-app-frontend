import React from 'react';
import { useSelector } from 'react-redux';
import { useUser } from '../../hooks/useUser';

const ChatHeader = () => {
    const { selectedUser, selectChat } = useUser();
    const { onlineUsers } = useSelector((state) => state.message);
    const isOnline = onlineUsers.includes(selectedUser?._id);

    if (!selectedUser) return null;

    return (
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => selectChat(null)}
                    className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="relative">
                    <img 
                        src={selectedUser.profilePic || "/default-avatar.png"} 
                        alt={selectedUser.username} 
                        className="h-10 w-10 rounded-full border border-blue-500/30 object-cover" 
                    />
                    {isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-slate-950 rounded-full"></span>
                    )}
                </div>
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-tight">{selectedUser.fullName}</h3>
                    <p className="text-[10px] text-slate-500">
                        {isOnline ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>
            {/* Optional: Add call/video/info icons here if needed */}
        </div>
    );
};

export default ChatHeader;
