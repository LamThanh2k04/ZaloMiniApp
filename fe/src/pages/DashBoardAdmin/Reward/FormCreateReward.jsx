import React from 'react'
import { Form, Input, InputNumber, DatePicker, Button, Select } from 'antd';
import toast from 'react-hot-toast';
import { createRewardGlobal } from '../../../common/api/admin/rewardService';
function FormCreateReward({ onSuccess }) {
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        const payload = {
            ...values,
            expiredAt: values.expiredAt.toISOString(),
        };
        try {
            const res = await createRewardGlobal(payload);
            console.log("Thêm phần thưởng: ", res);
            toast.success("Thêm phần thưởng thành công");
            form.resetFields();
            onSuccess();
        } catch (error) {
            console.log(error);
            toast.error("Thêm phần thường thất bại");
        }
    }
    return (
        <div className="w-[800px] max-w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Tạo phần thưởng</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-6 w-full"
            >
                <Form.Item
                    label="Phần thưởng"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập phần thưởng" }]}
                >
                    <Input placeholder="Nhập phần thưởng" className="w-full" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                >
                    <Input placeholder="Nhập mô tả" className="w-full" />
                </Form.Item>
                <Form.Item
                    label="Số lượng"
                    name="quantity"
                    className="flex-1"
                    rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
                >
                    <InputNumber min={1} className="w-full" />
                </Form.Item>
                <Form.Item
                    label="Số điểm tương ứng"
                    name="pointsNeeded"
                    className="flex-1"
                    rules={[{ required: true, message: "Vui lòng nhập số điểm tương ứng" }]}
                >
                    <InputNumber min={1} className="w-full" />
                </Form.Item>
                <Form.Item
                    label="Ngày hết hạn"
                    name="expiredAt"
                    rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}
                >
                    <DatePicker className="w-full" />
                </Form.Item>
                <Form.Item
                    label="Trạng thái"
                    name="isActive"
                    rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Select.Option value={true}>Còn tác dụng</Select.Option>
                        <Select.Option value={false}>Không còn tác dụng</Select.Option>
                    </Select>
                </Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                    Tạo phần thưởng
                </Button>
            </Form>
        </div>
    )
}

export default FormCreateReward