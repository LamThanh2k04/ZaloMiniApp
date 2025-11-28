import React, { useEffect, useState } from 'react';
import { Select, DatePicker, Spin, Row, Col } from 'antd';
import DashboardStats from './DashboardStats';
import PointLineChart from './PointLineChart';
import TopUserBarChart from './TopUserBarChart';
import MemberLevelPieChart from './MemberLevelPieChart';
import {
    getAllStore,
    getMemberLevelDistribution,
    getPointLineChart,
    getTopUsersByPoints,
    getTotal
} from '../../../common/api/admin/overviewService';

export default function OverView() {
    const [totals, setTotals] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [memberLevels, setMemberLevels] = useState([]);
    const [lineChart, setLineChart] = useState([]);
    const [stores, setStores] = useState([]);
    const [storeId, setStoreId] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const startDate = dateRange[0]?.format("YYYY-MM-DD") || null;
            const endDate = dateRange[1]?.format("YYYY-MM-DD") || null;
            const range = startDate && endDate ? null : "month";

            const [totalsRes, topUsersRes, memberLevelsRes, lineChartRes, storesRes] =
                await Promise.all([
                    getTotal(),
                    getTopUsersByPoints(),
                    getMemberLevelDistribution(),
                    getPointLineChart(startDate, endDate, storeId, range),
                    getAllStore()
                ]);

            const t = totalsRes.data.data;
            setTotals([
                { label: "Tổng điểm đã phát", value: t.totalPointsIssued?._sum?.points || 0, color: "bg-purple-500" },
                { label: "Tổng cửa hàng", value: t.totalStores || 0, color: "bg-blue-500" },
                { label: "Tổng giao dịch", value: t.totalTransactions || 0, color: "bg-green-500" },
                { label: "Tổng user", value: t.totalUsers || 0, color: "bg-yellow-500" },
            ]);

            setTopUsers(topUsersRes.data.data.users || []);

            const memberLevelsRaw = memberLevelsRes.data.data || [];
            setMemberLevels(memberLevelsRaw.map(item => ({
                levelName: item.levelName,
                userCount: item.userCount
            })));

            setStores(storesRes.data.data.stores || []);

            setLineChart(lineChartRes.data.data.data.map(item => ({
                date: item.date.slice(0, 10),
                totalPoints: item.points
            })));

        } catch (err) {
            console.log("Fetch dashboard error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, [storeId, dateRange]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6 max-w-[1200px] mx-auto space-y-6">
            <DashboardStats totals={totals} />

            <div className="bg-white p-3 rounded-lg shadow-sm space-y-4">
                <div className="flex flex-wrap gap-4 items-center mb-4">
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
                            <PointLineChart data={lineChart} />
                        </Col>
                    </Row>
                </Spin>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Spin spinning={loading}>
                    <TopUserBarChart data={topUsers} />
                </Spin>
                <Spin spinning={loading}>
                    <MemberLevelPieChart data={memberLevels} />
                </Spin>
            </div>
        </div>
    );
}
