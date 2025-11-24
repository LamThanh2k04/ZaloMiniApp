import React, { useEffect, useState } from 'react'
import { getAllMemberLevelService } from '../../../common/api/admin/memberService';
import { useDebounce } from 'use-debounce';
import { SquarePen, SmilePlus } from 'lucide-react';
import { Modal } from 'antd';
import FormCreateMemberLevel from './FormCreateMemberLevel';
import FormUpdateMemberLevel from './FormUpdateMemberLevel';

function MemberLevel() {
    const [member, setMember] = useState([]);
    const [page, setPage] = useState(1);
    const [modalCreate, setModalCreate] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [selectedMemberLevel, setSelectedMemberLevel] = useState(null);
    const [pagination, setPagination] = useState();
    const [memberName, setMemberName] = useState("");
    const [debounceMemberName] = useDebounce(memberName, 500);
    const fetchAllMemberLevel = async () => {
        try {
            const res = await getAllMemberLevelService(debounceMemberName, page);
            console.log("Lấy danh sách cấp bậc: ", res);
            setMember(res.data.data.allMemberLevel);
            setPagination(res.data.data.pagination);
        } catch (error) {
            console.log(error);
        }
    }
    const handleSearchChange = (e) => {
        setMemberName(e.target.value);
        setPage(1);
    }
    const openCreateModal = () => setModalCreate(true);
    const closeCreateModal = () => setModalCreate(false);
    const openUpdateModal = (member) => {
        setSelectedMemberLevel(member);
        setModalUpdate(true);
    }
    const closeUpdateModal = () => {
        setSelectedMemberLevel(null);
        setModalUpdate(false);
    }
    useEffect(() => {
        fetchAllMemberLevel();
    }, [debounceMemberName, page])
    return (
        <div className="p-4 bg-gray-50 min-h-[40vh] rounded-md shadow-sm">
            <div className='flex items-center justify-between mb-5'>
                <h2 className="text-2xl font-semibold">Quản lý cấp bậc thành viên</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        className="px-4 py-2 bg-[#7f5af0] cursor-pointer text-white rounded-xl hover:bg-[#6e4ee3] transition"
                        onClick={openCreateModal}
                    >
                        <SmilePlus />
                    </button>
                    <input
                        type="text"
                        placeholder="Tìm kiếm cấp bậc..."
                        value={memberName}
                        onChange={handleSearchChange}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#7f5af0] transition"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Tên cấp bậc</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Điểm tối thiểu</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Điểm tối đa</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-700">Quyền lợi</th>
                            <th className="text-center px-4 py-2 font-medium text-gray-700">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {member.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500">
                                    Không có người dùng nào được tìm thấy.
                                </td>
                            </tr>
                        ) : (
                            member.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50 border-b border-gray-200">
                                    <td className="px-4 py-2">{m.name}</td>
                                    <td className="px-4 py-2">{m.minPoints}</td>
                                    <td className="px-4 py-2">{m.maxPoints}</td>
                                    <td className="px-4 py-2">{m.benefits}</td>
                                    <td className="px-4 py-2 flex items-center justify-center gap-2">
                                        <button
                                            className="items-center cursor-pointer px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                            onClick={() => openUpdateModal(m)}
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
                    <FormCreateMemberLevel
                        onSuccess={() => {
                            fetchAllMemberLevel();
                            closeCreateModal();
                        }}
                    />
                </Modal>
                <Modal
                    open={modalUpdate}
                    onCancel={closeUpdateModal}
                    footer={null}
                >
                    {selectedMemberLevel && (
                        <FormUpdateMemberLevel
                            memberData={selectedMemberLevel}
                            onSuccess={fetchAllMemberLevel}
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

export default MemberLevel