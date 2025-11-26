import React from 'react'
import { Form, Input, InputNumber, Button, DatePicker, Select } from 'antd';
import toast from 'react-hot-toast';
import { createRewardStore } from '../../../common/api/partner/rewardService';
function FormCreateRewardPartner({ onSuccess, store }) {
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
                expiredAt: values.expiredAt.toISOString(),
            };
            const res = await createRewardStore(payload);
            console.log("Thêm phần thưởng cho cửa hàng: ", res);
            toast.success("Thêm phần thưởng cho cửa hàng thành công");
            form.resetFields();
            onSuccess();
        } catch (error) {
            console.log(error);
            toast.error("Thêm phần thưởng cho cửa hàng thất bại");
        }
    }
    return (
        <div className="w-[800px] max-w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Thêm phần thưởng cho cửa hàng đối tác</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-6 w-full"
            >
                <Form.Item
                    label="Tên phần thưởng"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên phần thưởng" }]}
                >
                    <Input placeholder="Nhập tên cửa hàng" className="w-full" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                >
                    <Input placeholder="Nhập mô tả" className="w-full" />
                </Form.Item>
                <Form.Item
                    label="Điểm cần thiết để đổi"
                    name="pointsNeeded"
                    className="flex-1"
                    rules={[{ required: true, message: "Vui lòng nhập số điểm cần đổi" }]}
                >
                    <InputNumber min={1} className="w-full" />
                </Form.Item>
                <Form.Item
                    label="Số lượng"
                    name="quantity"
                    rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
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
                    label="Cửa hàng"
                    name="storeId"
                    rules={[{ required: true, message: "Vui lòng chọn cửa hàng" }]}
                >
                    <Select
                        placeholder="Chọn cửa hàng"
                        options={store.map((s) => ({
                            value: s.id,
                            label: s.name,
                        }))}
                    />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                    Thêm cửa hàng
                </Button>
            </Form>
        </div>
    )
}

export default FormCreateRewardPartner;