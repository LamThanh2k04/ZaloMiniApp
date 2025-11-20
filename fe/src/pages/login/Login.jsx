import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginAdminService, loginPartnerService } from "../../common/api/auth/loginService";
import zaloAnimation from '../../assets/animations/zalo-mini-app.json';
import Lottie from 'lottie-react';
import toast from "react-hot-toast";

export default function Login() {
    const [role, setRole] = useState("admin"); // default admin
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            let res;

            if (role === "admin") {
                res = await loginAdminService({
                    username: data.username,
                    password: data.password,
                });
                console.log("admin: ", res);
            }

            if (role === "partner") {
                res = await loginPartnerService({
                    phone: data.phone,
                    password: data.password,
                });
            }
            toast.success("Đăng nhập thành công");
            navigate(`/${role}/dashboard`);
        } catch (err) {
            console.log(err);
            toast.error("Tài khoản hoặc mật khẩu không chính xác")
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-[#ffe8d6] to-[#ffdede] px-16">
            {/* Container chính */}
            <div className="flex items-center justify-center gap-20 w-full max-w-6xl">
                {/* Animation */}
                <div className="w-1/2 flex justify-center mr-20">
                    <Lottie
                        animationData={zaloAnimation}
                        loop={true}
                        style={{ width: '100%', maxWidth: 500, height: 500 }}
                    />
                </div>

                {/* Form */}
                <div className="bg-white shadow-2xl rounded-3xl p-12 w-1/2">
                    <h2 className="text-4xl font-bold text-[#1e3a8a] text-center mb-10">
                        Đăng nhập hệ thống
                    </h2>

                    {/* Select Role */}
                    <div className="mb-8">
                        <label className="font-medium text-gray-700">Chọn vai trò</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg p-3 mt-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="admin">Quản trị viên</option>
                            <option value="partner">Đối tác</option>
                        </select>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Admin Form */}
                        {role === "admin" && (
                            <>
                                <div>
                                    <label className="font-medium text-gray-700">Tên đăng nhập</label>
                                    <input
                                        className="w-full p-3 border border-gray-300 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition"
                                        {...register("username", { required: "Không được để trống" })}
                                    />
                                    {errors.username && (
                                        <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Mật khẩu</label>
                                    <input
                                        type="password"
                                        className="w-full p-3 border border-gray-300 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition"
                                        {...register("password", { required: "Không được để trống" })}
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Partner Form */}
                        {role === "partner" && (
                            <>
                                <div>
                                    <label className="font-medium text-gray-700">Số điện thoại</label>
                                    <input
                                        className="w-full p-3 border border-gray-300 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition"
                                        {...register("phone", {
                                            required: "Không được để trống",
                                            pattern: {
                                                value: /^[0-9]{10,11}$/,
                                                message: "Số điện thoại không hợp lệ",
                                            },
                                        })}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Mật khẩu</label>
                                    <input
                                        type="password"
                                        className="w-full p-3 border border-gray-300 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition"
                                        {...register("password", {
                                            required: "Không được để trống",
                                            minLength: {
                                                value: 6,
                                                message: "Mật khẩu phải từ 6 ký tự",
                                            },
                                        })}
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-4 rounded-2xl bg-linear-to-r from-[#f582ae] to-[#fda085] text-white font-bold text-xl hover:scale-105 transition-transform duration-300"
                        >
                            Đăng nhập
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
