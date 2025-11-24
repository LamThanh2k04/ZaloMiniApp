import React, { useEffect } from 'react'
import { Form, Input, InputNumber, DatePicker, Button, Select } from "antd";
import dayjs from "dayjs";
import toast from 'react-hot-toast';
import { updatePointCode } from '../../../common/api/admin/pointcodeService';
function FormUpdatePointCode({ onSuccess, pointCodeData, onCancel }) {
    const [form] = Form.useForm();
    useEffect(() => {
        if (pointCodeData) {
            form.setFieldsValue({
                description: pointCodeData.description,
                maxUses: pointCodeData.maxUses,
                perUserLimit: pointCodeData.perUserLimit,
                expiredAt: dayjs(pointCodeData.expiredAt),
                isActive: pointCodeData.isActive
            })
        }
    }, [pointCodeData, form]);
    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
                expiredAt: values.expiredAt.toISOString(),
            };
            const res = await updatePointCode(pointCodeData.id, payload);
            console.log("Cập nhật pointcode: ", res);
            toast.success("Cập nhật mã code thành công");
            onSuccess();
            onCancel();
        } catch (error) {
            console.log(error);
            toast.error("Cập nhật mã code thất bại");
        }
    }
    return (
        <div className="w-[800px] max-w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Cập nhật Mã Cộng Điểm</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-6 w-full"
            >
                <Form.Item label="Mô tả" name="description">
                    <Input className="w-full" />
                </Form.Item>

                <div className="flex items-center justify-between gap-10">
                    <Form.Item label="Số lần tối đa" name="maxUses" className="flex-1" rules={[{ required: true }]}>
                        <InputNumber min={1} className="w-full" />
                    </Form.Item>

                    <Form.Item label="Giới hạn mỗi user" name="perUserLimit" className="flex-1" rules={[{ required: true }]}>
                        <InputNumber min={1} className="w-full" />
                    </Form.Item>
                </div>

                <Form.Item label="Ngày hết hạn" name="expiredAt" rules={[{ required: true }]}>
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

                <div className="flex justify-end gap-3">
                    <Button onClick={onCancel}>Hủy</Button>
                    <Button type="primary" htmlType="submit">Cập nhật</Button>
                </div>
            </Form>
        </div>
    )
}

export default FormUpdatePointCode