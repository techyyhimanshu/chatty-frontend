import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "https://chatty-backend-vaxv.onrender.com/api",
    withCredentials: true
})