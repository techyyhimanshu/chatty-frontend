import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, subscribeToMessages, unSubscribeToMessages } from '../store/chatSlice';
import MessageSkeleton from './Skeletons/MessageSkeleton';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import { formatMessageTime } from '../lib/utils';

function ChatContainer() {
    const { messages, isMessagesLoading, selectedUser } = useSelector((state) => state.chats);
    const { authUser, onlineUsers } = useSelector((state) => state.authenticate);
    const dispatch = useDispatch();
    const messageEndRef = useRef(null);
    useEffect(() => {


        if (selectedUser?._id) {
            dispatch(fetchMessages(selectedUser._id));
            dispatch(subscribeToMessages())

            return () => {
                dispatch(unSubscribeToMessages());
            };
        }
    }, [selectedUser?._id, dispatch, onlineUsers]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (!selectedUser) return <p className="text-center text-gray-500">Select a user to start chatting.</p>;
    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }


    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-500">No messages to display.</p>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message._id}
                            className={`chat ${message.senderId === authUser.id ? 'chat-end' : 'chat-start'
                                }`}
                            ref={messageEndRef}
                        >
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border">
                                    <img
                                        src={
                                            message.senderId === authUser.id
                                                ? authUser.profilePic || 'images/avatar.png'
                                                : selectedUser.profilePic || 'images/avatar.png'
                                        }
                                        alt="profile pic"
                                    />
                                </div>
                            </div>
                            <div className="chat-header mb-1">
                                <time className="text-xs opacity-50 ml-1">
                                    {formatMessageTime(message.createdAt)}
                                </time>
                            </div>
                            <div className="chat-bubble flex flex-col">
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt=" Attachment"
                                        className="sm:max-w-[200px] rounded-md mb-2"
                                    />
                                )}
                                {message.text && <p>{message.text}</p>}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <MessageInput />
        </div>
    );
}

export default ChatContainer;
