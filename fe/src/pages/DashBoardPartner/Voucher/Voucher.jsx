import React, { useEffect, useState } from 'react'
import { Select } from 'antd';
import { SquarePen, PackagePlus } from 'lucide-react';
import { getUserVouchersByStatus } from '../../../common/api/partner/voucherService';

function Voucher() {
    const [userUsedVoucher, setUserUsedVoucher] = useState([]);
    const [pagination, setPagination] = useState();
    const [page, setPage] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState("");
    const fetchUserVouchersByStatus = async () => {
        try {
            const res = await getUserVouchersByStatus(
                selectedStatus || "",
                page
            );
            setUserUsedVoucher(res.data.data.userVouchers);
            setPagination(res.data.data.pagination)
            console.log("Lấy danh sách voucher mà người dùng sử dụng: ", res);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchUserVouchersByStatus();
    }, [selectedStatus, page]);
    return (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">

            {/* FILTER ZONE */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng đã sử dụng voucher của cửa hàng</h2>
                <div className="flex flex-col md:flex-row gap-4 items-center">

                    <Select
                        placeholder="Trạng thái"
                        allowClear
                        value={selectedStatus || undefined}
                        onChange={(v) => {
                            setSelectedStatus(v || "");
                            setPage(1);
                        }}
                        className="w-48"
                        options={[
                            { value: "used", label: "Đã sử dụng" },
                            { value: "unused", label: "Chưa sử dụng" },
                        ]}
                    />
                </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            {["Tên người dùng", "Email", "Số điện thoại", "Voucher", "Mã code", "Voucher cửa hàng", "Trạng thái", "Hành động"].map(
                                (header) => (
                                    <th key={header} className="px-5 py-3 text-left font-semibold text-gray-700">
                                        {header}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {userUsedVoucher.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-500 text-lg">
                                    Không tìm thấy người dùng nào.
                                </td>
                            </tr>
                        ) : (
                            userUsedVoucher.map((u) => (
                                <tr key={u.id} clarsName="border-b border-gray-200 hover:bg-gray-50 transition">
                                    <td className="px-5 py-3 font-medium">{u.user.name}</td>
                                    <td className="px-5 py-3 font-medium">{u.user.email}</td>
                                    <td className="px-5 py-3 text-gray-700">{u.user.phone === null ? "Chưa cập nhật SĐT" : u.user.phone}</td>
                                    <td className="px-5 py-3 font-semibold text-blue-600">{u.reward.name}</td>
                                    <td className="px-5 py-3">{u.reward.code}</td>
                                    <td className="px-5 py-3">
                                        {u.reward.store.name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {u.status === "unused" ? (
                                            <span className="inline-block px-3 py-1 text-white text-sm font-medium bg-green-500 rounded-full shadow-sm">
                                                Chưa sử dụng
                                            </span>
                                        ) : (
                                            <span className="inline-block px-3 py-1 text-white text-sm font-medium bg-red-500 rounded-full shadow-sm">
                                                Đã sử dụng
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
                                            <SquarePen className="w-4 h-4" />
                                            <span className="hidden sm:inline">Chỉnh sửa</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {pagination && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`px-4 py-2 rounded-lg border font-medium transition ${page === 1 ? "bg-gray-100 opacity-40 cursor-not-allowed" : "bg-white hover:bg-gray-100"
                            }`}
                    >
                        ← Trước
                    </button>

                    {[...Array(pagination.totalPage)].map((_, i) => {
                        const num = i + 1;
                        const active = page === num;

                        return (
                            <button
                                key={num}
                                onClick={() => setPage(num)}
                                className={`w-10 h-10 rounded-lg border text-sm font-medium transition ${active
                                    ? "bg-[#7f5af0] text-white border-[#7f5af0] shadow"
                                    : "bg-white border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {num}
                            </button>
                        );
                    })}

                    <button
                        disabled={page === pagination.totalPage}
                        onClick={() => setPage(page + 1)}
                        className={`px-4 py-2 rounded-lg border font-medium transition ${page === pagination.totalPage
                            ? "bg-gray-100 opacity-40 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100"
                            }`}
                    >
                        Sau →
                    </button>
                </div>
            )}
        </div>
    )
}

export default Voucher