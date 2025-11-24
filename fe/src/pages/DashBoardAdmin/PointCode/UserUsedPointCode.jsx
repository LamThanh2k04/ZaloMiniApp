import React, { useEffect, useState } from 'react'
import { getAllUserUsedPointCode } from '../../../common/api/admin/pointcodeService';
import { useDebounce } from 'use-debounce';
import { OctagonX, SquarePen } from 'lucide-react';

function UserUsedPointCode() {
    const [usedPoint, setUsedPoint] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState();
    const [usedPointName, setUsedPointName] = useState("");
    const [debounceUsedPoint] = useDebounce(usedPointName, 500);
    const fetchAllUserUsedPointCode = async () => {
        try {
            const res = await getAllUserUsedPointCode(debounceUsedPoint, page);
            setUsedPoint(res.data.data.allUserUsedPointCode);
            setPagination(res.data.data.pagination);
            console.log("Lấy danh sách người dùng sử dụng mã code: ", res);
        } catch (error) {
            console.log(error);
        }
    }
    const handleSearchChange = (e) => {
        setUsedPointName(e.target.value);
        setPage(1);
    }
    useEffect(() => {
        fetchAllUserUsedPointCode();
    }, [debounceUsedPoint, page]);
    return (
        <div className="p-4 bg-gray-50 min-h-[40vh] rounded-md shadow-sm">
            <div className='flex items-center justify-between mb-5'>
                <h2 className="text-2xl font-semibold">Quản lý người dùng đã sử dụng mã code</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        value={usedPointName}
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
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Email</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Số điện thoại</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Mã code</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Địa chỉ</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Tổng điểm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usedPoint.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500">
                                    Không có người dùng nào được tìm thấy.
                                </td>
                            </tr>
                        ) : (
                            usedPoint.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 border-b border-gray-200">
                                    <td className="px-4 py-2">{u.user.name}</td>
                                    <td className="px-4 py-2">{u.user.email}</td>
                                    <td className="px-4 py-2">{u.user.phone === null ? "Chưa cập nhật SĐT" : u.user.phone}</td>
                                    <td className="px-4 py-2">{u.pointCode.code}</td>
                                    <td className="px-4 py-2">{u.user.address === null ? "Chưa cập nhật địa chỉ" : u.user.address}</td>
                                    <td className="px-4 py-2">{u.user.totalPoints}</td>
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

export default UserUsedPointCode