import React, { useEffect, useState } from "react";
import { Page, Box, Text, Icon, useNavigate, Sheet, Spinner } from "zmp-ui";
import { userApi } from "../api/userService";
import { FaBell, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";

const NotificationsPage = () => {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedNotif, setSelectedNotif] = useState(null);
    const [sheetVisible, setSheetVisible] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Load danh sách
    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const res = await userApi.getNotifications();
                const rawData = res.data?.data;

                let list = [];
                // API trả về mảng trong 'notification'
                if (rawData?.notification && Array.isArray(rawData.notification)) {
                    list = rawData.notification;
                } else if (Array.isArray(rawData)) {
                    list = rawData;
                }
                setNotifications(list);
            } catch (error) {
                console.log("Lỗi tải thông báo:", error);
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifs();
    }, []);

    // --- SỬA LẠI HÀM NÀY THEO LOG BẠN GỬI ---
    const handleItemClick = async (id) => {
        setSheetVisible(true);
        setLoadingDetail(true);
        setSelectedNotif(null);

        try {
            const res = await userApi.getNotificationDetail(id);
            console.log("Chi tiết API:", res); // Check log

            // LOG CỦA BẠN: data -> data -> notification (Object)
            const rootData = res.data?.data || {};

            // Lấy object 'notification', nếu không có thì lấy rootData (phòng hờ)
            const detail = rootData.notification || rootData;

            setSelectedNotif(detail);

        } catch (error) {
            console.log("Lỗi tải chi tiết:", error);
            setSelectedNotif({ title: "Lỗi", message: "Không tải được nội dung." });
        } finally {
            setLoadingDetail(false);
        }
    };

    return (
        <Page className="bg-gray-100">
            <div className="bg-white p-4 pt-10 sticky top-0 z-50 flex items-center gap-3 shadow-sm">
                <Icon icon="zi-chevron-left" onClick={() => navigate(-1)} />
                <Text.Title size="large" className="font-bold text-black">Thông báo</Text.Title>
            </div>

            <Box className="p-4">
                {loading ? (
                    <div className="flex justify-center mt-10"><Spinner /></div>
                ) : (!Array.isArray(notifications) || notifications.length === 0) ? (
                    <div className="flex flex-col items-center mt-20 text-gray-400">
                        <FaBell size={40} className="mb-2 opacity-50" />
                        <Text>Bạn chưa có thông báo nào</Text>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {notifications.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white p-4 rounded-xl shadow-sm flex gap-3 active:opacity-70"
                                onClick={() => handleItemClick(item.id)}
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                    <FaInfoCircle />
                                </div>
                                <div className="flex-1">
                                    <Text.Title size="small" className="font-bold text-black line-clamp-2 mb-1">
                                        {item.title}
                                    </Text.Title>
                                    <Text size="xxSmall" className="text-gray-500 line-clamp-2 mb-2">
                                        {/* Hiển thị message ở danh sách luôn */}
                                        {item.message || "Xem chi tiết"}
                                    </Text>
                                    <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                                        <FaCalendarAlt />
                                        <span>{item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Box>

            {/* POPUP CHI TIẾT */}
            <Sheet
                visible={sheetVisible}
                onClose={() => setSheetVisible(false)}
                autoHeight
                mask
                handler
                swipeToClose
            >
                <Box className="p-6 pb-10 min-h-[300px]">
                    {loadingDetail ? (
                        <div className="flex justify-center items-center h-40">
                            <Spinner />
                        </div>
                    ) : selectedNotif ? (
                        <>
                            <Text.Title size="large" className="font-bold mb-2 text-blue-800">
                                {selectedNotif.title}
                            </Text.Title>
                            <Text size="xSmall" className="text-gray-400 mb-4 italic">
                                {selectedNotif.createdAt ? new Date(selectedNotif.createdAt).toLocaleString('vi-VN') : ""}
                            </Text>

                            {/* Hiển thị nội dung từ trường 'message' */}
                            <div className="text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                                {selectedNotif.message || selectedNotif.content}
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-500 mt-10">Không có dữ liệu</div>
                    )}

                    <button
                        className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl mt-8"
                        onClick={() => setSheetVisible(false)}
                    >
                        Đóng
                    </button>
                </Box>
            </Sheet>
        </Page>
    );
};
export default NotificationsPage;