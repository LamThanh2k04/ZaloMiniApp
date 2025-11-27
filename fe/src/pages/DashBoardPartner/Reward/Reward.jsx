import React, { useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'use-debounce';
import { Select, Modal } from 'antd';
import { SquarePen, PackagePlus } from 'lucide-react';
import FormCreateRewardPartner from './FormCreateReward';
import { getRewardStore, getAllStoresPartnerName } from '../../../common/api/partner/rewardService';
import FormUpdateReward from './FormUpdateReward';

function RewardPartner() {
    const [reward, setReward] = useState([]);
    const [store, setStore] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState();
    const [modalCreate, setModalCreate] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);
    const [reWardName, setRewardName] = useState("");
    const [stores, setStores] = useState([]);
    const [storeId, setStoreId] = useState(0);
    const [debounceRewardName] = useDebounce(reWardName, 500);
    const fetchRewardStore = async () => {
        try {
            const res = await getRewardStore(storeId, debounceRewardName, page);
            setReward(res.data.data.rewards);
            setPagination(res.data.data.pagination);
            console.log("Lấy danh sách phần thưởng cửa hàng: ", res);
        } catch (error) {
            console.log(error);
        }
    };
    const fetchAllStoresPartnerName = async () => {
        try {
            const res = await getAllStoresPartnerName();
            setStore(res.data.data.stores);
            console.log("Lấy danh sách cửa hàng: ", res);
        } catch (error) {
            console.log(error);
        }
    }
    const handleSearchChange = (e) => {
        setRewardName(e.target.value);
        setPage(1);
    };
    const openCreateModal = () => setModalCreate(true);
    const closeCreateModal = () => setModalCreate(false);
    const openUpdateModal = (reward) => {
        setSelectedReward(reward);
        setModalUpdate(true);
    };
    const closeUpdateModal = () => {
        setSelectedReward(null);
        setModalUpdate(false);
    };
    useEffect(() => {
        if (reward.length > 0) {
            const uniqueStores = reward
                .map(r => r.store)
                .filter((store, index, self) => self.findIndex(s => s.id === store.id) === index);
            setStores(uniqueStores);
        }
    }, [reward]);
    useEffect(() => {
        fetchRewardStore();
    }, [storeId, debounceRewardName, page]);
    useEffect(() => {
        fetchAllStoresPartnerName();
    }, []);
    return (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">

            {/* FILTER ZONE */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý phần thưởng cửa hàng</h2>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <button
                        className="px-4 py-2 bg-[#7f5af0] cursor-pointer text-white rounded-xl hover:bg-[#6e4ee3] transition"
                        onClick={openCreateModal}
                    >
                        <PackagePlus />
                    </button>
                    <Select
                        placeholder="Chọn cửa hàng"
                        allowClear
                        value={storeId || undefined}
                        onChange={(value) => {
                            setStoreId(value || 0); // 0 hoặc null nếu clear
                            setPage(1);
                        }}
                        className="w-full md:w-72"
                    >
                        {stores.map((s) => (
                            <Select.Option key={s.id} value={s.id}>
                                {s.name}
                            </Select.Option>
                        ))}
                    </Select>
                    {/* SEARCH */}
                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Tìm kiếm cửa hàng..."
                            value={reWardName}
                            onChange={handleSearchChange}
                            className="border border-gray-300 rounded-lg w-full py-2.5 pl-4 pr-10 
                                focus:outline-none focus:ring-2 focus:ring-[#7f5af0] 
                                bg-gray-50 hover:bg-gray-100 transition"
                        />
                        <svg
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="M21 21l-4.3-4.3"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            {["Phần thưởng", "Mô tả", "Điểm tương ứng", "Cửa hàng sỡ hữu", "Số lượng", "Mã code", "Trạng thái", "Hành động"].map(
                                (header) => (
                                    <th key={header} className="px-5 py-3 text-left font-semibold text-gray-700">
                                        {header}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {reward.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-500 text-lg">
                                    Không tìm thấy cửa hàng nào.
                                </td>
                            </tr>
                        ) : (
                            reward.map((r) => (
                                <tr key={r.id} clarsName="border-b border-gray-200 hover:bg-gray-50 transition">
                                    <td className="px-5 py-3 font-medium">{r.name}</td>
                                    <td className="px-5 py-3 font-medium">{r.description}</td>
                                    <td className="px-5 py-3 text-gray-700">{r.pointsNeeded}</td>
                                    <td className="px-5 py-3 font-semibold text-blue-600">{r.store.name}</td>
                                    <td className="px-5 py-3">{r.quantity}</td>
                                    <td className="px-5 py-3">
                                        {r.code}
                                    </td>
                                    <td className="px-4 py-2">
                                        {r.isActive ? (
                                            <span className="inline-block px-3 py-1 text-white text-sm font-medium bg-green-500 rounded-full shadow-sm">
                                                Còn hiệu lực
                                            </span>
                                        ) : (
                                            <span className="inline-block px-3 py-1 text-white text-sm font-medium bg-red-500 rounded-full shadow-sm">
                                                Hết hiệu lực
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        <button
                                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                                            onClick={() => openUpdateModal(r)}
                                        >
                                            <SquarePen className="w-4 h-4" />
                                            <span className="hidden sm:inline">Chỉnh sửa</span>
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
                    <FormCreateRewardPartner
                        onSuccess={() => {
                            fetchRewardStore();
                            closeCreateModal();
                        }}
                        store={store}
                    />
                </Modal>
                <Modal
                    open={modalUpdate}
                    onCancel={closeUpdateModal}
                    footer={null}
                >
                    {selectedReward && (
                        <FormUpdateReward
                            rewardData={selectedReward}
                            onSuccess={fetchRewardStore}
                            onCancel={closeUpdateModal}
                            store={store}

                        />
                    )}
                </Modal>
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
    );
}
export default RewardPartner