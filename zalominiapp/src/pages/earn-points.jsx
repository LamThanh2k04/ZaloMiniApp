import React, { useState } from "react";
import { Page, Box, Text, Avatar, useNavigate, Input, Button, useSnackbar } from "zmp-ui"; // Import thêm Input, Button, useSnackbar
import { useRecoilState } from "recoil"; // Đổi sang useRecoilState để cập nhật điểm
import { userState } from "../state/user";
import { QRCodeCanvas } from "qrcode.react";
import { FaChevronLeft, FaInfoCircle, FaKeyboard } from "react-icons/fa";
import { rewardApi } from "../api/rewardService"; // Import API
import { userApi } from "../api/userService";

const EarnPointsPage = () => {
    const [user, setUser] = useRecoilState(userState);
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();

    // State cho ô nhập mã
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    // Mã định danh user
    const memberCode = user.id || "USER_UNKNOWN";

    // --- HÀM XỬ LÝ NHẬP MÃ (GỌI API redeemCode) ---
    const handleRedeemCode = async () => {
        if (!code.trim()) {
            openSnackbar({ text: "Vui lòng nhập mã code!", type: "warning" });
            return;
        }
        setLoading(true);
        try {
            // 1. Gọi API nhập mã
            await rewardApi.redeemCode(code);

            // 2. Thông báo thành công
            openSnackbar({ text: "Nhập mã thành công! Đã cộng điểm.", type: "success" });
            setCode(""); // Xóa ô nhập

            // 3. Gọi lại thông tin User để cập nhật điểm mới nhất
            const res = await userApi.getInfo();
            if (res.data?.data?.userZalo) {
                setUser(prev => ({ ...prev, ...res.data.data.userZalo }));
            }

        } catch (error) {
            console.log(error);
            const msg = error.response?.data?.message || "Mã không hợp lệ hoặc đã hết hạn";
            openSnackbar({ text: msg, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page className="bg-red-800 relative flex flex-col items-center min-h-screen pt-16 pb-10 overflow-y-auto">

            {/* Nút Back */}
            <div
                className="absolute top-15 left-4 z-50 text-white p-2 cursor-pointer"
                onClick={() => navigate(-1)}
            >
                <FaChevronLeft size={24} />
            </div>

            {/* Tiêu đề */}
            <div className="text-center text-white mb-6">
                <Text.Title size="xLarge" className="font-bold uppercase tracking-widest">TÍCH ĐIỂM</Text.Title>
                <Text size="small" className="opacity-80">Đưa mã QR hoặc nhập mã quà tặng</Text>
            </div>

            {/* CARD 1: MÃ QR (GIỮ NGUYÊN) */}
            <Box className="w-[85%] bg-white rounded-2xl shadow-xl overflow-hidden p-6 flex flex-col items-center mb-4">
                <div className="flex items-center gap-3 w-full mb-4 border-b border-gray-100 pb-3">
                    <Avatar src={user.avatar} size={40} />
                    <div className="flex-1">
                        <Text.Title size="medium" className="font-bold text-gray-800">{user.name}</Text.Title>
                        <Text size="xxSmall" className="text-red-600 font-bold">{user.totalPoints || 0} điểm</Text>
                    </div>
                </div>
                <div className="p-2 border-4 border-red-800 rounded-xl mb-2">
                    <QRCodeCanvas value={memberCode} size={180} level={"H"} includeMargin={true} />
                </div>
                <Text className="text-gray-400 text-xs">Mã thành viên: <span className="text-black font-mono font-bold">{memberCode.toString().substring(0, 8)}...</span></Text>
            </Box>

            {/* CARD 2: NHẬP MÃ KHUYẾN MÃI (MỚI THÊM) */}
            <Box className="w-[85%] bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-red-800 font-bold">
                    <FaKeyboard />
                    <Text size="medium">Nhập mã ưu đãi</Text>
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="VD: BANMOI2025"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1"
                    />
                    <Button
                        size="medium"
                        onClick={handleRedeemCode}
                        loading={loading}
                        className="bg-red-800 min-w-[80px]"
                    >
                        Gửi
                    </Button>
                </div>

                <Text size="xxSmall" className="text-gray-400 italic">
                    * Nhập mã in trên hóa đơn hoặc nhận được từ sự kiện để cộng điểm ngay.
                </Text>
            </Box>

        </Page>
    );
};

export default EarnPointsPage;