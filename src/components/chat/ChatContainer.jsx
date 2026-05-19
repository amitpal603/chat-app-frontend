import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatContainer = () => {
    return (
        <div className="flex flex-col h-full overflow-hidden bg-slate-900/10">
            <ChatHeader />
            <MessageList />
            <MessageInput />
        </div>
    );
};

export default ChatContainer;
