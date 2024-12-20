import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { connectSocket, disconnectSocket } from "../services/socketService";

const authSlice = createSlice({
    name: "authenticate",
    initialState: {
        authUser: null,
        isAuthenticated: false,
        isAuthChecking: false,
        isSigningUp: false,
        isLoggingIn: false,
        isUpdatingProfile: false,
        onlineUsers: [],
        isSocketConnected: false,
        socket: null
    },
    reducers: {
        setAuthChecking(state, action) {
            state.isAuthChecking = action.payload;
        },
        setSigningUp(state, action) {
            state.isSigningUp = action.payload;
        },
        setLogingIn(state, action) {
            state.isLoggingIn = action.payload;
        },
        setAuthUser(state, action) {
            state.authUser = action.payload;
            state.isAuthenticated = !!action.payload; // If authUser exists, set isAuthenticated to true
        },
        setSocketConnected(state, action) {
            state.isSocketConnected = action.payload;
        },
        setSocket(state, action) {
            state.socket = action.payload;
        },
        setOnlineUsers(state, action) {
            state.onlineUsers = action.payload;
        }
    },
});

export const { setAuthChecking, setSigningUp, setAuthUser, setLogingIn, setSocketConnected, setOnlineUsers, setSocket } = authSlice.actions;
export default authSlice;

// Helper function to handle API call and state update
export const fetchAuthUser = () => async (dispatch, getState) => {
    dispatch(setAuthChecking(true)); // Set loading state
    try {
        const response = await axiosInstance.get("/auth/check", {

        });
        if (response.status === 200) {
            dispatch(setAuthUser(response.data)); // Update state with user data
            const { authUser } = getState().authenticate
            const socket = connectSocket(authUser._id)
            socket.on("getOnlineUsers", (userIds) => {
                dispatch(setOnlineUsers(userIds))
            })

        } else {
            dispatch(setAuthUser(null)); // Reset user state on failure
        }
    } catch (error) {
        console.log("Error fetching auth user:", error);
        dispatch(setAuthUser(null)); // Handle error case
    } finally {
        dispatch(setAuthChecking(false)); // Reset loading state
    }
};

export const signupUser = (data) => async (dispatch) => {
    dispatch(setSigningUp(true)); // Set signing-up state
    try {
        const response = await axiosInstance.post("/auth/signup", data);
        if (response.status === 200 || response.status === 201) {
            dispatch(setAuthUser(response.data)); // Update state with user data
            return true;
        } else if (response.status === 400) {
            dispatch(setAuthUser(response.data)); // Update state with user data
            return response.data
        } else {
            dispatch(setAuthUser(null)); // Reset user state on failure
            return false;
        }
    } catch (error) {
        dispatch(setAuthUser(null)); // Handle error case
        if (error.response.status === 400) {
            toast.error(error.response.data.message)
            return false
        }
        console.log("Error during signup:", error.response);
        return false;
    } finally {
        dispatch(setSigningUp(false)); // Reset signing-up state
    }
};

export const loginUser = (data) => async (dispatch, getState) => {
    dispatch(setLogingIn(true)); // Start login process

    try {
        const response = await axiosInstance.post("/auth/login", data);

        if (response.status === 200 || response.status === 201) {
            const authUser = response.data.data;
            // Update user state and show success message
            dispatch(setAuthUser(authUser));
            toast.success("Login successful");

            // Establish socket connection and handle online users
            const socket = connectSocket(authUser.id);
            socket.on("getOnlineUsers", (userIds) => {
                dispatch(setOnlineUsers(userIds)); // Update online users in state
            });


            // Indicate successful login
            return true;
        }

        // Handle validation errors (e.g., 400 status)
        if (response.status === 400) {
            toast.error(response.data.message || "Invalid credentials");
            return response.data;
        }

        // Unexpected response handling
        toast.error("Unexpected response from server");
        return false;
    } catch (error) {
        // Handle error case
        const errorMessage = error.response?.data?.message || "An error occurred during login";
        toast.error(errorMessage);
        console.error("Login error:", error);
        return false;
    } finally {
        dispatch(setLogingIn(false)); // End login process
    }
};

export const logoutUser = () => async (dispatch) => {
    console.log("Logout initiated...");
    try {
        const response = await axiosInstance.post("/auth/logout");
        if (response.status === 200 || response.status === 201) {
            dispatch(setAuthUser(null)); // Update state with user data
            dispatch(setSocketConnected(false));
            disconnectSocket();
            toast.success("Logout successful");
            return true;
        }

    } catch (error) {
        if (error.response && error.response.status === 400) {
            dispatch(setAuthUser(null)); // Handle specific error case
            toast.error(error.response.data.message);
        } else {
            toast.error("An unexpected error occurred during logout");
        }
        console.log("Error during logout:", error);
        return false;
    }
};