import React, { useEffect } from 'react'
import { Form, Input, InputNumber, Button, DatePicker, Select } from 'antd';
import toast from 'react-hot-toast';
import { updateMemberLevel } from '../../../common/api/admin/memberService';
function FormUpdateMemberLevel({ memberData, onSuccess, onCancel }) {
    const [form] = Form.useForm();
    useEffect(() => {
        if (memberData) {
            form.setFieldsValue({
                name: memberData.name,
                minPoints: memberData.minPoints,
                maxPoints: memberData.maxPoints,
                benefits: memberData.benefits,
            })
        }
    }, [memberData, form]);
    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
            };
            const res = await updateMemberLevel(memberData.id, payload);
            console.log("Cập nhật cấp bậc: ", res);
            toast.success("Cập nhật cấp bậc thành công");
            onSuccess();
            onCancel();
        } catch (error) {
            console.log(error);
            toast.error("Cập nhật cấp bậc thất bại");
        }
    }
    return (
        <div className="w-[800px] max-w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Cập nhật cấp bậc</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-6 w-full"
            >
                <Form.Item label="Tên cấp bậc" name="name">
                    <Input className="w-full" />
                </Form.Item>
                <Form.Item label="Số điểm tối thiểu" name="minPoints" className="flex-1" rules={[{ required: true }]}>
                    <InputNumber min={1} className="w-full" />
                </Form.Item>

                <Form.Item label="Số điểm tối đa" name="maxPoints" className="flex-1" rules={[{ required: true }]}>
                    <InputNumber min={1} className="w-full" />
                </Form.Item>
                <Form.Item label="Quyền lợi" name="benefits">
                    <Input className="w-full" />
                </Form.Item>
                <div className="flex justify-end gap-3">
                    <Button onClick={onCancel}>Hủy</Button>
                    <Button type="primary" htmlType="submit">Lưu</Button>
                </div>
            </Form>
        </div>
    )
}

export default FormUpdateMemberLevel