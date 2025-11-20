import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
export const https = axios.create({
    baseURL: apiUrl,
})