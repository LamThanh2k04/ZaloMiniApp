import React, { useState } from "react";
import { Page, Box, Text, Input, Button, Icon, useNavigate, useSnackbar } from "zmp-ui";
import { userApi } from "../api/userService";
import { FaHandshake, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const PartnerRegisterPage = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: ""
    });

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        // Validate cơ bản
        if (!form.fullName || !form.phone || !form.email) {
            openSnackbar({ text: "Vui lòng điền đầy đủ thông tin!", type: "warning" });
            return;
        }

        setLoading(true);
        try {
            await userApi.registerPartner(form);

            openSnackbar({
                text: "Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm.",
                type: "success",
                duration: 4000
            });

            // Quay về sau 2 giây
            setTimeout(() => navigate(-1), 2000);

        } catch (error) {
            console.log("Lỗi đăng ký:", error);
            openSnackbar({ text: "Có lỗi xảy ra, vui lòng thử lại.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page className="bg-white">
            <div className="bg-white p-4 pt-10 sticky top-15 z-50 flex items-center gap-3 shadow-sm">
                <Icon icon="zi-chevron-left" onClick={() => navigate(-1)} />
                <Text.Title size="large" className="font-bold text-black">Đăng ký đối tác</Text.Title>
            </div>

            <Box className="p-6">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                        <FaHandshake size={40} />
                    </div>
                    <Text className="text-center text-gray-500">
                        Trở thành đối tác của hệ thống để nhận nhiều ưu đãi đặc quyền và mở rộng kinh doanh.
                    </Text>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1 text-gray-700 font-medium text-sm">
                            <FaUser className="text-green-600" /> Họ và tên
                        </div>
                        <Input
                            placeholder="Nhập họ tên của bạn"
                            value={form.fullName}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1 text-gray-700 font-medium text-sm">
                            <FaPhone className="text-green-600" /> Số điện thoại
                        </div>
                        <Input
                            placeholder="Nhập số điện thoại liên hệ"
                            type="number"
                            value={form.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1 text-gray-700 font-medium text-sm">
                            <FaEnvelope className="text-green-600" /> Email
                        </div>
                        <Input
                            placeholder="example@gmail.com"
                            value={form.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1 text-gray-700 font-medium text-sm">
                            <FaMapMarkerAlt className="text-green-600" /> Địa chỉ kinh doanh
                        </div>
                        <Input
                            placeholder="Nhập địa chỉ của bạn"
                            value={form.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                        />
                    </div>

                    <Button
                        fullWidth
                        size="large"
                        className="bg-green-700 mt-4"
                        onClick={handleSubmit}
                        loading={loading}
                    >
                        Gửi Đăng Ký
                    </Button>
                </div>
            </Box>
        </Page>
    );
};

export default PartnerRegisterPage;