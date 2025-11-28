import React from 'react'

function DashboardStarts({ totals }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {totals.map((stat, i) => (
                <div
                    key={i}
                    className={`p-3 rounded-lg text-white ${stat.color} shadow`}
                >
                    <div className="text-sm font-medium">{stat.label}</div>
                    <div className="text-xl font-bold mt-1">{stat.value}</div>
                </div>
            ))}
        </div>
    )
}

export default DashboardStarts