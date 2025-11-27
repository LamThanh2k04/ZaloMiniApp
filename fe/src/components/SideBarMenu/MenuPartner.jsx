import React from 'react'
import { UserRound, LayoutDashboard, Store, Container, BadgeDollarSign } from 'lucide-react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Menu, Modal, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../../common/redux/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
function MenuPartner() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.userSlice);
    const location = useLocation();
    const { confirm } = Modal;
    const pathKeyMap = {
        '/partner/dashboard': 'g1',
        '/partner/dashboard/overview': 'g1',
        '/partner/dashboard/store': '1',
        '/partner/dashboard/reward-partner': '2',
        '/partner/dashboard/voucher': '3',
    };
    const items = [
        {
            key: 'sub1',
            label: 'Tổng quan đối tác',
            type: 'group',
            children: [
                {
                    key: 'g1',
                    label: 'Tổng quan',
                    icon: <LayoutDashboard />,
                    onClick: () => navigate("overview"),
                }
            ],
        },
        {
            key: 'sub2',
            label: 'Quản lý cửa hàng',
            icon: <Store />,
            children: [
                {
                    key: 'g2',
                    label: 'Cửa hàng đối tác',
                    type: 'group',
                    children: [
                        { key: '1', label: 'Cửa hàng', onClick: () => navigate("store") },
                    ],
                },
            ],
        },
        {
            key: 'sub3',
            label: 'Quản lý phần thưởng',
            icon: <Container />,
            children: [
                {
                    key: 'g3',
                    label: 'Phần thưởng đối tác',
                    type: 'group',
                    children: [
                        { key: '2', label: 'Phần thưởng', onClick: () => navigate("reward-partner") },
                    ],
                },
            ],
        },
        {
            key: 'sub4',
            label: 'Quản lý voucher',
            icon: <BadgeDollarSign />,
            children: [
                {
                    key: 'g4',
                    label: 'Voucher của người dùng',
                    type: 'group',
                    children: [
                        { key: '3', label: 'Voucher', onClick: () => navigate("voucher") },
                    ],
                },
            ],
        },
    ];

    const handleLogout = () => {
        confirm({
            title: 'Bạn có chắc muốn đăng xuất?',
            icon: <ExclamationCircleOutlined />,
            content: 'Hành động này sẽ đăng xuất khỏi hệ thống.',
            okText: 'Đăng xuất',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                dispatch(removeUser());
                toast.success('Đăng xuất thành công!');
                navigate("/");
            },
            onCancel() {
                console.log('Người dùng hủy đăng xuất');
            },
        });
    };

    return (
        <div className="h-screen flex flex-col w-64 bg-white shadow-lg">
            {/* Menu */}
            <div className="flex-1 overflow-y-auto">
                <Menu
                    style={{ width: '100%' }}
                    selectedKeys={[pathKeyMap[location.pathname]]}  // highlight theo path
                    defaultOpenKeys={['sub1']} // nhóm mở mặc định
                    mode="inline"
                    items={items}
                    className="bg-white"
                />
            </div>

            {/* User Info */}
            <div className="p-4 border-t border-gray-300 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <UserRound className="w-7 h-7 text-gray-700" />
                        {user &&
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-800">{user.name}</span>
                                <span className="text-xs text-gray-500">{user.phone}</span>
                            </div>
                        }
                    </div>
                    <Button
                        type="primary"
                        danger
                        size="small"
                        onClick={handleLogout}
                        className='!p-2 !rounded'
                    >
                        Đăng xuất
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default MenuPartner