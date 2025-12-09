import React, { useState, useEffect } from "react";
import { Page, Box, Text, Button, useNavigate, useSnackbar, Icon } from "zmp-ui";
import { getAccessToken } from "zmp-sdk/apis";
import { useSetRecoilState } from "recoil";
import { userState } from "../../state/user";
import { loginUserZalo } from "../../api/authService";

const Login = () => {
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userState);
    const { openSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    // --- LOGIC ĐĂNG NHẬP (Giữ nguyên như cũ) ---
    // ... import giữ nguyên

    const handleLogin = async () => {
        setLoading(true);
        try {
            const accessToken = await getAccessToken({});
            const res = await loginUserZalo(accessToken);

            console.log("👉 Server trả về:", res.data); // Log để debug

            const responseBody = res.data;

            // --- SỬA ĐOẠN NÀY ĐỂ KHỚP VỚI LOG CỦA BẠN ---

            // 1. Lấy chuỗi Token (nằm trong data -> token -> accessToken)
            const tokenString = responseBody.data?.token?.accessToken;

            // 2. Lấy thông tin User
            const userInfo = responseBody.data?.user;

            if (tokenString) {
                // Lưu chuỗi token sạch vào storage
                localStorage.setItem("user_token", tokenString);

                // Lưu info user vào State
                setUser({
                    isAuthenticated: true,
                    ...userInfo
                });

                openSnackbar({ type: "success", text: `Chào mừng ${userInfo.name}!` });

                // Chuyển trang
                navigate("/home");
            } else {
                throw new Error("Cấu trúc Token không đúng");
            }
            // ---------------------------------------------

        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            const serverMessage = error.response?.data?.message || error.message;
            openSnackbar({ type: "error", text: "Lỗi: " + serverMessage });
        } finally {
            setLoading(false);
        }
    };
    //     // Debug: In ra ngay lập tức xem code có chạy không
    //     const token = localStorage.getItem("user_token");
    //     console.log("🔍 Kiểm tra Token lúc khởi động:", token);

    //     if (token) {
    //         console.log("✅ Token hợp lệ! Chuẩn bị vào Home...");

    //         // Set User giả lập
    //         setUser({
    //             isAuthenticated: true,
    //             id: "test-user",
    //             name: "Dev Mode User",
    //             avatar: "",
    //             points: 999
    //         });

    //         // --- MẸO QUAN TRỌNG: Dùng setTimeout ---
    //         // Chờ 300ms để đảm bảo Router đã sẵn sàng rồi mới chuyển
    //         setTimeout(() => {
    //             console.log("🚀 Đang thực hiện chuyển trang...");
    //             navigate("/home", { animate: false, replace: true });
    //         }, 300);
    //     } else {
    //         console.log("❌ Không tìm thấy token, ở lại trang Login.");
    //     }
    // }, []);
    return (
        <Page className="bg-white">
            {/* Container chính, căn giữa nội dung theo chiều dọc */}
            <Box className="flex flex-col h-screen justify-between p-6 pt-16 pb-10">

                {/* PHẦN TRÊN: LOGO & TEXT */}
                <Box className="flex flex-col items-center text-center">
                    {/* 1. Khu vực Logo/Hình minh họa */}
                    {/* MẸO: Bạn nên thay thẻ div này bằng thẻ <img src={yourSVG} /> để đẹp nhất */}
                    <div className="mb-10 p-8 bg-blue-50 rounded-full shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent opacity-50"></div>
                        {/* Dùng tạm Icon của Zalo làm ví dụ */}
                        <Icon icon="zi-gift" className="text-blue-600 text-6xl relative z-10" style={{ fontSize: '80px' }} />
                    </div>

                    {/* 2. Tiêu đề và Mô tả */}
                    <Box className="mb-8">
                        <Text.Title size="xLarge" className="font-bold text-gray-800 mb-3">
                            Tích Điểm & Nhận Quà
                        </Text.Title>
                        <Text size="normal" className="text-gray-500 px-6 leading-relaxed">
                            Khám phá thế giới ưu đãi độc quyền dành riêng cho khách hàng thân thiết.
                        </Text>
                    </Box>
                </Box>

                {/* PHẦN DƯỚI: NÚT BẤM */}
                <Box className="w-full">
                    {/* Nút bấm được thiết kế nổi bật */}
                    <Button
                        fullWidth
                        size="large"
                        loading={loading}
                        onClick={handleLogin}
                        // Sử dụng Tailwind để tạo gradient và shadow đẹp mắt
                        className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-200 border-0"
                        style={{ height: '54px', fontSize: '18px', fontWeight: '600' }}
                        prefixIcon={!loading && <Icon icon="zi-arrow-right" />} // Thêm icon mũi tên nếu thích
                    >
                        Bắt đầu ngay
                    </Button>

                    <Text size="xxSmall" className="text-center text-gray-400 mt-6">
                        Được bảo mật bởi Zalo. Nhanh chóng và an toàn.
                    </Text>
                </Box>

            </Box>
        </Page>
    );
};

export default Login;