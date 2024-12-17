import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import chatSlice from "./chatSlice";
import sidebarToggleSlice from "./sidebarToggleSlice";

const store = configureStore({
    reducer: {
        authenticate: authSlice.reducer,
        chats: chatSlice.reducer,
        sidebar: sidebarToggleSlice.reducer
    }
})
export default store