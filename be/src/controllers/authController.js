import { responseSuccess } from "../common/helpers/response.helper.js"
import { authService } from "../services/authService.js"

export const authController = {
    loginZalo: async (req, res, next) => {
        try {
            const data = await authService.loginZalo(req.body)
            const response = responseSuccess(data, "Đăng nhập người dùng bằng zalo thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Đăng nhập người dùng bằng zalo không thành công", err)
            next(err)
        }
    },
    loginPartner: async (req, res, next) => {
        try {
            const data = await authService.loginPartner(req.body)
            const response = responseSuccess(data, "Đăng nhập thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Đăng nhập không thành công", err)
            next(err)
        }
    },
    loginAdmin: async (req, res, next) => {
        try {
            const data = await authService.loginAdmin(req.body)
            const response = responseSuccess(data, "Đăng nhập thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Đăng nhập không thành công", err)
            next(err)
        }
    },
    createAdmin: async (req, res, next) => {
        try {
            const data = await authService.createAdmin(req.body)
            const response = responseSuccess(data, "Đăng nhập thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Đăng nhập không thành công", err)
            next(err)
        }
    }

}