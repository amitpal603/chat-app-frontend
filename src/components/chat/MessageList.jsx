import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { deleteMessage } from '../../redux/slices/messageSlice';

const MessageList = () => {
    const dispatch = useDispatch();
    const { messages, status } = useSelector((state) => state.message);
    const { user } = useAuth();
    const scrollRef = useRef();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (status === 'loading') {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                <svg className="h-12 w-12 text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-xs uppercase tracking-widest">No messages yet</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => {
                const isMe = msg.senderId === user?._id;
                return (
                    <div 
                        key={msg._id || idx} 
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        ref={idx === messages.length - 1 ? scrollRef : null}
                    >
                        <div className={`max-w-[70%] group relative`}>
                            {msg.image && (
                                <img 
                                    src={msg.image} 
                                    alt="attachment" 
                                    className="rounded-2xl mb-1 max-h-60 object-cover border border-slate-800" 
                                />
                            )}
                            {msg.text && (
                                <div className={`px-4 py-2 rounded-2xl text-sm shadow-lg ${
                                    isMe 
                                    ? 'bg-blue-600 text-white rounded-br-none' 
                                    : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                                }`}>
                                    {msg.text}
                                </div>
                            )}

                            {isMe && (
                                <button 
                                    onClick={() => dispatch(deleteMessage(msg._id))}
                                    className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 bg-red-600/20 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white"
                                    title="Delete Message"
                                >
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}

                            <p className={`text-[9px] mt-1 text-slate-500 uppercase tracking-tighter ${isMe ? 'text-right' : 'text-left'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MessageList;
