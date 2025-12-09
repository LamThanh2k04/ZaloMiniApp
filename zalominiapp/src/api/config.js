import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const https = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
        // --- THÊM DÒNG NÀY ĐỂ BỎ QUA CẢNH BÁO NGROK ---
        "ngrok-skip-browser-warning": "true",
        // ----------------------------------------------
    },
});

// Giữ nguyên các interceptor bên dưới (nếu có)
https.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("user_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);