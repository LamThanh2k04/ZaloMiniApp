import React, { useState } from 'react'
import { Form, Input, InputNumber, Button, Upload } from 'antd';
import toast from 'react-hot-toast';
import { UploadOutlined } from "@ant-design/icons";
import { createStorePartner } from '../../../common/api/partner/storeService';
function FormCreateStore({ onSuccess }) {
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("address", values.address);
            formData.append("pointRate", values.pointRate);
            if (file) {
                formData.append("logo", file);
            }
            const res = await createStorePartner(formData);
            console.log("Thêm cửa hàng đối tác: ", res);
            toast.success("Thêm cửa hàng đối tác thành công");
            form.resetFields();
            onSuccess();
        } catch (error) {
            console.log(error);
            toast.error("Thêm cửa hàng đối tác thất bại");
        }
    }
    return (
        <div className="w-[800px] max-w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Thêm cửa hàng</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-6 w-full"
            >
                <Form.Item
                    label="Cửa hàng"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên cửa hàng" }]}
                >
                    <Input placeholder="Nhập tên cửa hàng" className="w-full" />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ"
                    name="address"
                >
                    <Input placeholder="Nhập địa chỉ" className="w-full" />
                </Form.Item>
                <Form.Item
                    label="Số điểm"
                    name="pointRate"
                    className="flex-1"
                    rules={[{ required: true, message: "Vui lòng nhập số điểm tương ứng" }]}
                >
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
                <Button type="primary" htmlType="submit" className="w-full">
                    Thêm cửa hàng
                </Button>
            </Form>
        </div>
    )
}

export default FormCreateStore