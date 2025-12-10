import React, { useEffect, useState } from "react";
import { Page, Box, Text, Icon, useNavigate, Tabs, Spinner } from "zmp-ui";
import { userApi } from "../api/userService";
import { FaHistory, FaArrowUp, FaArrowDown, FaCalendarAlt } from "react-icons/fa";

// Component hiển thị 1 dòng lịch sử
const HistoryItem = ({ item }) => {
    // Dựa vào status hoặc số điểm để xác định màu sắc
    // Nếu API trả về status: 'earned' -> Tích điểm, 'used' -> Tiêu điểm
    const isPositive = item.status === 'earned' || (item.points && item.points > 0);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
                {/* Icon tròn */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isPositive ? <FaArrowUp /> : <FaArrowDown />}
                </div>

                {/* Nội dung */}
                <div>
                    <Text.Title size="small" className="font-bold text-gray-800 line-clamp-1">
                        {item.description || (isPositive ? "Tích điểm thành viên" : "Đổi quà thưởng")}
                    </Text.Title>
                    <div className="flex items-center gap-1 text-gray-400 mt-1">
                        <FaCalendarAlt size={10} />
                        <Text size="xxSmall">
                            {/* Xử lý ngày tháng an toàn */}
                            {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : "N/A"}
                        </Text>
                    </div>
                </div>
            </div>

            {/* Số điểm */}
            <div className={`font-bold text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : '-'}{Math.abs(item.points || 0)}
            </div>
        </div>
    );
};

// Component danh sách
const HistoryList = ({ status }) => {
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchHistory = async (pageToLoad) => {
        try {
            if (pageToLoad === 1) setLoading(true);
            else setLoadingMore(true);

            // Gọi API (Lúc này userService đã xử lý việc bỏ status null)
            const res = await userApi.getTransactionHistory(status, pageToLoad);

            // --- LOG DATA ĐỂ DEBUG (Bạn có thể xóa sau khi chạy được) ---
            console.log("Lịch sử trả về:", res.data);

            // Xử lý lấy data an toàn (Thử nhiều trường hợp tên biến backend có thể trả về)
            const dataRoot = res.data?.data || {};
            const list = dataRoot.transactions || dataRoot.items || dataRoot.history || [];
            const pagination = dataRoot.pagination || {};

            if (pageToLoad === 1) {
                setHistory(list);
            } else {
                setHistory(prev => [...prev, ...list]);
            }

            setTotalPages(pagination.totalPage || 1);
            setPage(pageToLoad);

        } catch (error) {
            console.log("Lỗi tải lịch sử:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Khi đổi tab -> Reset
    useEffect(() => {
        setHistory([]);
        fetchHistory(1);
    }, [status]);

    const handleLoadMore = () => {
        if (page < totalPages) fetchHistory(page + 1);
    };

    if (loading) return <Box className="flex justify-center pt-10"><Spinner visible /></Box>;

    if (history.length === 0 && !loading) {
        return (
            <Box className="flex flex-col items-center justify-center pt-20 opacity-50">
                <FaHistory size={40} className="text-gray-300 mb-2" />
                <Text size="small" className="text-gray-400">Chưa có giao dịch nào</Text>
            </Box>
        );
    }

    return (
        <Box className="p-4 bg-gray-50 min-h-[calc(100vh-100px)]">
            {history.map((item, index) => (
                // Dùng index kết hợp ngày tạo để làm key (tránh trùng lặp)
                <HistoryItem key={`${index}-${item.createdAt}`} item={item} />
            ))}

            {page < totalPages && (
                <div className="flex justify-center mt-4 pb-10">
                    {loadingMore ? <Spinner size="small" /> : (
                        <button
                            onClick={handleLoadMore}
                            className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-full text-xs shadow-sm active:bg-gray-100"
                        >
                            Xem thêm cũ hơn
                        </button>
                    )}
                </div>
            )}
            {/* Hết danh sách */}
            {page >= totalPages && history.length > 0 && (
                <div className="text-center mt-4 mb-8 text-gray-400 text-[10px] italic">
                    --- Hết lịch sử ---
                </div>
            )}
        </Box>
    );
};

const HistoryPage = () => {
    const navigate = useNavigate();

    return (
        <Page className="bg-white">
            {/* Header */}
            <div className="bg-red-800 text-white p-4 pt-20 sticky top-0 z-50 flex items-center gap-2 shadow-md">
                <Icon icon="zi-chevron-left" onClick={() => navigate(-1)} className="cursor-pointer" />
                <Text.Title size="large" className="font-bold">Lịch sử điểm</Text.Title>
            </div>

            {/* Tabs */}
            <Tabs id="history-tabs" className="mt-0">
                {/* QUAN TRỌNG: Tab "Tất cả" truyền status={null} 
                   userService.js sẽ tự động loại bỏ param này khi gọi API
                   -> API hiểu là "Lấy tất cả"
                */}
                <Tabs.Tab key="earned" label="Tích điểm">
                    <HistoryList status="earned" />
                </Tabs.Tab>
                <Tabs.Tab key="used" label="Tiêu điểm">
                    <HistoryList status="used" />
                </Tabs.Tab>
            </Tabs>
        </Page>
    );
};

export default HistoryPage;