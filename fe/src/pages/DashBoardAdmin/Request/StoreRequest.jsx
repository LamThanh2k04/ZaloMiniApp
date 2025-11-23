import React, { useEffect, useState } from 'react'
import { getAllStoreRequest } from '../../../common/api/admin/storeService'
import { OctagonX, SquarePen } from 'lucide-react';

function StoreRequest() {
    const [storeRequest, setStoreRequest] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(1);
    const STATUS_UI = {
        approved: {
            label: "Chấp nhận",
            class: "inline-block px-3 py-1 text-white text-sm font-medium bg-green-500 rounded-full shadow-sm"
        },
        rejected: {
            label: "Từ chối",
            class: "inline-block px-3 py-1 text-white text-sm font-medium bg-red-500 rounded-full shadow-sm"
        },
        pending: {
            label: "Đang chờ duyệt",
            class: "inline-block px-3 py-1 text-white text-sm font-medium bg-purple-500 rounded-full shadow-sm"
        },
    };

    const fetchAllStoreRequest = async () => {
        try {
            const res = await getAllStoreRequest(page);
            console.log("Lấy danh sách yêu cầu từ cửa hàng: ", res);
            setStoreRequest(res.data.data.allStoreRequest);
            setPagination(res.data.data.pagination);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchAllStoreRequest();
    }, [page]);
    return (
        <div className="p-4 bg-gray-50 min-h-[40vh] rounded-md shadow-sm">
            <h2 className="text-2xl mb-5 font-semibold">Quản lý danh sách yêu cầu từ cửa hàng</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Logo</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Tên cửa hàng</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Địa chỉ</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Điểm của cửa hàng</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Trạng thái</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Hoạt động</th>
                            <th className="text-center px-4 py-2 font-medium text-gray-700">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {storeRequest.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500">
                                    Không có yêu cầu cửa hàng nào được tìm thấy.
                                </td>
                            </tr>
                        ) : (
                            storeRequest.map((sr) => (
                                <tr key={sr.id} className="hover:bg-gray-50 border-b border-gray-200">
                                    <td className="px-4 py-2">
                                        <img src={sr.logo} alt={sr.name} className='w-20 h-15 object-cover rounded' />
                                    </td>
                                    <td className="px-4 py-2">{sr.name}</td>
                                    <td className="px-4 py-2">{sr.address}</td>
                                    <td className="px-4 py-2">{sr.pointRate}</td>
                                    <td className="px-4 py-2">
                                        {sr.isActive ? (
                                            <span className="inline-block px-3 py-1 text-white text-sm font-medium bg-green-500 rounded-full shadow-sm">
                                                Còn hoạt động
                                            </span>
                                        ) : (
                                            <span className="inline-block px-3 py-1 text-white text-sm font-medium bg-red-500 rounded-full shadow-sm">
                                                Không còn hoạt động
                                            </span>
                                        )}
                                    </td>
                                    <td className='px-4 py-2'>
                                        <span className={STATUS_UI[sr.status]?.class}>
                                            {STATUS_UI[sr.status]?.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 h-full">
                                        <div className="flex items-center justify-center gap-2 h-full">
                                            <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                                <SquarePen className="text-sm" />
                                            </button>
                                            <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                                                <OctagonX className="text-sm" />
                                            </button>
                                        </div>
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

export default StoreRequest