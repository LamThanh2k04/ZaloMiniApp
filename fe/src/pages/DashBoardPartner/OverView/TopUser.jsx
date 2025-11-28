import React from 'react';
import { Avatar, Empty } from 'antd';
import { UserOutlined, TrophyFilled } from '@ant-design/icons';

function TopUser({ data }) {

    // Hàm lấy màu sắc cho 3 vị trí đầu tiên
    const getRankColor = (index) => {
        switch (index) {
            case 0: return 'bg-yellow-400 text-white'; // Top 1 (Vàng)
            case 1: return 'bg-gray-300 text-gray-700'; // Top 2 (Bạc)
            case 2: return 'bg-orange-400 text-white'; // Top 3 (Đồng)
            default: return 'bg-gray-100 text-gray-500'; // Các vị trí còn lại
        }
    };

    // Hàm lấy icon cúp cho Top 3 (Option thêm cho đẹp)
    const renderRankIcon = (index) => {
        if (index > 2) return <span className="font-bold">{index + 1}</span>;
        return <TrophyFilled />;
    };

    // Kiểm tra nếu không có data
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[200px]">
                <Empty description="Chưa có khách hàng tích điểm" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[200px] gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {data.map((item, index) => (
                <div
                    key={item.userId} // Dùng userId làm key
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:shadow-md transition-shadow bg-white"
                >
                    <div className="flex items-center gap-3">
                        {/* 1. Badge Thứ hạng */}
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full shadow-sm ${getRankColor(index)}`}>
                            {renderRankIcon(index)}
                        </div>

                        {/* 2. Avatar & Tên */}
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={item.user?.avatar}
                                icon={<UserOutlined />}
                                size={40}
                                className="border border-gray-200"
                            />
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-700">
                                    {item.user?.name || "Người dùng ẩn danh"}
                                </span>
                                {/* Nếu muốn hiện thêm SĐT thì uncomment dòng dưới */}
                                {/* <span className="text-xs text-gray-400">{item.user?.phone}</span> */}
                            </div>
                        </div>
                    </div>

                    {/* 3. Điểm số */}
                    <div className="text-right">
                        <span className="block font-bold text-indigo-600 text-lg">
                            {new Intl.NumberFormat('vi-VN').format(item.totalPoints)}
                        </span>
                        <span className="text-xs text-gray-400">điểm</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TopUser;