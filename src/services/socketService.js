// socketService.js
import { io } from "socket.io-client";


let socket = null;

export const connectSocket = (userId) => {
    if (!socket) {
        socket = io("http://localhost:3000", {
            query: {
                userId: userId
            }
        });
    }
    socket.on("getOnlineUsers", (users) => {
    })
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
export const getSocket = () => socket;
