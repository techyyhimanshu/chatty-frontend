import { Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { fetchUsers, setSelectedUser } from '../store/chatSlice';
import SidebarSkeleton from './Skeletons/SidebarSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../store/sidebarToggleSlice';

function Sidebar() {
    const { users, isUsersLoading, selectedUser } = useSelector((state) => state.chats);
    const { onlineUsers } = useSelector((state) => state.authenticate);
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        console.log(users)
        if (users.length === 0) {
            dispatch(fetchUsers());
        }
    }, [dispatch, users]);
    const handleChatClick = (user) => {
        dispatch(toggleSidebar())
        dispatch(setSelectedUser(user));
    }
    if (isUsersLoading) return <SidebarSkeleton />;

    const filteredUsers = showOnlineOnly
        ? users.filter((user) => onlineUsers.includes(user._id))
        : users;

    return (
        <aside className="h-full w-full md:w-72 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            {/* Sidebar Header */}
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-3">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm "
                        />
                        <span className="text-sm">Show online only</span>
                    </label>

                </div>
                <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
                {/* <div className="mt-3 lg:flex md:flex sm:flex xs:flex items-center gap-2">
                    
                </div> */}
            </div>


            {/* Chat List */}
            <div className="overflow-y-auto w-full py-3">
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => handleChatClick(user)}
                        className={`
                        w-full p-3 flex items-center gap-3
                        hover:bg-base-300 transition-colors
                        ${selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}
                    `}
                    >
                        {/* Profile Image */}
                        <div className="relative">
                            <img
                                src={user.profilePic || 'images/avatar.png'}
                                alt={user.name || 'Profile'}
                                className="size-12 object-cover rounded-full"
                            />
                            {onlineUsers.includes(user._id) && (
                                <span
                                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                                rounded-full ring-2 ring-zinc-900"
                                />
                            )}
                        </div>

                        {/* User Details */}
                        <div className="text-left min-w-0">
                            <div className="font-medium truncate">{user.fullname || 'Unknown User'}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </aside>


    );
}

export default Sidebar;
