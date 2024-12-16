// socketService.js
import { io } from "socket.io-client";


let socket = null;

export const connectSocket = (userId) => {
    if (!socket) {
        socket = io("https://chatty-backend-vaxv.onrender.com", {
            transports: ["websocket"], // Enforce WebSocket protocol
            withCredentials: true, // Ensure credentials are sent
            reconnection: true, // Enable reconnection
            reconnectionAttempts: 5, // Max attempts
            query: {
                userId: userId
            }
        });
    }
    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
    });
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
