import { responseSuccess } from "../common/helpers/response.helper.js"

import { userZaloService } from "../services/userZaloService.js"

export const userZaloController = {
    getInfoUserZalo: async (req, res, next) => {
        try {
            const userZaloId = req.user.id
            const data = await userZaloService.getInfoUserZalo(userZaloId)
            const response = responseSuccess(data, "Lấy người dùng thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy người dùng không thành công", err)
            next(err)
        }
    },
    updateUserZalo: async (req, res, next) => {
        try {
            const userZaloId = req.user.id
            const avatarPath = req.file?.path;
            const data = await userZaloService.updateUserZalo(userZaloId, req.body, avatarPath)
            const response = responseSuccess(data, "Cập nhật người dùng thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Cập nhật người dùng không thành công", err)
            next(err)
        }
    },
    redeemCode: async (req, res, next) => {
        try {
            const userId = req.user.id
            await userZaloService.redeemCode(userId,req.body)
            const response = responseSuccess(null, "Cộng điểm thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Cộng điểm không thành công", err)
            next(err)
        }
    },
    listRewardsByStoreId: async (req, res, next) => {
        try {
            const storeId = req.query.storeId
            const data = await userZaloService.listRewardsByStoreId(storeId)
            const response = responseSuccess(data, "Danh sách phần thưởng của cửa hàng đó thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Danh sách phần thưởng của cửa hàng đó không thành công", err)
            next(err)
        }
    },
     listRewardIsGlobal: async (req, res, next) => {
        try {
            const data = await userZaloService.listRewardIsGlobal()
            const response = responseSuccess(data, "Danh sách phần thưởng của hệ thống đó thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Danh sách phần thưởng của toàn hệ thống đó không thành công", err)
            next(err)
        }
    },
    redeemReward: async (req, res, next) => {
        try {
            const userId = req.user.id
            const rewardId = Number(req.params.rewardId)
            await userZaloService.redeemReward(userId, rewardId)
            const response = responseSuccess(null, "Đổi lấy phần thưởng thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Đổi lấy phần thưởng không thành công", err)
            next(err)
        }
    },
    getUserTransactionSummary: async (req, res, next) => {
        try {
            const userId = req.user.id
            const status = req.query.status || ""
            const data = await userZaloService.getUserTransactionSummary(userId, status)
            const response = responseSuccess(data, "Lấy giao dịch của người dùng thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy giao dịch của người dùng không thành công", err)
            next(err)
        }
    },
    registerPartnerRequest: async (req, res, next) => {
        try {
            const userId = req.user.id
            const data = await userZaloService.registerPartnerRequest(userId, req.body)
            const response = responseSuccess(data, "Đăng kí đối tác thành công, chờ admin duyệt")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Đăng kí đối tác không thành công", err)
            next(err)
        }
    },
    getAllRewardsUser: async (req, res, next) => {
        try {
            const userId = req.user.id
            const status = req.query.status || ""
            const page = Number(req.query.page) || 1
            const data = await userZaloService.getAllRewardsUser(userId, status, page)
            const response = responseSuccess(data, "Lấy danh sách reward của người dùng thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy danh sách reward của người dùng không thành công", err)
            next(err)
        }
    },
    getAllNotificationUser: async (req, res, next) => {
        try {
            const userId = req.user.id
            const data = await userZaloService.getAllNotificationUser(userId)
            const response = responseSuccess(data, "Lấy thông báo của người dùng thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy thông báo của người dùng không thành công", err)
            next(err)
        }
    },
    getInfoNotificationUser: async (req, res, next) => {
        try {
            const userId = req.user.id
            const notificationId = req.params.notificationId
            const data = await userZaloService.getInfoNotificationUser(notificationId, userId)
            const response = responseSuccess(data, "Xem chi tiết thông báo của người dùng thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Xem chi tiết thông báo của người dùng không thành công", err)
            next(err)
        }
    },
    getAllStore : async (req,res,next) => {
        try {
            const data = await userZaloService.getAllStore()
            const response = responseSuccess(data, "Lấy tất cả cửa hàng thành công")
            res.status(response.status).json(response)
         } catch (err) {
            console.error("Lấy tất cả cửa hàng không thành công", err)
            next(err)
        }
    },
    getInfoRewardUser : async (req,res,next) => {
        try {
            const rewardId = req.params.rewardId
            const userId = req.user.id
              const data = await userZaloService.getInfoRewardUser(userId,rewardId)
            const response = responseSuccess(data, "Lấy thông tin phần thưởng thành công")
            res.status(response.status).json(response) 
        } catch (err) {
             console.error("Lấy thông tin phần thưởng không thành công", err)
            next(err)
        }
    }



}