import React, { useEffect, useState } from "react";
import { Select, Modal } from 'antd';
import { useDebounce } from "use-debounce";
import { SquarePen, HousePlus } from 'lucide-react';
import { getAllStoresPartner } from "../../../common/api/partner/storeService";
import FormCreateStore from "./FormCreateStore";
import FormUpdateStore from "./FormUpdateStore";

function Store() {
    const [stores, setStores] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState();
    const [modalCreate, setModalCreate] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const [storeName, setStoreName] = useState("");
    const [debounceStoreName] = useDebounce(storeName, 500);
    const [selectedStatus, setSelectedStatus] = useState("");

    const STATUS_UI = {
        approved: {
            label: "Chấp nhận",
            class: "inline-block px-3 py-1 text-white text-sm font-medium bg-green-500 rounded-full shadow-sm",
        },
        rejected: {
            label: "Từ chối",
            class: "inline-block px-3 py-1 text-white text-sm font-medium bg-red-500 rounded-full shadow-sm",
        },
        pending: {
            label: "Đang chờ duyệt",
            class: "inline-block px-3 py-1 text-white text-sm font-medium bg-purple-500 rounded-full shadow-sm",
        },
    };
    const fetchAllStoresPartner = async () => {
        try {
            const res = await getAllStoresPartner(
                debounceStoreName,
                selectedStatus || "",
                page
            );
            console.log("Lấy danh sách cửa hàng đối tác: ", res);
            setStores(res.data.data.stores);
            setPagination(res.data.data.pagination);
        } catch (error) {
            console.log(error);
        }
    };
    const openCreateModal = () => setModalCreate(true);
    const closeCreateModal = () => setModalCreate(false);
    const openUpdateModal = (store) => {
        setSelectedStore(store);
        setModalUpdate(true);
    };
    const closeUpdateModal = () => {
        setSelectedStore(null);
        setModalUpdate(false);
    };
    useEffect(() => {
        fetchAllStoresPartner();
    }, [page, debounceStoreName, selectedStatus]);

    return (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">

            {/* FILTER ZONE */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý cửa hàng đối tác</h2>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <button
                        className="px-4 py-2 bg-[#7f5af0] cursor-pointer text-white rounded-xl hover:bg-[#6e4ee3] transition"
                        onClick={openCreateModal}
                    >
                        <HousePlus />
                    </button>
                    <Select
                        placeholder="Trạng thái"
                        allowClear
                        value={selectedStatus || undefined}
                        onChange={(v) => {
                            setSelectedStatus(v || "");
                            setPage(1);
                        }}
                        className="w-48"
                        options={[
                            { value: "pending", label: "Đang chờ duyệt" },
                            { value: "approved", label: "Chấp nhận" },
                            { value: "rejected", label: "Từ chối" },
                        ]}
                    />
                    {/* SEARCH */}
                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Tìm kiếm cửa hàng..."
                            value={storeName}
                            onChange={(e) => {
                                setStoreName(e.target.value);
                                setPage(1);
                            }}
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
                            {["Logo", "Tên cửa hàng", "Địa chỉ", "Điểm", "Chủ sở hữu", "Trạng thái duyệt", "Trạng thái hoạt động", "Hành động"].map(
                                (header) => (
                                    <th key={header} className="px-5 py-3 text-left font-semibold text-gray-700">
                                        {header}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {stores.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-500 text-lg">
                                    Không tìm thấy cửa hàng nào.
                                </td>
                            </tr>
                        ) : (
                            stores.map((s) => (
                                <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                    <td className="px-5 py-3">
                                        <img
                                            src={s.logo}
                                            alt={s.name}
                                            className="w-12 h-12 rounded-md object-cover shadow-sm"
                                        />
                                    </td>
                                    <td className="px-5 py-3 font-medium">{s.name}</td>
                                    <td className="px-5 py-3 text-gray-700">{s.address}</td>
                                    <td className="px-5 py-3 font-semibold text-blue-600">{s.pointRate}</td>
                                    <td className="px-5 py-3">{s.ownerId}</td>
                                    <td className="px-5 py-3">
                                        <span className={STATUS_UI[s.status]?.class}>{STATUS_UI[s.status]?.label}</span>
                                    </td>
                                    <td className="px-4 py-2">
                                        {s.isActive ? (
                                            <span className="inline-block px-3 py-1 text-white text-sm font-medium bg-green-500 rounded-full shadow-sm">
                                                Còn hoạt động
                                            </span>
                                        ) : (
                                            <span className="inline-block px-3 py-1 text-white text-sm font-medium bg-red-500 rounded-full shadow-sm">
                                                Ngưng hoạt động
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        <button
                                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                                            onClick={() => openUpdateModal(s)}
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
                    <FormCreateStore
                        onSuccess={() => {
                            fetchAllStoresPartner();
                            closeCreateModal();
                        }}
                    />
                </Modal>
                <Modal
                    open={modalUpdate}
                    onCancel={closeUpdateModal}
                    footer={null}
                >
                    {selectedStore && (
                        <FormUpdateStore
                            storeData={selectedStore}
                            onSuccess={fetchAllStoresPartner}
                            onCancel={closeUpdateModal}
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

export default Store;
