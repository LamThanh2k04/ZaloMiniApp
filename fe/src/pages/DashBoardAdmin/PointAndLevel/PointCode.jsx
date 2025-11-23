import React, { useEffect, useState } from 'react'
import { getAllPointCode } from '../../../common/api/admin/pointcodeService';
import { useDebounce } from 'use-debounce';
import { OctagonX, SquarePen } from 'lucide-react';

function PointCode() {
    const [pointCode, setPointCode] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState();
    const [pointCodeName, setPointCodeName] = useState("");
    const [debouncePointCode] = useDebounce(pointCodeName, 500);
    const fetchAllPointCode = async () => {
        try {
            const res = await getAllPointCode(debouncePointCode, page);
            setPointCode(res.data.data.allPointCode);
            setPagination(res.data.data.pagination);
            console.log("Lấy danh sách điểm cộng: ", res);
        } catch (error) {
            console.log(error);
        }
    }
    const handleSearchChange = (e) => {
        setPointCodeName(e.target.value);
        setPage(1);
    }
    useEffect(() => {
        fetchAllPointCode();
    }, [debouncePointCode, page]);
    return (
        <div className="p-4 bg-gray-50 min-h-[40vh] rounded-md shadow-sm">
            <div className='flex items-center justify-between mb-5'>
                <h2 className="text-2xl font-semibold">Quản lý mã cộng điểm</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Tìm kiếm mã code..."
                        value={pointCodeName}
                        onChange={handleSearchChange}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#7f5af0] transition"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Mã code</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Mô tả</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Sử dụng tối đa</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Số lượng người dùng sử dụng</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Số điểm</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Số lần sử dụng</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Trạng thái</th>
                            <th className="text-center px-4 py-2 font-medium text-gray-700">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pointCode.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500">
                                    Không có mã code nào được tìm thấy.
                                </td>
                            </tr>
                        ) : (
                            pointCode.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 border-b border-gray-200">
                                    <td className="px-4 py-2">{p.code}</td>
                                    <td className="px-4 py-2">{p.description}</td>
                                    <td className="px-4 py-2">{p.maxUses}</td>
                                    <td className="px-4 py-2">{p.perUserLimit}</td>
                                    <td className="px-4 py-2">{p.points}</td>
                                    <td className="px-4 py-2">{p.usedCount}</td>
                                    <td className="px-4 py-2">
                                        {p.isActive ? (
                                            <span className="inline-block px-3 py-1 text-white text-sm font-medium bg-green-500 rounded-full shadow-sm">
                                                Còn hoạt động
                                            </span>
                                        ) : (
                                            <span className="inline-block px-3 py-1 text-white text-sm font-medium bg-red-500 rounded-full shadow-sm">
                                                Không còn hoạt động
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 flex items-center justify-center gap-2">
                                        <button className="items-center cursor-pointer px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                            <SquarePen className="text-sm" />
                                        </button>
                                        <button className="px-3 py-1 bg-red-500 cursor-pointer text-white rounded hover:bg-red-600 transition">
                                            <OctagonX className="text-sm" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination (tùy chọn) */}
            {pagination && (
                <div className="flex justify-center items-center gap-3 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-40"
                    >
                        ← Trước
                    </button>

                    {[...Array(pagination.totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        const isActive = pageNumber === pagination.page;
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => setPage(pageNumber)}
                                className={`w-9 h-9 rounded-lg border transition font-medium ${isActive
                                    ? "bg-[#7f5af0] text-white border-[#7f5af0]"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    <button
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-40"
                    >
                        Sau →
                    </button>
                </div>
            )}
        </div>
    )
}

export default PointCode