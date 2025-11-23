import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
export const https = axios.create({
    baseURL: apiUrl,
})
https.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const userJson = localStorage.getItem("user",);
            if (userJson) {
                const userInfo = JSON.parse(userJson);
                const token = userInfo?.accessToken;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);