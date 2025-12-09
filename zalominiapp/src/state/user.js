import { atom } from "recoil";

export const userState = atom({
    key: "userState", // ID duy nhất cho atom này (bắt buộc)
    default: {
        isAuthenticated: false, // Cờ kiểm tra xem đã đăng nhập chưa
        id: null,
        zaloId: "",
        name: "Người dùng",
        avatar: "",
        points: 0,
        rank: "Member"
    },
});