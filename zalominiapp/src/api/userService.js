import { https } from "./config";

// --- API NGƯỜI DÙNG ---
export const userApi = {
    getInfo: () => https.get("/api/userZalo/getInfoUserZalo"),
    updateInfo: (data) => {
        // 1. Tạo FormData
        const formData = new FormData();

        // 2. Chuyển từng field dữ liệu vào FormData
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                if (key === 'birthDate' && data[key] instanceof Date) {
                    formData.append(key, data[key].toISOString());
                }
                else {
                    formData.append(key, data[key]);
                }
            }
        });

        // 3. Gửi đi (THÊM THAM SỐ THỨ 3 ĐỂ GHI ĐÈ HEADER)
        return https.put("/api/userZalo/updateUserZalo", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    getTransactionHistory: (status, page = 1) => {
        // status: 'earned' (kiếm được), 'used' (đã dùng), hoặc null/undefined (lấy tất cả)
        const params = { page };
        if (status) {
            params.status = status;
        }
        return https.get("/api/userZalo/getUserTransactionSummary", { params });
    },
    // 3. Lấy danh sách thông báo
    getNotifications: () => {
        return https.get("/api/userZalo/getAllNotificationUser");
    },

    // 4. Xem chi tiết 1 thông báo
    getNotificationDetail: (notificationId) => {
        return https.get(`/api/userZalo/getInfoNotificationUser/${notificationId}`);
    },

    // 5. Đăng ký đối tác
    registerPartner: (data) => {
        // data: { fullName, phone, email, address }
        return https.post("/api/userZalo/registerPartnerRequest", data);
    }
};