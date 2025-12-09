import React, { useEffect, useState } from "react";
import { Page, Tabs, Box, Text, Icon, useNavigate, Sheet, Spinner } from "zmp-ui";
import { rewardApi } from "../api/rewardService";
import { QRCodeCanvas } from "qrcode.react";
import { FaClock, FaGift } from "react-icons/fa";

// Ảnh mặc định
const DEFAULT_IMG = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=150&q=80";

// --- 1. COMPONENT HIỂN THỊ 1 ITEM ---
const RewardItem = ({ item, onClick }) => {
    // Lấy thông tin chi tiết từ object lồng nhau
    const info = item.reward || {};
    const status = item.status;

    // Logic màu sắc badge
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
            {/* Ảnh */}
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                <img
                    src={info.image || DEFAULT_IMG}
                    className={`w-full h-full object-cover ${status !== 'unused' ? 'grayscale' : ''}`}
                    alt=""
                />
            </div>

            {/* Thông tin text */}
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

            {/* Icon mũi tên (Chỉ hiện khi chưa dùng) */}
            {status === 'unused' && (
                <div className="absolute right-3 bottom-3 text-red-700 flex items-center gap-1">
                    <Text size="small" className="font-bold">Mở</Text>
                    <Icon icon="zi-chevron-right" size={12} />
                </div>
            )}
        </div>
    );
};

// --- 2. COMPONENT DANH SÁCH CÓ PHÂN TRANG ---
const RewardList = ({ status, onOpenDetail }) => {
    const [rewards, setRewards] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);      // Loading lần đầu
    const [loadingMore, setLoadingMore] = useState(false); // Loading khi bấm xem thêm

    // Hàm gọi API
    const fetchRewards = async (pageToLoad) => {
        try {
            if (pageToLoad === 1) setLoading(true);
            else setLoadingMore(true);

            // Gọi API (đảm bảo hàm getMyRewards trong service nhận tham số page)
            const res = await rewardApi.getMyRewards(status, pageToLoad);

            // Lấy dữ liệu an toàn theo log bạn cung cấp
            const list = res.data?.data?.allReward || [];
            const pagination = res.data?.data?.pagination || {};

            if (pageToLoad === 1) {
                setRewards(list); // Trang 1: Thay thế list cũ
            } else {
                setRewards(prev => [...prev, ...list]); // Trang > 1: Nối thêm
            }

            setTotalPages(pagination.totalPage || 1);
            setPage(pageToLoad);

        } catch (error) {
            console.log("Lỗi tải quà:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Khi đổi Tab -> Reset về trang 1
    useEffect(() => {
        setRewards([]);
        fetchRewards(1);
    }, [status]);

    // Xử lý nút Xem thêm
    const handleLoadMore = () => {
        if (page < totalPages) {
            fetchRewards(page + 1);
        }
    };

    // Case 1: Đang tải lần đầu
    if (loading) {
        return <Box className="flex justify-center pt-10"><Spinner visible /></Box>;
    }

    // Case 2: Không có dữ liệu
    if (rewards.length === 0 && !loading) {
        return (
            <Box className="flex flex-col items-center justify-center pt-20 opacity-50">
                <FaGift size={40} className="text-gray-300 mb-2" />
                <Text size="small" className="text-gray-400">Chưa có quà nào ở mục này</Text>
            </Box>
        );
    }

    // Case 3: Có dữ liệu -> Render list
    return (
        <Box className="p-4 bg-gray-50 min-h-[calc(100vh-100px)] pb-24">
            {rewards.map((item, index) => (
                // Dùng index kết hợp id làm key để tránh trùng lặp nếu API lỗi
                <RewardItem key={`${item.id}-${index}`} item={item} onClick={onOpenDetail} />
            ))}

            {/* Nút Xem thêm */}
            {page < totalPages && (
                <div className="flex justify-center mt-4 mb-8">
                    {loadingMore ? (
                        <Spinner size="small" />
                    ) : (
                        <button
                            onClick={handleLoadMore}
                            className="bg-white border border-red-200 text-red-700 font-semibold px-4 py-2 rounded-full text-xs shadow-sm active:bg-red-50 transition-colors"
                        >
                            Xem thêm ({page}/{totalPages})
                        </button>
                    )}
                </div>
            )}

            {/* Hết danh sách */}
            {page >= totalPages && rewards.length > 0 && (
                <div className="text-center mt-4 mb-8 text-gray-400 text-[10px] italic">
                    --- Đã hiển thị tất cả ---
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

    // Mở chi tiết
    const handleOpenDetail = (item) => {
        if (item.status === 'unused') {
            setSelectedReward(item);
            setSheetVisible(true);
        }
    };

    // Helper lấy data hiển thị popup
    const detailInfo = selectedReward?.reward || {};

    return (
        <Page className="bg-white">
            {/* Header */}
            <div className="bg-red-800 text-white p-4 pt-20 sticky top-0 z-50 flex items-center gap-2 shadow-md">
                <Icon icon="zi-chevron-left" onClick={() => navigate(-1)} className="cursor-pointer" />
                <Text.Title size="large" className="font-bold">Quà Của Tôi</Text.Title>
            </div>

            {/* Tabs */}
            <Tabs id="reward-tabs" className="mt-0">
                <Tabs.Tab key="tab1" label="Sẵn sàng">
                    <RewardList status="unused" onOpenDetail={handleOpenDetail} />
                </Tabs.Tab>
                <Tabs.Tab key="tab2" label="Đã dùng">
                    <RewardList status="used" onOpenDetail={() => { }} />
                </Tabs.Tab>
                <Tabs.Tab key="tab3" label="Hết hạn">
                    <RewardList status="expired" onOpenDetail={() => { }} />
                </Tabs.Tab>
            </Tabs>

            {/* Popup chi tiết (Sheet) */}
            <Sheet
                visible={sheetVisible}
                onClose={() => setSheetVisible(false)}
                autoHeight
                mask
                handler
                swipeToClose
            >
                <Box className="p-6 flex flex-col items-center pb-10">
                    <Text.Title size="large" className="font-bold text-center mb-1 text-red-800 line-clamp-2">
                        {detailInfo.name}
                    </Text.Title>
                    <Text size="small" className="text-gray-500 mb-6">Đưa mã này cho nhân viên để sử dụng</Text>

                    {/* Khung mã QR */}
                    <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl mb-4 bg-white shadow-sm flex flex-col items-center w-full max-w-[250px]">
                        <QRCodeCanvas
                            value={detailInfo.code || "ERROR"}
                            size={200}
                            level="H"
                            className="w-full h-auto"
                        />
                        {/* Mã text to rõ */}
                        <div className="mt-4 w-full text-center font-mono font-bold text-xl tracking-widest text-red-700 bg-gray-50 py-2 rounded border border-gray-200">
                            {detailInfo.code}
                        </div>
                    </div>

                    <div className="flex gap-2 items-center text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full text-xs font-bold mt-2">
                        <FaClock /> Hết hạn: {detailInfo.expiredAt ? new Date(detailInfo.expiredAt).toLocaleDateString('vi-VN') : "..."}
                    </div>

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