import { https } from "./config";

// --- API NGƯỜI DÙNG ---
export const userApi = {
    getInfo: () => https.get("/api/userZalo/getInfoUserZalo"),
    updateInfo: (data) => https.put("/api/userZalo/updateUserZalo", data),
    getTransactions: () => https.get("/api/userZalo/getUserTransactionSummary"),
    getNotifications: () => https.get("/api/userZalo/getAllNotificationUser"),
};