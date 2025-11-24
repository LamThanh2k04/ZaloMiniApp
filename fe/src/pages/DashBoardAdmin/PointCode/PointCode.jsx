import React, { useEffect, useState } from 'react'
import { getAllPointCode } from '../../../common/api/admin/pointcodeService';
import { useDebounce } from 'use-debounce';
import { OctagonX, SquarePen, BadgePlus } from 'lucide-react';
import FormCreatePointCode from './FormCreatePointCode';
import { Modal } from "antd";
import FormUpdatePointCode from './FormUpdatePointCode';
function PointCode() {
    const [pointCode, setPointCode] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState();
    const [modalCreate, setModalCreate] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [selectedPointCode, setSelectedPointCode] = useState(null);
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
    const openCreateModal = () => setModalCreate(true);
    const closeCreateModal = () => setModalCreate(false);
    const openUpdateModal = (pointCode) => {
        setSelectedPointCode(pointCode);
        setModalUpdate(true)
    };
    const closeUpdateModal = () => {
        setSelectedPointCode(null);
        setModalUpdate(false);
    };
    useEffect(() => {
        fetchAllPointCode();
    }, [debouncePointCode, page]);
    return (
        <div className="p-4 bg-gray-50 min-h-[40vh] rounded-md shadow-sm">
            <div className='flex items-center justify-between mb-5'>
                <h2 className="text-2xl font-semibold">Quản lý mã cộng điểm</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        className="px-4 py-2 bg-[#7f5af0] cursor-pointer text-white rounded-xl hover:bg-[#6e4ee3] transition"
                        onClick={openCreateModal}
                    >
                        <BadgePlus />
                    </button>
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
                                                Còn tác dụng
                                            </span>
                                        ) : (
                                            <span className="inline-block px-3 py-1 text-white text-sm font-medium bg-red-500 rounded-full shadow-sm">
                                                Không còn tác dụng
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 flex items-center justify-center gap-2">
                                        <button
                                            className="items-center cursor-pointer px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                            onClick={() => openUpdateModal(p)}
                                        >
                                            <SquarePen className="text-sm" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <Modal
                    open={modalCreate}
                    onCancel={closeCreateModal}
                    footer={null}
                >
                    <FormCreatePointCode
                        onSuccess={() => {
                            fetchAllPointCode();
                            closeCreateModal();
                        }}
                    />
                </Modal>
                <Modal
                    open={modalUpdate}
                    onCancel={closeUpdateModal}
                    footer={null}
                >
                    {selectedPointCode && (
                        <FormUpdatePointCode
                            pointCodeData={selectedPointCode}
                            onSuccess={fetchAllPointCode}
                            onCancel={closeUpdateModal}
                        />
                    )}
                </Modal>
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

export default PointCode