import axios from "axios"
import { BadrequestException, NotFoundException } from "../common/helpers/exception.helper.js"
import prisma from "../common/prisma/initPrisma.js"
import { generateToken } from "../common/utils/generateToken.js"
import bcrypt from "bcrypt"
export const authService = {
    loginZalo: async (data) => {
        // 1. Thay vì nhận "code", ta nhận trực tiếp "accessToken"
        const { accessToken } = data;

        if (!accessToken) {
            throw new BadrequestException("Thiếu accessToken từ Zalo Mini App");
        }

        // --- BỎ ĐOẠN NÀY (Vì Mini App không cần đổi code) ---
        /*
        const tokenRes = await axios.get("https://oauth.zaloapp.com/v4/oa/access_token", {
            params: {
                app_id: process.env.ZALO_APP_ID,
                app_secret: process.env.ZALO_APP_SECRET,
                code,
            }
        });
        const accessToken = tokenRes.data.access_token;
        */
        // ----------------------------------------------------

        try {
            // 2. Dùng accessToken nhận được để gọi Zalo lấy thông tin user
            const zaloUserRes = await axios.get("https://graph.zalo.me/v2.0/me", {
                headers: { access_token: accessToken },
                params: { fields: "id,name,picture" },
            });
            const zaloUser = zaloUserRes.data;

            // Nếu token hết hạn hoặc không hợp lệ, Zalo sẽ trả về lỗi
            if (zaloUser.error) {
                throw new BadrequestException("Token Zalo không hợp lệ: " + zaloUser.error.message);
            }

            // 3. Logic tìm hoặc tạo user (Giữ nguyên code cũ của bạn)
            let user = await prisma.user.findUnique({ where: { zaloId: String(zaloUser.id) } });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        zaloId: String(zaloUser.id),
                        name: zaloUser.name,
                        avatar: zaloUser.picture?.data?.url || null
                    }
                });
            }

            // 4. Tạo JWT token của hệ thống bạn trả về
            const token = generateToken(user.id, "user", user);

            // Trả về cả token và user info để frontend hiển thị luôn
            return { token, user };

        } catch (error) {
            // Log lỗi ra để debug
            console.error("Lỗi lấy thông tin Zalo:", error?.response?.data || error.message);
            throw new BadrequestException("Lỗi xác thực với Zalo");
        }
    },

    loginPartner: async (data) => {
        const { phone, password } = data;

        const partner = await prisma.partner.findUnique({
            where: { phone },
            include: { ownedStores: true }
        });

        if (!partner) throw new NotFoundException("Tài khoản không tồn tại");
        if (!partner.isActive) throw new BadrequestException("Tài khoản chưa được kích hoạt");

        const isMatch = await bcrypt.compare(password, partner.password);
        if (!isMatch) throw new BadrequestException("Mật khẩu không đúng");

        const token = generateToken(partner.id, "partner", partner);
        return { token };
    },

    loginAdmin: async (data) => {
        const { username, password } = data
        const admin = await prisma.admin.findUnique({
            where: { username: username }
        })
        if (!admin) {
            throw new NotFoundException("Admin không tồn tại")
        }
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            throw new BadrequestException("Mật khẩu không đúng")
        }
        const token = generateToken(admin.id, admin.role, admin)
        return {
            token
        }
    },
    createAdmin: async (data) => {
        const { username, password } = data
        const hashpassword = await bcrypt.hash(password, 10)
        const admin = await prisma.admin.create({
            data: {
                username: username,
                password: hashpassword
            }
        })
        return {
            admin
        }
    }
}