import { loginUserZalo } from "../../api/authService";
import { getUserInfo } from "zmp-sdk";

export default function Login() {
    const handleLogin = async () => {
        try {
            // 1️⃣ Đăng nhập bằng OAuth Code lên server
            const loginRes = await loginUserZalo();
            const token = loginRes.data.token;
            localStorage.setItem("token", token);

            // 2️⃣ Lấy profile từ Zalo Client để hiển thị UI
            const res = await getUserInfo();
            const profile = res.userInfo;
            localStorage.setItem("user", JSON.stringify(profile));

            // 3️⃣ Redirect sang Home
            window.location.href = "/home";
        } catch (err) {
            console.error("Login failed: ", err);
        }
    };

    return (
        <div className="p-6 text-center">
            <h1 className="text-xl font-bold mt-4">Tích điểm thành viên</h1>
            <p className="text-gray-600 mt-2">Quét QR – Nhận điểm – Đổi quà</p>

            <button
                className="bg-blue-600 text-white py-3 px-6 rounded-lg mt-6 w-full"
                onClick={handleLogin}
            >
                Đăng nhập bằng Zalo
            </button>
        </div>
    );
}
