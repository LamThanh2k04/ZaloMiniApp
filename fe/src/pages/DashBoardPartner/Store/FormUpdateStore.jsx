import React, { useEffect, useState } from 'react'
import { Form, Input, InputNumber, Button, Select, Upload } from 'antd';
import toast from 'react-hot-toast';
import { updateStorePartner } from '../../../common/api/partner/storeService';
import { UploadOutlined } from '@ant-design/icons';
function FormUpdateStore({ storeData, onSuccess, onCancel }) {
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    useEffect(() => {
        if (storeData) {
            form.setFieldsValue({
                name: storeData.name,
                address: storeData.address,
                pointRate: storeData.pointRate,
                logo: storeData.logo,
                isActive: storeData.isActive,
            });
        }
    }, [storeData, form])
    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("address", values.address);
            formData.append("pointRate", values.pointRate);
            if (file) {
                formData.append("logo", file);
            }
            formData.append("isActive", JSON.stringify(values.isActive));
            const res = await updateStorePartner(storeData.id, formData);
            console.log("Cập nhật cửa hàng: ", res);
            toast.success("Cập nhật cửa hàng thành công");
            onSuccess();
            onCancel();
        } catch (error) {
            console.log(error);
            toast.error("Cập nhật cửa hàng thất bại");
        }
    }
    return (
        <div className="w-[800px] max-w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Cập nhật cửa hàng</h2>
            <Form.Item>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <img
                        src={storeData.logo}
                        alt="logo"
                        className="w-20 h-20 rounded-lg object-cover shadow"
                    />
                    <div className="text-sm text-gray-600">
                        Logo hiện tại của cửa hàng
                    </div>
                </div>
            </Form.Item>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-6 w-full"
            >
                <Form.Item label="Tên cửa hàng" name="name">
                    <Input className="w-full" />
                </Form.Item>
                <Form.Item label="Địa chỉ" name="address">
                    <Input className="w-full" />
                </Form.Item>
                <Form.Item label="Số điểm" name="pointRate" className="flex-1" rules={[{ required: true }]}>
                    <InputNumber min={1} className="w-full" />
                </Form.Item>
                <Form.Item label="Logo cửa hàng">
                    <Upload
                        beforeUpload={(file) => {
                            setFile(file);
                            return false; // không cho antd tự upload
                        }}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                </Form.Item>
                <Form.Item
                    label="Trạng thái"
                    name="isActive"
                    rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Select.Option value={true}>Còn hoạt động</Select.Option>
                        <Select.Option value={false}>Ngưng hoạt động</Select.Option>
                    </Select>
                </Form.Item>

                <div className="flex justify-end gap-3">
                    <Button onClick={onCancel}>Hủy</Button>
                    <Button type="primary" htmlType="submit">Lưu</Button>
                </div>
            </Form>
        </div>
    )
}

export default FormUpdateStore