import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

function TopUserBarChart({ data }) {
    if (!data || data.length === 0)
        return (
            <div className="bg-white p-3 rounded-lg shadow-sm">
                <h3 className="text-md font-medium mb-3">Top Users</h3>
                <p>Không có dữ liệu</p>
            </div>
        );

    const chartData = data.map(item => ({
        fullName: item.name,
        points: item.totalPoints
    }));

    return (
        <div className="bg-white p-3 rounded-lg shadow-sm">
            <h3 className="text-md font-medium mb-3">Top người dùng có số điểm cao nhất</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                    <XAxis dataKey="fullName" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="points" fill="#7f5af0" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TopUserBarChart;
