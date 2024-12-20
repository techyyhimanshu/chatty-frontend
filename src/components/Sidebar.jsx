import { Users, Circle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { fetchUnreadMessages, fetchUsers, setSelectedUser, updateMessageStatus, subscribeToMessages, setUnreadMessages } from '../store/chatSlice';
import SidebarSkeleton from './Skeletons/SidebarSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../store/sidebarToggleSlice';

function Sidebar() {
    const { users, isUsersLoading, selectedUser, unreadMessages, messageReadStatus } = useSelector((state) => state.chats);
    const { authUser } = useSelector((state) => state.authenticate);
    const { onlineUsers } = useSelector((state) => state.authenticate);
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        if (users.length === 0) {
            dispatch(fetchUsers());
            dispatch(fetchUnreadMessages())
        }

    }, [users]);
    useEffect(() => {
        dispatch(subscribeToMessages())

    }, [unreadMessages])
    const handleChatClick = (user) => {
        dispatch(toggleSidebar())
        dispatch(setSelectedUser(user));
        dispatch(subscribeToMessages())
        if (unreadMessages.length > 0) {
            dispatch(updateMessageStatus());
            dispatch(setUnreadMessages([]))
        }
    }
    if (isUsersLoading) return <SidebarSkeleton />;

    const filteredUsers = showOnlineOnly
        ? users.filter((user) => onlineUsers.includes(user._id))
        : users;

    return (
        <aside className="h-full w-full md:w-72 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            {/* Sidebar Header */}
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="size-6" />
                        <span className="font-medium hidden lg:block">Contacts</span>
                    </div>
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                </div>
                {/* <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span> */}
            </div>

            {/* Chat List */}
            <div className="overflow-y-auto py-3 w-full md:w-72 lg:w-72 md">
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => handleChatClick(user)}
                        className={`
                        p-3 flex items-center gap-3 w-full
                        hover:bg-base-300 transition-colors
                        ${selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}
                    `}
                    >
                        {/* Left Section: Profile Image and Details */}
                        <div className="flex items-center gap-3 flex-grow">
                            {/* Profile Image */}
                            <div className="relative">
                                <img
                                    src={user.profilePic || 'images/avatar.png'}
                                    alt={user.name || 'Profile'}
                                    className="h-12 w-12 object-cover rounded-full"
                                />
                                {onlineUsers.includes(user._id) && (
                                    <span
                                        className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 
                                    rounded-full ring-2 ring-zinc-900"
                                    />
                                )}
                            </div>

                            {/* User Details */}

                            <div className="text-left min-w-0">
                                <div className="font-medium truncate">{user.fullname || 'Unknown User'}</div>
                                <div className="text-sm text-zinc-400">
                                    <strong>
                                        {

                                            unreadMessages?.filter((message) => message.senderId === user._id) // Filter out messages sent by the current user
                                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by the latest message (newest first)
                                                .map((message, index) => index === 0 ? message.text : '') // Get the text of the last message
                                        }
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Right Section: Badge for New Messages */}
                        {

                            (() => {
                                const unreadCount = unreadMessages?.filter((message) => message.senderId === user._id).length || 0;
                                return unreadCount > 0 && !messageReadStatus && (
                                    <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1 flex items-center justify-center ml-auto">
                                        {unreadCount}
                                    </span>
                                );
                            })()

                        }


                    </button>
                ))}
            </div>
        </aside>




    );
}

export default Sidebar;
