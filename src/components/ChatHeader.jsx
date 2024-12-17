import { X, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from '../store/sidebarToggleSlice';
const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useSelector((state) => state.chats)
    const { onlineUsers } = useSelector((state) => state.authenticate)
    const dispatch = useDispatch();
    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Back button */}
                    <button onClick={() => {
                        // setSelectedUser(null)
                        dispatch(toggleSidebar())
                    }}>
                        <ArrowLeft />
                    </button>
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilePic || "images/avatar.png"} alt={selectedUser.fullName} />
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium">{selectedUser.fullname}</h3>
                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>


            </div>
        </div>
    );
};
export default ChatHeader;