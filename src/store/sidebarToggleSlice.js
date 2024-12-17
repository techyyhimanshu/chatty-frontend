import { createSlice } from "@reduxjs/toolkit";

const sidebarToggleSlice = createSlice({
    name: "sidebar",
    initialState: true,
    reducers: {

        toggleSidebar: (state) => {
            return !state
        }
    }
})
export const { toggleSidebar } = sidebarToggleSlice.actions
export default sidebarToggleSlice;  //export reducer to store.js file