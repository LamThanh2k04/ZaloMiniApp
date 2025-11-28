import React, { useEffect, useState } from 'react'
import { getPointRevenueTimeline, getTopUserPointStore, getTotal } from '../../../common/api/partner/overviewService';
import { Select, DatePicker, Spin, Row, Col } from 'antd';
import { getAllStoresPartnerName } from '../../../common/api/partner/rewardService';
import DashboardStarts from './DashboardStarts';
import PointRevenue from './PointRevenue';
import TopUser from './TopUser';

function OverView() {
    const [loading, setLoading] = useState(false);
    const [totals, setTotals] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [lineChart, setLineChart] = useState([]);
    const [stores, setStores] = useState([]);
    const [storeId, setStoreId] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const fetchStaticData = async () => {
        setLoading(true);
        try {
            const [totalsData, storesData] = await Promise.all([
                getTotal(),
                getAllStoresPartnerName(),
            ])
            console.log("total: ", totalsData);
            console.log("stores: ", storesData);
            const t = totalsData.data.data;
            setTotals([
                { label: "Tổng phần thưởng", value: t.totalRewards || 0, color: "bg-blue-500" },
                { label: "Tổng cửa hàng", value: t.totalStores || 0, color: "bg-purple-500" },
                { label: "Tổng voucher chưa được sử dụng", value: t.totalUnusedVouchers || 0, color: "bg-green-500" },
                { label: "Tổng voucher đã được sử dụng", value: t.totalUsedVouchers || 0, color: "bg-gray-500" },
            ])
            const r = storesData.data.data.stores;
            setStores(r || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    const fetchDynamicData = async () => {
        try {
            const startDate = dateRange[0]?.format("YYYY-MM-DD") || null;
            const endDate = dateRange[1]?.format("YYYY-MM-DD") || null;
            const range = startDate && endDate ? null : "month";
            console.log("Fetching with params:", { startDate, endDate, storeId });
            const [lineChartData, topUserData] = await Promise.all([
                getPointRevenueTimeline(startDate, endDate, storeId, range),
                getTopUserPointStore(storeId),
            ]);
            setLineChart(lineChartData.data.data.data);
            setTopUsers(topUserData.data.data);
            console.log("lineChart: ", lineChartData);
            console.log("topUser: ", topUserData);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchStaticData();
    }, []);
    useEffect(() => {
        fetchDynamicData();
    }, [storeId, dateRange]);
    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* 1. Phần Thống kê tổng quan */}
            <DashboardStarts totals={totals} />

            {/* 2. Phần Bộ lọc & Biểu đồ */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex flex-wrap gap-4 mb-6 items-center">
                    {/* Chọn Cửa hàng */}
                    <Select
                        style={{ width: 250 }}
                        placeholder="Chọn cửa hàng"
                        value={storeId}
                        onChange={setStoreId}
                        allowClear
                    >
                        {stores.map(store => (
                            <Select.Option key={store.id} value={store.id}>
                                {store.name}
                            </Select.Option>
                        ))}
                    </Select>

                    {/* Chọn Ngày tháng */}
                    <DatePicker.RangePicker
                        format="YYYY-MM-DD"
                        value={dateRange}
                        onChange={setDateRange}
                        allowClear
                    />
                </div>

                <Spin spinning={loading}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <h3 className="text-lg font-bold mb-4">Biểu đồ biến động điểm</h3>
                            {/* Truyền data vào Component biểu đồ đường */}
                            <PointRevenue data={lineChart} />
                        </Col>
                    </Row>
                </Spin>
            </div>

            {/* 3. Phần Top User */}
            <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
                <h3 className="text-lg font-bold mb-4">Top khách hàng tích điểm</h3>
                <Spin spinning={loading}>
                    {/* Truyền data vào Component biểu đồ cột */}
                    <TopUser data={topUsers} />
                </Spin>
            </div>
        </div>
    );
}

export default OverView;