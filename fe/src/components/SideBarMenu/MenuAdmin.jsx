import React from 'react';
import { UserRound, UsersRound, GitPullRequestArrow, SquareMousePointer, Merge, Trophy, LayoutDashboard } from 'lucide-react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Menu, Modal, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../../common/redux/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const { confirm } = Modal;

function MenuAdmin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.userSlice);
    const location = useLocation(); // hook để lấy path hiện tại

    // Mapping đường dẫn -> key menu
    const pathKeyMap = {
        '/admin/dashboard': 'g1',
        '/admin/dashboard/overview': 'g1',
        '/admin/dashboard/user': '1',
        '/admin/dashboard/partner': '2',
        '/admin/dashboard/partner-request': '3',
        '/admin/dashboard/store-request': '4',
        '/admin/dashboard/pointcode': '5',
        '/admin/dashboard/user-pointcode': '6',
        '/admin/dashboard/member-level': '7',
        '/admin/dashboard/reward': '8',
    };

    const items = [
        {
            key: 'sub1',
            label: 'Tổng quan quản trị viên',
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
            label: 'Quản lý tài khoản',
            icon: <UsersRound />,
            children: [
                {
                    key: 'g2',
                    label: 'Tài khoản',
                    type: 'group',
                    children: [
                        { key: '1', label: 'Người dùng', onClick: () => navigate("user") },
                        { key: '2', label: 'Đối tác', onClick: () => navigate("partner") },
                    ],
                },
            ],
        },
        {
            key: 'sub3',
            label: 'Quản lý yêu cầu',
            icon: <GitPullRequestArrow />,
            children: [
                {
                    key: 'g3',
                    label: 'Yêu cầu',
                    type: 'group',
                    children: [
                        { key: '3', label: 'Yêu cầu từ đối tác', onClick: () => navigate("partner-request") },
                        { key: '4', label: 'Yêu cầu từ cửa hàng', onClick: () => navigate("store-request") },
                    ],
                },
            ],
        },
        {
            key: 'sub4',
            label: 'Quản lý điểm cộng',
            icon: <SquareMousePointer />,
            children: [
                {
                    key: 'g4',
                    label: 'Điểm cộng',
                    type: 'group',
                    children: [
                        { key: '5', label: 'Mã cộng điểm', onClick: () => navigate("pointcode") },
                        { key: '6', label: 'Người dùng đã sử dụng điểm', onClick: () => navigate("user-pointcode") },
                    ],
                },
            ],
        },
        {
            key: 'sub5',
            label: 'Quản lý cấp bậc',
            icon: <Merge />,
            children: [
                {
                    key: 'g5',
                    label: 'Cấp bậc',
                    type: 'group',
                    children: [
                        { key: '7', label: 'Cấp bậc thành viên', onClick: () => navigate("member-level") },
                    ],
                },
            ],
        },
        {
            key: 'sub6',
            label: 'Quản lý phần thưởng',
            icon: <Trophy />,
            children: [
                {
                    key: 'g6',
                    label: 'Phần thưởng',
                    type: 'group',
                    children: [
                        { key: '8', label: 'Mã và điểm phần thưởng', onClick: () => navigate("reward") },
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
                                <span className="font-semibold text-gray-800">{user.username}</span>
                                <span className="text-xs text-gray-500">{user.role}</span>
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

export default MenuAdmin;
