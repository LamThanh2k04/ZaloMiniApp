import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

function MemberLevelPieChart({ data }) {
    const colors = ["#7f5af0", "#34d399", "#facc15", "#f87171", "#f97316", "#10b981"];

    return (
        <div className="bg-white p-3 rounded-lg shadow-sm">
            <h3 className="text-md font-medium mb-3">Cấp độ người dùng</h3>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="userCount"
                        nameKey="levelName"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default MemberLevelPieChart;
