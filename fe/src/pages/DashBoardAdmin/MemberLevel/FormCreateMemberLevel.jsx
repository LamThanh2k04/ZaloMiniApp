import React from 'react'
import { Form, Input, InputNumber, Button } from "antd";
import toast from 'react-hot-toast';
import { createMemberLevel } from '../../../common/api/admin/memberService';
function FormCreateMemberLevel({ onSuccess }) {
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
            };
            const res = await createMemberLevel(payload);
            console.log("Thêm cấp bậc: ", res);
            toast.success("Thêm cấp bậc thành công");
            form.resetFields();
            onSuccess();
        } catch (error) {
            console.log(error);
            toast.error("Không thêm được cấp bậc");
        }
    }
    return (
        <div className="w-[800px] max-w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Tạo cấp bậc</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-6 w-full"
            >
                <Form.Item
                    label="Tên cấp bậc"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên cấp bậc" }]}
                >
                    <Input placeholder="Nhập cấp bậc" className="w-full" />
                </Form.Item>
                <Form.Item
                    label="Điểm tối thiểu"
                    name="minPoints"
                    rules={[{ required: true, message: "Vui lòng nhập điểm tối thiểu" }]}
                >
                    <InputNumber min={1} className="w-full" />
                </Form.Item>
                <Form.Item
                    label="Điểm tối đa"
                    name="maxPoints"
                    className="flex-1"
                    rules={[{ required: true, message: "Vui lòng nhập điểm tối đa" }]}
                >
                    <InputNumber min={1} className="w-full" />
                </Form.Item>
                <Form.Item
                    label="Quyền lợi"
                    name="benefits"
                    className="flex-1"
                    rules={[{ required: true, message: "Quyền lợi ở cấp bậc này?" }]}
                >
                    <Input placeholder="Nhập quyền lợi" className="w-full" />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                    Tạo cấp bậc
                </Button>
            </Form>
        </div>
    )
}

export default FormCreateMemberLevel