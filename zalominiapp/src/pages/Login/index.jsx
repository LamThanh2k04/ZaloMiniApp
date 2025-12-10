import React, { useState } from "react";
import { Page, Box, Text, Button, useNavigate, useSnackbar, Icon } from "zmp-ui";
import { getAccessToken } from "zmp-sdk/apis";
import { useSetRecoilState } from "recoil";
import { userState } from "../../state/user";
import { loginUserZalo } from "../../api/authService";

// --- CHỌN ẢNH MINH HỌA ---
// Ảnh 1: Hộp quà 3D trên nền xanh (Rất hợp với app Loyalty)
const HERO_IMAGE = "https://img.freepik.com/free-vector/loyalty-program-concept_74855-6543.jpg?w=826&t=st=1709458000~exp=1709458600~hmac=YOUR_HASH";
const Login = () => {
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userState);
    const { openSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const accessToken = await getAccessToken({});
            const res = await loginUserZalo(accessToken);
            console.log("👉 Server trả về:", res.data);

            const responseBody = res.data;
            const tokenString = responseBody.data?.token?.accessToken;
            const userInfo = responseBody.data?.user;

            if (tokenString) {
                localStorage.setItem("user_token", tokenString);
                setUser({
                    isAuthenticated: true,
                    ...userInfo
                });
                openSnackbar({ type: "success", text: `Chào mừng ${userInfo.name}!` });
                navigate("/home");
            } else {
                throw new Error("Cấu trúc Token không đúng");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            const serverMessage = error.response?.data?.message || error.message;
            openSnackbar({ type: "error", text: "Lỗi: " + serverMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page className="bg-white">
            <Box className="flex flex-col h-screen justify-between p-6 pt-10 pb-10">

                {/* PHẦN TRÊN: ẢNH & TEXT */}
                <Box className="flex flex-col items-center text-center">

                    {/* --- 1. KHU VỰC ẢNH MINH HỌA MỚI --- */}
                    <div className="w-full max-w-[280px] aspect-square mb-6 relative">
                        {/* Hiệu ứng nền mờ phía sau ảnh */}
                        <div className="absolute inset-4 bg-blue-200 rounded-full blur-2xl opacity-40 animate-pulse"></div>

                        <img
                            src={HERO_IMAGE}
                            alt="Loyalty Gift"
                            className="w-full h-full object-contain relative z-10 drop-shadow-sm"
                        />
                    </div>

                    {/* 2. Tiêu đề và Mô tả */}
                    <Box className="mb-4">
                        <Text.Title size="xLarge" className="font-extrabold text-blue-800 mb-3 uppercase tracking-wide">
                            POINTHUB
                        </Text.Title>
                        <Text size="large" className="font-bold text-gray-800 mb-2">
                            Tích điểm đổi quà
                        </Text>
                        <Text size="normal" className="text-gray-500 px-4 leading-relaxed">
                            Tham gia ngay để nhận hàng ngàn ưu đãi độc quyền dành riêng cho bạn.
                        </Text>
                    </Box>
                </Box>

                {/* PHẦN DƯỚI: NÚT BẤM */}
                <Box className="w-full">
                    <Button
                        fullWidth
                        size="large"
                        loading={loading}
                        onClick={handleLogin}
                        className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 border-0"
                        style={{ height: '56px', fontSize: '18px', fontWeight: 'bold' }}
                    >
                        Khám phá ngay
                    </Button>

                    <Text size="xxSmall" className="text-center text-gray-400 mt-6 flex justify-center items-center gap-1">
                        <Icon icon="zi-shield-solid" size={14} className="text-gray-400" />
                        Đăng nhập an toàn qua Zalo
                    </Text>
                </Box>

            </Box>
        </Page>
    );
};

export default Login;