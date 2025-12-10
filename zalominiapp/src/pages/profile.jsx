import React, { useEffect, useState, useRef } from "react";
import { Page, Box, Text, Avatar, Icon, Input, Button, DatePicker, Select, List, useNavigate, useSnackbar } from "zmp-ui";
import { useRecoilState } from "recoil";
import { userState } from "../state/user";
import { userApi } from "../api/userService";
// 1. IMPORT THÊM CÁC ICON CHO MENU DƯỚI
import { FaUserEdit, FaChevronRight, FaCamera, FaHome, FaQrcode, FaGift, FaUser, FaChevronLeft } from "react-icons/fa";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const [user, setUser] = useRecoilState(userState);

    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        gender: "other",
        birthDate: new Date(),
        avatar: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                email: user.email || "",
                address: user.address || "",
                gender: user.gender || "other",
                birthDate: user.birthDate ? new Date(user.birthDate) : new Date(),
                avatar: user.avatar || ""
            });
        }
    }, [user]);

    const handleChooseImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const previewUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, avatar: previewUrl }));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const dataToSend = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                gender: formData.gender,
                birthDate: formData.birthDate,
            };

            if (selectedFile) {
                dataToSend.avatar = selectedFile;
            }

            // 1. Hứng kết quả trả về từ API
            const res = await userApi.updateInfo(dataToSend);

            console.log("Kết quả update trả về:", res); // Check log xem cấu trúc

            // 2. Lấy thông tin user mới từ Server trả về
            // Dựa vào code backend bạn gửi trước đó: return { updateUserZalo }
            // Nên cấu trúc có thể là: res.data.data.updateUserZalo
            const updatedUser = res.data?.data?.updateUserZalo || res.data?.data;

            if (updatedUser) {
                // 3. Cập nhật Recoil State bằng dữ liệu thật từ Server
                // (Bao gồm cả đường dẫn avatar mới ví dụ: https://cloudinary.../img.jpg)
                setUser(prev => ({
                    ...prev,
                    ...updatedUser,
                    // Nếu backend trả về avatarPath dạng "/uploads/..." thì có thể cần nối thêm domain
                    // avatar: updatedUser.avatar 
                }));

                // Cập nhật lại form data để hiển thị đúng
                setFormData(prev => ({
                    ...prev,
                    avatar: updatedUser.avatar || prev.avatar
                }));
            }

            openSnackbar({
                text: "Cập nhật thành công!",
                type: "success",
                icon: true,
                duration: 3000
            });
        } catch (error) {
            console.log("Lỗi update:", error);
            const msg = error.response?.data?.message || "Cập nhật thất bại.";
            openSnackbar({ text: msg, type: "error", icon: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page className="bg-gray-100 pb-24 relative">

            {/* Header Profile */}
            <div className="bg-red-800 pb-10 pt-12 px-4 rounded-b-3xl relative">

                {/* 2. NÚT BACK VỀ HOME (Ở góc trái) */}
                <div
                    className="absolute top-15 left-4 text-white p-2 cursor-pointer z-20"
                    onClick={() => navigate(-1)}
                >
                    <FaChevronLeft size={20} />
                </div>

                <div className="flex flex-col items-center">
                    <div className="relative cursor-pointer" onClick={triggerFileInput}>
                        <Avatar src={formData.avatar} size={80} className="border-4 border-white shadow-lg bg-gray-300" />
                        <div className="absolute bottom-0 right-0 bg-gray-200 p-1.5 rounded-full border border-white text-gray-600 active:bg-gray-300 transition-colors">
                            <FaCamera size={12} />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleChooseImage}
                        />
                    </div>
                    <Text.Title size="large" className="text-white font-bold mt-3">
                        {formData.name || "Khách hàng"}
                    </Text.Title>
                    <Text size="small" className="text-white/80">
                        {user.level?.name || "Thành viên"}
                    </Text>
                </div>
            </div>

            {/* Menu Chức Năng */}
            <Box className="px-4 -mt-6 mb-6 relative z-10">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <List>
                        <List.Item
                            onClick={() => navigate('/notifications')}
                            prefix={<Icon icon="zi-notif" className="text-blue-500" />}
                            suffix={<FaChevronRight className="text-gray-400" size={14} />}
                            title="Thông báo của tôi"
                        />
                        <List.Item
                            onClick={() => navigate('/partner-register')}
                            prefix={<Icon icon="zi-more-grid" className="text-green-600" />}
                            suffix={<FaChevronRight className="text-gray-400" size={14} />}
                            title="Đăng ký đối tác"
                        />
                    </List>
                </div>
            </Box>

            {/* Form Cập Nhật */}
            <Box className="px-4">
                <div className="flex items-center gap-2 mb-3 text-red-800 font-bold">
                    <FaUserEdit />
                    <Text.Title size="medium">Thông tin cá nhân</Text.Title>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-4">
                    <Input
                        label="Họ và tên"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Nhập họ tên"
                    />
                    <Input
                        label="Số điện thoại"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="Nhập số điện thoại"
                        type="number"
                    />
                    <Input
                        label="Email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="email@example.com"
                    />
                    <div className="flex flex-col">
                        <Text size="small" className="mb-1 text-gray-500 font-medium">Ngày sinh</Text>
                        <DatePicker
                            value={formData.birthDate}
                            onChange={(value, date) => handleChange("birthDate", value)}
                            dateFormat="dd/mm/yyyy"
                            title="Chọn ngày sinh"
                        />
                    </div>
                    <div className="flex flex-col">
                        <Text size="small" className="mb-1 text-gray-500 font-medium">Giới tính</Text>
                        <Select
                            value={formData.gender}
                            onChange={(value) => handleChange("gender", value)}
                            placeholder="Chọn giới tính"
                        >
                            <Select.Option value="male" title="Nam" />
                            <Select.Option value="female" title="Nữ" />
                            <Select.Option value="other" title="Khác" />
                        </Select>
                    </div>
                    <Input
                        label="Địa chỉ"
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Số nhà, đường, phường/xã..."
                    />
                    <Button
                        fullWidth
                        variant="primary"
                        onClick={handleUpdate}
                        loading={loading}
                        className="bg-red-800 mt-2"
                    >
                        Lưu thay đổi
                    </Button>
                </div>
            </Box>
        </Page>
    );
};

// Component NavItem
const NavItem = ({ icon, label, active, onClick }) => (
    <div className={`flex flex-col items-center gap-1 ${active ? 'opacity-100' : 'opacity-60'} active:opacity-100 active:scale-95 transition-all`} onClick={onClick}>
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
        {active && <div className="w-1/2 h-0.5 bg-white rounded-full mt-0.5"></div>}
    </div>
);

export default ProfilePage;