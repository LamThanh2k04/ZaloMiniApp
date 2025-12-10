import React, { useEffect, useState } from "react";
import { Page, Tabs, Box, Text, Icon, useNavigate, Sheet, Spinner } from "zmp-ui";
import { rewardApi } from "../api/rewardService";
import { QRCodeCanvas } from "qrcode.react";
import { FaClock, FaGift } from "react-icons/fa";

// Ảnh mặc định
const DEFAULT_IMG = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=150&q=80";

// --- 1. COMPONENT HIỂN THỊ 1 ITEM (Giữ nguyên) ---
const RewardItem = ({ item, onClick }) => {
    const info = item.reward || {};
    const status = item.status;

    const getStatusColor = () => {
        if (status === 'used') return "bg-gray-200 text-gray-500";
        if (status === 'expired') return "bg-red-100 text-red-500";
        return "bg-green-100 text-green-600";
    };

    const getStatusText = () => {
        if (status === 'used') return "Đã sử dụng";
        if (status === 'expired') return "Hết hạn";
        return "Sẵn sàng";
    };

    return (
        <div
            className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3 mb-3 relative active:scale-[0.98] transition-transform"
            onClick={() => onClick(item)}
        >
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                <img
                    src={info.image || DEFAULT_IMG}
                    className={`w-full h-full object-cover ${status !== 'unused' ? 'grayscale' : ''}`}
                    alt=""
                />
            </div>
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <Text.Title size="small" className="font-bold line-clamp-2 text-gray-800">
                        {info.name || "Phần thưởng"}
                    </Text.Title>
                    <Text size="xxSmall" className="text-gray-400 mt-1">
                        HSD: {info.expiredAt ? new Date(info.expiredAt).toLocaleDateString('vi-VN') : "N/A"}
                    </Text>
                </div>
                <div className={`self-start text-[10px] font-bold px-2 py-0.5 rounded ${getStatusColor()}`}>
                    {getStatusText()}
                </div>
            </div>
            {status === 'unused' && (
                <div className="absolute right-3 bottom-3 text-red-700 flex items-center gap-1">
                    <Text size="small" className="font-bold">Mở</Text>
                    <Icon icon="zi-chevron-right" size={12} />
                </div>
            )}
        </div>
    );
};

// --- 2. COMPONENT DANH SÁCH (Giữ nguyên) ---
const RewardList = ({ status, onOpenDetail }) => {
    const [rewards, setRewards] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchRewards = async (pageToLoad) => {
        try {
            if (pageToLoad === 1) setLoading(true);
            else setLoadingMore(true);

            const res = await rewardApi.getMyRewards(status, pageToLoad);

            // Backend trả về allReward
            const list = res.data?.data?.allReward || [];
            const pagination = res.data?.data?.pagination || {};

            if (pageToLoad === 1) setRewards(list);
            else setRewards(prev => [...prev, ...list]);

            setTotalPages(pagination.totalPage || 1);
            setPage(pageToLoad);
        } catch (error) {
            console.log("Lỗi tải quà:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        setRewards([]);
        fetchRewards(1);
    }, [status]);

    const handleLoadMore = () => {
        if (page < totalPages) fetchRewards(page + 1);
    };

    if (loading) return <Box className="flex justify-center pt-10"><Spinner visible /></Box>;

    if (rewards.length === 0 && !loading) {
        return (
            <Box className="flex flex-col items-center justify-center pt-20 opacity-50">
                <FaGift size={40} className="text-gray-300 mb-2" />
                <Text size="small" className="text-gray-400">Chưa có quà nào ở mục này</Text>
            </Box>
        );
    }

    return (
        <Box className="p-4 bg-gray-50 min-h-[calc(100vh-100px)] pb-24">
            {rewards.map((item, index) => (
                <RewardItem key={`${item.id}-${index}`} item={item} onClick={onOpenDetail} />
            ))}
            {page < totalPages && (
                <div className="flex justify-center mt-4 mb-8">
                    {loadingMore ? <Spinner size="small" /> : (
                        <button onClick={handleLoadMore} className="bg-white border border-red-200 text-red-700 font-semibold px-4 py-2 rounded-full text-xs shadow-sm">
                            Xem thêm
                        </button>
                    )}
                </div>
            )}
        </Box>
    );
};

// --- 3. TRANG CHÍNH (MAIN PAGE) ---
const MyRewardsPage = () => {
    const navigate = useNavigate();
    const [selectedReward, setSelectedReward] = useState(null);
    const [sheetVisible, setSheetVisible] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // --- SỬA LẠI HÀM NÀY ĐỂ KHỚP DATA BACKEND ---
    const handleOpenDetail = async (item) => {
        setSheetVisible(true);
        setLoadingDetail(true);
        setSelectedReward(null);

        try {
            console.log("Đang lấy chi tiết Reward ID:", item.id);
            const res = await rewardApi.getRewarDetail(item.id);
            console.log("Chi tiết trả về:", res);

            // Cấu trúc: data -> data -> reward (UserVoucher) -> reward (Info)
            const rootData = res.data?.data;

            if (rootData?.reward) {
                // Backend trả về đúng cấu trúc { reward: { ... } }
                // Ta set selectedReward bằng chính object UserVoucher này
                setSelectedReward(rootData.reward);
            } else {
                // Fallback nếu cấu trúc khác
                setSelectedReward(item);
            }

        } catch (error) {
            console.log("Lỗi tải chi tiết:", error);
            setSelectedReward(item);
        } finally {
            setLoadingDetail(false);
        }
    };

    // Helper: Lấy thông tin chi tiết (Tên, Code, Hạn dùng)
    // selectedReward lúc này là UserVoucher
    // selectedReward.reward là thông tin chi tiết voucher
    const detailInfo = selectedReward?.reward || {};

    return (
        <Page className="bg-white">
            <div className="bg-red-800 text-white p-4 pt-10 sticky top-0 z-50 flex items-center gap-2 shadow-md">
                <Icon icon="zi-chevron-left" onClick={() => navigate(-1)} className="cursor-pointer" />
                <Text.Title size="large" className="font-bold">Quà Của Tôi</Text.Title>
            </div>

            <Tabs id="reward-tabs" className="mt-0">
                <Tabs.Tab key="tab1" label="Sẵn sàng">
                    <RewardList status="unused" onOpenDetail={handleOpenDetail} />
                </Tabs.Tab>
                <Tabs.Tab key="tab2" label="Đã dùng">
                    <RewardList status="used" onOpenDetail={handleOpenDetail} />
                </Tabs.Tab>
                <Tabs.Tab key="tab3" label="Hết hạn">
                    <RewardList status="expired" onOpenDetail={() => { }} />
                </Tabs.Tab>
            </Tabs>

            <Sheet
                visible={sheetVisible}
                onClose={() => setSheetVisible(false)}
                autoHeight
                mask
                handler
                swipeToClose
            >
                <Box className="p-6 flex flex-col items-center pb-10 min-h-[400px]">
                    {loadingDetail ? (
                        <div className="flex justify-center items-center h-60">
                            <Spinner />
                        </div>
                    ) : selectedReward ? (
                        <>
                            <Text.Title size="large" className="font-bold text-center mb-1 text-red-800 line-clamp-2">
                                {detailInfo.name}
                            </Text.Title>
                            <Text size="small" className="text-gray-500 mb-6">Đưa mã này cho nhân viên để sử dụng</Text>

                            {/* Mã QR */}
                            <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl mb-4 bg-white shadow-sm flex flex-col items-center w-full max-w-[250px]">
                                <QRCodeCanvas
                                    // Lấy code từ detailInfo.code
                                    value={detailInfo.code || "ERROR"}
                                    size={200}
                                    level="H"
                                    className="w-full h-auto"
                                />
                                {/* Mã Text */}
                                <div className="mt-4 w-full text-center font-mono font-bold text-xl tracking-widest text-red-700 bg-gray-50 py-2 rounded border border-gray-200">
                                    {detailInfo.code}
                                </div>
                            </div>

                            <div className="flex gap-2 items-center text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full text-xs font-bold mt-2">
                                <FaClock /> Hết hạn: {detailInfo.expiredAt ? new Date(detailInfo.expiredAt).toLocaleDateString('vi-VN') : "..."}
                            </div>
                        </>
                    ) : (
                        <Text className="text-gray-400 mt-10">Không tìm thấy dữ liệu</Text>
                    )}

                    <button
                        className="mt-6 w-full bg-red-800 text-white font-bold py-3.5 rounded-xl active:bg-red-900 transition-colors shadow-lg shadow-red-200"
                        onClick={() => setSheetVisible(false)}
                    >
                        Đóng lại
                    </button>
                </Box>
            </Sheet>
        </Page>
    );
};

export default MyRewardsPage;