import React, { useEffect, useState } from "react";
// 1. IMPORT useSnackbar TỪ zmp-ui
import { Page, Box, Text, Avatar, Icon, useNavigate, Modal, useSnackbar } from "zmp-ui";
import { useRecoilState } from "recoil";
import { userState } from "../../state/user";
import { userApi } from "../../api/userService";
import { rewardApi } from "../../api/rewardService";
import { FaCoffee, FaGift, FaHome, FaQrcode, FaUser, FaStore } from "react-icons/fa";

// Ảnh fallback
const DEFAULT_IMG_HOT = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80";
const DEFAULT_IMG_VOUCHER = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80";

const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
};

const HomePage = () => {
    const [user, setUser] = useRecoilState(userState);
    const [hotDeals, setHotDeals] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const navigate = useNavigate();

    // 2. KHỞI TẠO SNACKBAR (TOAST)
    const { openSnackbar } = useSnackbar();

    // State cho Modal & Loading
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);
    const [isRedeeming, setIsRedeeming] = useState(false);

    // --- LOAD DỮ LIỆU ---
    const fetchData = async () => {
        try {
            const [resUser, resGlobal, resStore] = await Promise.all([
                userApi.getInfo(),
                rewardApi.getGlobalRewards(),
                rewardApi.getRewardsByStore(1).catch(() => ({ data: { data: { rewards: [] } } }))
            ]);

            if (resUser.data?.data?.userZalo) {
                setUser(prev => ({ ...prev, ...resUser.data.data.userZalo }));
            }
            setHotDeals(resGlobal.data?.data?.rewards || []);
            setVouchers(resStore.data?.data?.rewards || []);
        } catch (error) {
            console.log("Lỗi tải dữ liệu:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- XỬ LÝ CLICK ĐỔI QUÀ ---
    const handleRedeemClick = (reward) => {
        if ((user.totalPoints || 0) < reward.pointsNeeded) {
            // 3. THAY ALERT BẰNG SNACKBAR (Lỗi thiếu điểm)
            openSnackbar({
                icon: true,
                text: `Thiếu điểm! Cần thêm ${reward.pointsNeeded - (user.totalPoints || 0)} điểm.`,
                type: "error", // Màu đỏ
                duration: 3000,
            });
            return;
        }
        setSelectedReward(reward);
        setConfirmModalVisible(true);
    };

    // --- XỬ LÝ GỌI API ĐỔI QUÀ ---
    const handleConfirmRedeem = async () => {
        if (!selectedReward) return;
        setIsRedeeming(true);

        try {
            // Gọi API thật
            await rewardApi.redeemReward(selectedReward.id);

            // Cập nhật điểm ngay lập tức
            const newPoints = (user.totalPoints || 0) - selectedReward.pointsNeeded;
            setUser(prev => ({ ...prev, totalPoints: newPoints }));

            setConfirmModalVisible(false);

            // 4. THAY ALERT BẰNG SNACKBAR (Thành công)
            openSnackbar({
                icon: true,
                text: `Đổi "${selectedReward.name}" thành công!`,
                type: "success", // Màu xanh
                duration: 3000,
            });

        } catch (error) {
            console.log("Lỗi đổi quà:", error);
            const errorMsg = error.response?.data?.message || "Có lỗi kết nối, vui lòng thử lại.";

            setConfirmModalVisible(false);

            // 5. THAY ALERT BẰNG SNACKBAR (Lỗi API)
            openSnackbar({
                icon: true,
                text: errorMsg,
                type: "error",
                duration: 3000,
            });
        } finally {
            setIsRedeeming(false);
        }
    };

    return (
        <Page className="bg-gray-100 pb-24 relative">

            {/* HEADER & USER INFO */}
            <div className="bg-red-800 h-48 relative overflow-hidden">
                <div className="absolute right-[-20px] top-[-20px] w-40 h-40 border-[10px] border-white opacity-10 rounded-full"></div>
                <div className="absolute right-10 top-[-40px] w-60 h-60 border-[15px] border-white opacity-10 rounded-full"></div>
                <Box className="p-4 pt-8 text-white">
                    <Text.Title size="xLarge" className="font-bold uppercase tracking-wider">POINTHUB REWARDS</Text.Title>
                </Box>
            </div>

            <Box className="px-4 -mt-20 relative z-10">
                <div className="bg-white rounded-xl shadow-lg p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <Avatar src={user.avatar} size={48} className="border border-gray-200" />
                            <Box>
                                <Text.Title size="large" className="font-bold text-gray-800">{user.name || "Khách hàng"}</Text.Title>
                                <Text size="small" className="text-gray-500">{user.level?.name || "Member"}</Text>
                            </Box>
                        </div>
                        <div className="bg-red-700 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm" onClick={() => navigate('/history')}>
                            <FaCoffee size={16} />
                            <Text className="font-bold">{user.totalPoints || 0}</Text>
                        </div>
                    </div>
                </div>
            </Box>

            {/* HOT DEALS */}
            <Box className="mt-6 pl-4">
                <div className="flex justify-between items-end pr-4 mb-3">
                    <div className="flex items-center gap-1">
                        <Icon icon="zi-lightning" className="text-yellow-500" />
                        <Text.Title size="medium" className="font-bold text-red-800">Hot Deal</Text.Title>
                    </div>
                    <Text size="small" className="text-gray-500">Tất cả {'>'}</Text>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-4 pr-4 scrollbar-hide">
                    {hotDeals.length === 0 && <Text className="text-gray-400 italic text-xs pl-2">Đang tải ưu đãi...</Text>}

                    {hotDeals.map((item) => (
                        <div key={item.id} className="min-w-[160px] w-[160px] bg-white rounded-lg shadow-sm overflow-hidden flex flex-col border border-gray-100">
                            <div className="h-28 bg-gray-200 relative">
                                <img src={item.image || DEFAULT_IMG_HOT} className="w-full h-full object-cover" alt={item.name} />
                                {item.isGlobal && <span className="absolute top-2 left-2 bg-yellow-400 text-red-900 text-[8px] font-bold px-1.5 py-0.5 rounded">TOÀN QUỐC</span>}
                            </div>
                            <div className="p-2.5 flex-1 flex flex-col justify-between">
                                <div>
                                    <Text size="xxSmall" className="font-bold text-red-600 uppercase mb-0.5">SL: {item.quantity}</Text>
                                    <Text size="small" className="font-bold line-clamp-2 h-9 leading-4.5">{item.name}</Text>
                                    <Text size="xxSmall" className="text-gray-400 mt-1">HSD: {formatDate(item.expiredAt)}</Text>
                                </div>
                                <div className="mt-2 flex justify-between items-center">
                                    <div className="flex items-center gap-0.5 text-red-700 font-bold text-sm">
                                        {item.pointsNeeded} <FaCoffee size={12} />
                                    </div>
                                    <button onClick={() => handleRedeemClick(item)} className="bg-red-700 active:bg-red-800 text-white text-[10px] px-3 py-1.5 rounded-full font-bold shadow-sm">
                                        Đổi
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Box>

            {/* VOUCHERS */}
            <Box className="px-4 mt-2">
                <div className="flex justify-between items-end mb-3">
                    <div className="flex items-center gap-1">
                        <FaStore className="text-red-800" />
                        <Text.Title size="medium" className="font-bold text-gray-800">Tại cửa hàng</Text.Title>
                    </div>
                    <Text size="small" className="text-gray-500">Tất cả {'>'}</Text>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {vouchers.length === 0 && <Text className="col-span-2 text-gray-400 italic text-xs text-center">Không tìm thấy voucher nào.</Text>}

                    {vouchers.map((item) => (
                        <div key={item.id} className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col ${!item.isActive ? 'opacity-60 grayscale' : ''}`} onClick={() => item.isActive && handleRedeemClick(item)}>
                            <div className="h-28 bg-red-50 relative">
                                <img src={item.image || DEFAULT_IMG_VOUCHER} className="w-full h-full object-cover" alt="" />
                                {!item.isActive && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-xs">TẠM HẾT</div>}
                            </div>
                            <div className="p-3 flex-1 flex flex-col">
                                <Text size="small" className="font-bold line-clamp-2 h-10 mb-1">{item.name}</Text>
                                <div className="w-full h-[1px] bg-gray-100 my-2 border-dashed border-t"></div>
                                <div className="mt-auto flex justify-between items-center">
                                    <Text className="text-red-700 font-bold text-sm">{item.pointsNeeded} điểm</Text>
                                    <Icon icon="zi-chevron-right" size={16} className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Box>

            {/* BOTTOM NAV */}
            <div className="fixed bottom-0 left-0 right-0 bg-red-800 h-16 rounded-t-2xl shadow-lg flex justify-around items-center text-white z-50">
                <NavItem icon={<FaHome size={20} />} label="Trang Chủ" active />
                <NavItem icon={<FaQrcode size={20} />} label="Tích Điểm" onClick={() => navigate('/earn-points')} />
                <NavItem
                    icon={<FaGift size={20} />}
                    label="Quà Tặng"
                    onClick={() => navigate('/rewards')} // <-- THÊM DÒNG NÀY
                />
                <NavItem icon={<FaUser size={20} />} label="Tài Khoản" />
            </div>

            {/* MODAL XÁC NHẬN */}
            <Modal
                visible={confirmModalVisible}
                title="Xác nhận đổi quà"
                onClose={() => !isRedeeming && setConfirmModalVisible(false)}
                actions={[
                    { text: "Hủy", onClick: () => setConfirmModalVisible(false), disabled: isRedeeming },
                    { text: isRedeeming ? "Đang xử lý..." : "Đổi ngay", highLight: true, onClick: handleConfirmRedeem, disabled: isRedeeming }
                ]}
                description={selectedReward ? `Bạn dùng ${selectedReward.pointsNeeded} điểm để đổi "${selectedReward.name}"?` : ""}
            />
        </Page>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <div className={`flex flex-col items-center gap-1 ${active ? 'opacity-100' : 'opacity-60'} active:opacity-100 active:scale-95 transition-all`} onClick={onClick}>
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
        {active && <div className="w-1/2 h-0.5 bg-white rounded-full mt-0.5"></div>}
    </div>
);

export default HomePage;