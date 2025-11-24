import React from 'react'
import { Form, Input, InputNumber, DatePicker, Button } from "antd";
import toast from 'react-hot-toast';
import { createPointCode } from '../../../common/api/admin/pointcodeService';

function FormCreatePointCode({ onSuccess }) {
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
                expiredAt: values.expiredAt.toISOString(),
            };
            const res = await createPointCode(payload);
            console.log("Tạo pointcode: ", res);
            toast.success("Tạo mã code thành công");
            form.resetFields();
            onSuccess();
        } catch (error) {
            console.log(error);
            toast.error("Tạo mã code thất bại");
        }
    }
    return (
        <div className="w-[800px] max-w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Tạo Mã Cộng Điểm</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-6 w-full"
            >
                <Form.Item
                    label="Mã code"
                    name="code"
                    rules={[{ required: true, message: "Vui lòng nhập mã code" }]}
                >
                    <Input placeholder="Nhập mã code" className="w-full" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                >
                    <Input placeholder="Nhập mô tả" className="w-full" />
                </Form.Item>

                <div className="flex items-center justify-between gap-10">
                    <Form.Item
                        label="Điểm cộng"
                        name="points"
                        className="flex-1"
                        rules={[{ required: true, message: "Vui lòng nhập số điểm" }]}
                    >
                        <InputNumber min={1} className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Số lần tối đa"
                        name="maxUses"
                        className="flex-1"
                        rules={[{ required: true, message: "Vui lòng nhập số lần tối đa" }]}
                    >
                        <InputNumber min={1} className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Giới hạn mỗi user"
                        name="perUserLimit"
                        className="flex-1"
                        rules={[{ required: true, message: "Vui lòng nhập giới hạn mỗi user" }]}
                    >
                        <InputNumber min={1} className="w-full" />
                    </Form.Item>
                </div>

                <Form.Item
                    label="Ngày hết hạn"
                    name="expiredAt"
                    rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}
                >
                    <DatePicker className="w-full" />
                </Form.Item>

                <Button type="primary" htmlType="submit" className="w-full">
                    Tạo mã cộng điểm
                </Button>
            </Form>
        </div>
    )
}

export default FormCreatePointCode