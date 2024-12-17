import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import authSlice from "./authSlice.js"
import { getSocket } from "../services/socketService.js";


const chatSlice = createSlice({
    name: "chats",
    initialState: {
        messages: [],
        users: [],
        selectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false,
    },
    reducers: {
        setUsersLoading(state, action) {
            state.isUsersLoading = action.payload;
        },
        setUsers(state, action) {
            state.users = action.payload;
        },
        setMessages(state, action) {
            state.messages = action.payload;
        },
        setMessagesLoading(state, action) {
            state.isUsersLoading = action.payload;
        },
        setSelectedUser(state, action) {
            state.selectedUser = action.payload;
        },
        addMessage(state, action) {
            state.messages.push(action.payload);
        }


    },
});

export const { setUsersLoading, setMessagesLoading, setMessages, setUsers, setSelectedUser, addMessage } = chatSlice.actions;
export default chatSlice;

export const fetchUsers = () => async (dispatch) => {
    dispatch(setUsersLoading(true)); // Set loading state
    try {
        const response = await axiosInstance.get("/messages/users", {

        });
        if (response.status === 200) {
            console.log(response.data.data)
            dispatch(setUsers(response.data.data)); // Update state with user data
        } else {
            dispatch(setUsers(null)); // Reset user state on failure
        }
    } catch (error) {
        console.log("Error fetching  users:", error);
        dispatch(setUsers(null)); // Handle error case
    } finally {
        dispatch(setUsersLoading(false)); // Reset loading state
    }
};
export const fetchMessages = (id) => async (dispatch, getState) => {
    const { selectedUser } = getState().chats; // Access current state
    dispatch(setMessagesLoading(true)); // Set loading state
    try {
        const response = await axiosInstance.get(`/messages/${selectedUser._id}`, {

        });
        if (response.status === 200) {
            dispatch(setMessages(response.data.data)); // Update state with user data
        } else {
            dispatch(setMessages(null)); // Reset user state on failure
        }
    } catch (error) {
        console.log("Error fetching fetching messages:", error);
        dispatch(setMessages(null)); // Handle error case
    } finally {
        dispatch(setMessagesLoading(false)); // Reset loading state
    }
};
export const sendMessage = (messageData) => async (dispatch, getState) => {
    const { selectedUser, messages } = getState().chats; // Access current state

    if (!selectedUser?._id) {
        console.error("No user selected for sending a message.");
        return;
    }

    try {
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

        if (res.status === 201) {
            // Append the new message to the existing messages array
            const newMessage = res.data.data;
            dispatch(setMessages([...messages, newMessage]));
        } else {
            console.error("Failed to send message. Response:", res);
        }
    } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message. Please try again.");
    }
};
export const subscribeToMessages = () => (dispatch, getState) => {
    const { selectedUser } = getState().chats;

    if (!selectedUser) {
        console.warn("No user selected for subscription.");
        return;
    }

    const socket = getSocket();
    socket.on("newMessage", (newMessage) => {
        const isMessageSentBySelectedUser = newMessage.senderId === selectedUser._id;
        if (!isMessageSentBySelectedUser) return
        dispatch(addMessage(newMessage));
    });
};

export const unSubscribeToMessages = () => () => {
    const socket = getSocket();
    socket.off("newMessage");
};

