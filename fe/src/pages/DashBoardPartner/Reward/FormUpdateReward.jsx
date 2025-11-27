import React, { useEffect } from 'react'
import { Form, Input, InputNumber, DatePicker, Button, Select, Upload } from 'antd';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { UploadOutlined } from '@ant-design/icons';
import { updateRewardStore } from '../../../common/api/partner/rewardService';
function FormUpdateReward({ rewardData, onSuccess, onCancel, store }) {
    const [form] = Form.useForm();
    useEffect(() => {
        if (rewardData) {
            form.setFieldsValue({
                name: rewardData.name,
                description: rewardData.description,
                quantity: rewardData.quantity,
                expiredAt: dayjs(rewardData.expiredAt),
                pointsNeeded: rewardData.pointsNeeded,
                storeId: rewardData.storeId,
                isActive: rewardData.isActive,
            })
        }
    }, [rewardData, form])
    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
                storeId: Number(values.storeId),
                expiredAt: values.expiredAt?.toISOString(),
            };
            const res = await updateRewardStore(rewardData.id, payload);
            console.log("Cập nhật phần thưởng: ", res);
            toast.success("Cập nhật phần thưởng thành công");
            onSuccess();
            onCancel();
        } catch (error) {
            console.log(error);
            toast.error("Cập nhật phần thưởng thất bại");
        }
    }
    return (
        <div className="w-[800px] max-w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Cập nhật phần thưởng</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-6 w-full"
            >
                <Form.Item label="Tên phần thưởng" name="name">
                    <Input className="w-full" />
                </Form.Item>
                <Form.Item label="Mô tả" name="description">
                    <Input className="w-full" />
                </Form.Item>
                <Form.Item label="Số lượng" name="quantity" className="flex-1" rules={[{ required: true }]}>
                    <InputNumber min={1} className="w-full" />
                </Form.Item>  <Form.Item label="Số điểm cần thiết" name="pointsNeeded" className="flex-1" rules={[{ required: true }]}>
                    <InputNumber min={1} className="w-full" />
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
                        <Select.Option value={true}>Còn hiệu lực</Select.Option>
                        <Select.Option value={false}>Hết hiệu lực</Select.Option>
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

export default FormUpdateReward