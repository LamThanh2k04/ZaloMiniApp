import React, { useEffect, useState } from 'react'
import { getAllUserService, updateUserZaloActive } from '../../../common/api/admin/userService';
import { useDebounce } from "use-debounce";
import { Switch } from "antd";
import toast from "react-hot-toast";

function UserManager() {
    const [pagination, setPagination] = useState();
    const [page, setPage] = useState(1);
    const [userName, setUserName] = useState("");
    const [user, setUser] = useState([]);
    const [debounceUserName] = useDebounce(userName, 500);
    const fetchAllUser = async () => {
        try {
            const res = await getAllUserService(debounceUserName, page);
            console.log("Lấy danh sách người dùng: ", res);
            setUser(res.data.data.users);
            setPagination(res.data.data.pagination);
        } catch (error) {
            console.log(error);
        }
    }
    const handleToggleActive = async (userId, val) => {
        try {
            const res = await updateUserZaloActive(userId, { isActive: val })
            console.log("Cập nhật trạng thái người dùng: ", res);
            toast.success("Cập nhật trạng thái thành công");
            setUser(prev => prev.map(u => u.id === userId ? { ...u, isActive: val } : u))
        } catch (error) {
            console.log(error);
            toast.error("Cập nhật trạng thái thất bại");
        }
    }
    const handleSearchChange = (e) => {
        setUserName(e.target.value);
        setPage(1);
    }
    useEffect(() => {
        fetchAllUser();
    }, [page, debounceUserName])
    return (
        <div className="p-4 bg-gray-50 min-h-[40vh] rounded-md shadow-sm">
            <div className='flex items-center justify-between mb-5'>
                <h2 className="text-2xl font-semibold">Quản lý người dùng</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        value={userName}
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
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Ngày sinh</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Địa chỉ</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Tổng điểm</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Duyệt trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500">
                                    Không có người dùng nào được tìm thấy.
                                </td>
                            </tr>
                        ) : (
                            user.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 border-b border-gray-200">
                                    <td className="px-4 py-2">{u.name}</td>
                                    <td className="px-4 py-2">{u.email}</td>
                                    <td className="px-4 py-2">{u.phone === null ? "Chưa cập nhật SĐT" : u.phone}</td>
                                    <td className="px-4 py-2">{u.birthDate === null ? "Chưa cập nhật ngày sinh" : u.birthDate}</td>
                                    <td className="px-4 py-2">{u.address === null ? "Chưa cập nhật địa chỉ" : u.address}</td>
                                    <td className="px-4 py-2">{u.totalPoints}</td>
                                    <td className="px-4 py-2 text-left">
                                        <Switch
                                            checked={u.isActive}
                                            onChange={(val) => handleToggleActive(u.id, val)}
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

export default UserManager