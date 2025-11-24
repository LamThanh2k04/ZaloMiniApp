import React, { useEffect, useState } from 'react'
import { getAllPartnerService, updatePartnerActive } from '../../../common/api/admin/partnerService';
import { useDebounce } from 'use-debounce';
import { Switch } from "antd";
import toast from 'react-hot-toast';


function PartnerManager() {
    const [pagination, setPagination] = useState();
    const [partner, setPartner] = useState([]);
    const [partnerName, setPartnerName] = useState("");
    const [page, setPage] = useState(1);
    const [debouncePartner] = useDebounce(partnerName, 500);
    const fetchAllPartner = async () => {
        try {
            const res = await getAllPartnerService(debouncePartner, page);
            setPartner(res.data.data.partners);
            setPagination(res.data.data.pagination);
            console.log("Lấy danh sách đối tác: ", res);
        } catch (error) {
            console.log(error);
        }
    }
    const handleToggleActive = async (partnerId, val) => {
        try {
            const res = await updatePartnerActive(partnerId, { isActive: val });
            console.log("Cập nhật trạng thái đối tác: ", res)
            toast.success("Cập nhật trạng thái đối tác thành công");
            setPartner(prev => prev.map(p => p.id === partnerId ? { ...p, isActive: val } : p))
        } catch (error) {
            console.log(error);
            toast.error("Cập nhật trạng thái đối tác thất bại");
        }
    }
    const handleSearchChange = (e) => {
        setPartnerName(e.target.value);
        setPage(1);
    }
    useEffect(() => {
        fetchAllPartner();
    }, [debouncePartner, page]);
    return (
        <div className="p-4 bg-gray-50 min-h-[40vh] rounded-md shadow-sm">
            <div className='flex items-center justify-between mb-5'>
                <h2 className="text-2xl font-semibold">Quản lý đối tác</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Tìm kiếm đối tác..."
                        value={partnerName}
                        onChange={handleSearchChange}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#7f5af0] transition"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Họ tên</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Số điện thoại</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Trạng thái</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Mã người dùng</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Duyệt trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partner.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500">
                                    Không có đối tác nào được tìm thấy.
                                </td>
                            </tr>
                        ) : (
                            partner.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 border-b border-gray-200">
                                    <td className="px-4 py-2">{p.name}</td>
                                    <td className="px-4 py-2">{p.phone}</td>
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
                                    <td className="px-4 py-2">{p.userId}</td>
                                    <td className="px-4 py-2 text-left">
                                        <Switch
                                            checked={p.isActive}
                                            onChange={(val) => handleToggleActive(p.id, val)}
                                        />
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

export default PartnerManager