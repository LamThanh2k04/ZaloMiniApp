import React from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

function PointRevenue({ data }) {
    // Hàm format ngày cho trục X (VD: 23/11)
    const formatXAxis = (tickItem) => {
        if (!tickItem) return '';
        const date = new Date(tickItem);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    // Hàm format ngày cho Tooltip (VD: 23/11/2025)
    const formatTooltipLabel = (label) => {
        if (!label) return '';
        return new Date(label).toLocaleDateString('vi-VN');
    };

    // Nếu không có dữ liệu thì hiện thông báo
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-center" style={{ height: 300 }}>
                <p className="text-gray-400">Chưa có dữ liệu thống kê</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm" style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    {/* Trục X: Format ngày tháng cho gọn */}
                    <XAxis
                        dataKey="date"
                        tickFormatter={formatXAxis}
                        tick={{ fontSize: 12, fill: '#666' }}
                    />

                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />

                    {/* Tooltip: Hiển thị chi tiết khi hover chuột */}
                    <Tooltip
                        labelFormatter={formatTooltipLabel}
                        formatter={(value) => [`${value} điểm`, 'Tổng điểm']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />

                    <Line
                        type="monotone"
                        dataKey="totalPoints"
                        name="Tổng điểm"
                        stroke="#7f5af0"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#7f5af0', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default PointRevenue;