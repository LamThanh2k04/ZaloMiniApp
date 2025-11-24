import React, { useEffect, useState } from 'react'
import { getAllPartnerRequestService, approvePartnerRequest, rejectPartnerRequest } from '../../../common/api/admin/partnerService';
import { Modal } from 'antd';
import toast from 'react-hot-toast';

function PartnerRequest() {
    const [partnerRequest, setPartnerRequest] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState();
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

    const fetchAllPartnerRequest = async () => {
        try {
            const res = await getAllPartnerRequestService(page);
            setPartnerRequest(res.data.data.allPartnerRequest);
            setPagination(res.data.data.pagination);
            console.log("Lấy danh sách yêu cầu làm đối tác: ", res);
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
                    const res = await approvePartnerRequest(requestId);
                    console.log("Đã chấp nhận yêu cầu: ", res);
                    toast.success("Đã chấp nhận yêu cầu");
                    setPartnerRequest(prev => prev.map(p => p.id === requestId ? { ...p, status: "approved" } : p))
                    console.log()
                } catch (error) {
                    console.log(error);
                    toast.error("Chưa chấp nhận yêu cầu");
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
                    const res = await rejectPartnerRequest(requestId);
                    console.log("Đã từ chối yêu cầu: ", res);
                    toast.success("Đã từ chối yêu cầu");
                    setPartnerRequest(prev => prev.map(p => p.id === requestId ? { ...p, status: "rejected" } : p));
                } catch (error) {
                    console.log(error);
                    toast.error("Chưa từ chối yêu cầu");
                }
            }
        })
    }
    useEffect(() => {
        fetchAllPartnerRequest();
    }, [page])
    return (
        <div className="p-4 bg-gray-50 min-h-[40vh] rounded-md shadow-sm">
            <h2 className="text-2xl mb-5 font-semibold">Quản lý danh sách yêu cầu từ đối tác</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Họ tên</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Email</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Số điện thoại</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Địa chỉ</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Trạng thái</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partnerRequest.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500">
                                    Không có yêu cầu đối tác nào được tìm thấy.
                                </td>
                            </tr>
                        ) : (
                            partnerRequest.map((pr) => (
                                <tr key={pr.id} className="hover:bg-gray-50 border-b border-gray-200">
                                    <td className="px-4 py-2">{pr.fullName}</td>
                                    <td className="px-4 py-2">{pr.email}</td>
                                    <td className="px-4 py-2">{pr.phone}</td>
                                    <td className="px-4 py-2">{pr.address}</td>
                                    <td className='px-4 py-2 text-left'>
                                        <span className={STATUS_UI[pr.status]?.class}>
                                            {STATUS_UI[pr.status]?.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 flex items-center justify-start gap-2">
                                        <button
                                            onClick={() => handleApprove(pr.id)}
                                            className="px-3 py-1 bg-green-500 text-white transition cursor-pointer rounded hover:bg-green-600"
                                        >
                                            Chấp nhận
                                        </button>

                                        <button
                                            onClick={() => handleReject(pr.id)}
                                            className="px-3 py-1 bg-red-500 text-white transition cursor-pointer rounded hover:bg-red-600"
                                        >
                                            Từ chối
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

export default PartnerRequest