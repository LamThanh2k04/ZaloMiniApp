import React, { useEffect, useState } from 'react'
import { approveStoreRequest, getAllStoreRequest, rejectStoreRequest } from '../../../common/api/admin/storeService'
import { Modal } from 'antd';
import toast from 'react-hot-toast';

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
    const handleApprove = (requestId) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn chấp nhận yêu cầu này?",
            okText: "Chấp nhận",
            cancelText: "Huỷ",
            onOk: async () => {
                try {
                    const res = await approveStoreRequest(requestId);
                    console.log("Chấp nhận yêu cầu từ cửa hàng: ", res);
                    toast.success("Đã chấp nhận yêu cầu từ cửa hàng")
                    setStoreRequest(prev => prev.map(p => p.id === requestId ? { ...p, status: "approved" } : p));
                } catch (error) {
                    console.log(error);
                    toast.error("Chưa chấp nhận yêu cầu từ cửa hàng");
                }
            }
        })
    }
    const handleReject = (requestId) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn từ chối yêu cầu này?",
            okText: "Từ chối",
            cancelText: "Huỷ",
            onOk: async () => {
                try {
                    const res = await rejectStoreRequest(requestId);
                    console.log("Đã từ chối yêu cầu từ cửa hàng: ", res);
                    toast.success("Đã từ chối yêu cầu từ cửa hàng");
                    setStoreRequest(prev => prev.map(p => p.id === requestId ? { ...p, status: "rejected" } : p));
                } catch (error) {
                    console.log(error);
                    toast.error("Chưa từ chối yêu cầu từ cửa hàng");
                }
            }
        })
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
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Hành động</th>
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
                                    <td className="px-4 py-2">
                                        {sr.status === "pending" ? (
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleApprove(sr.id)}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-lg 
                           bg-green-500 text-white font-medium shadow 
                           hover:bg-green-600 transition-all duration-200"
                                                >
                                                    ✓ Chấp nhận
                                                </button>

                                                <button
                                                    onClick={() => handleReject(sr.id)}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-lg 
                           bg-red-500 text-white font-medium shadow 
                           hover:bg-red-600 transition-all duration-200"
                                                >
                                                    ✕ Từ chối
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold 
                        bg-green-100 text-green-700 shadow">
                                                Yêu cầu đã được duyệt
                                            </div>
                                        )}
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

                    {/* Nút Trước */}
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`px-4 py-2 rounded-xl border transition font-medium 
                ${page === 1
                                ? "opacity-40 cursor-not-allowed bg-gray-100"
                                : "hover:bg-gray-100 cursor-pointer bg-white"
                            }`}
                    >
                        ← Trước
                    </button>

                    {/* Các nút số trang */}
                    {[...Array(pagination.totalPage)].map((_, i) => {
                        const pageNumber = i + 1;
                        const isActive = page === pageNumber;

                        return (
                            <button
                                key={pageNumber}
                                onClick={() => setPage(pageNumber)}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl border transition font-medium
                        ${isActive
                                        ? "bg-[#7f5af0] text-white border-[#7f5af0] shadow"
                                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    {/* Nút Sau */}
                    <button
                        disabled={page === pagination.totalPage}
                        onClick={() => setPage(page + 1)}
                        className={`px-4 py-2 rounded-xl border transition font-medium 
                ${page === pagination.totalPage
                                ? "opacity-40 cursor-not-allowed bg-gray-100"
                                : "hover:bg-gray-100 cursor-pointer bg-white"
                            }`}
                    >
                        Sau →
                    </button>
                </div>
            )}

        </div>
    )
}

export default StoreRequest