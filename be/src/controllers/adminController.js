import { responseSuccess } from "../common/helpers/response.helper.js"
import { adminService } from "../services/adminService.js"

export const adminController = {
    getAllUSerZalo: async (req, res, next) => {
        try {
            const keyword = req.query.keyword || ""
            const page = Number(req.query.page) || 1
            const data = await adminService.getAllUSerZalo(keyword, page)
            const response = responseSuccess(data, "Lấy người dùng zalo thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy người dùng không thành công", err)
            next(err)
        }
    },
    updateUserZaloActive : async (req,res,next) => {
        try {
            const userId = req.params.userId
            const data = await adminService.updateUserZaloActive(userId,req.body)
            const response = responseSuccess(data,"Cập nhật trạng thái người dùng thành công")
             res.status(response.status).json(response)
        } catch (err) {
             console.error("Cập nhật trạng thái người dùng không thành công", err)
            next(err)
        }
    },
      updatePartnerActive : async (req,res,next) => {
        try {
            const partnerId = req.params.partnerId
            const data = await adminService.updatePartnerActive(partnerId,req.body)
            const response = responseSuccess(data,"Cập nhật trạng thái đối tác thành công")
             res.status(response.status).json(response)
        } catch (err) {
             console.error("Cập nhật trạng thái đối tác không thành công", err)
            next(err)
        }
    },
    getAllPartner: async (req, res, next) => {
        try {
            const keyword = req.query.keyword || ""
            const page = Number(req.query.page) || 1
            const data = await adminService.getAllPartner(keyword, page)
            const response = responseSuccess(data, "Lấy tài khoản dối tác thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy tài khoản dối tác không thành công", err)
            next(err)
        }
    },
    getAllPartnerRequest: async (req, res, next) => {
        try {
            const status = req.query.status || ""
            const page = Number(req.query.page) || 1
            const data = await adminService.getAllPartnerRequest(status, page)
            const response = responseSuccess(data, "Lấy danh sách người dùng yêu cầu làm đối tác thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy danh sách người dùng yêu cầu làm đối tác không thành công", err)
            next(err)
        }
    },
    getAllStoreRequest: async (req, res, next) => {
        try {
            const status = req.query.status || ""
            const page = Number(req.query.page) || 1
            const data = await adminService.getAllStoreRequest(status, page)
            const response = responseSuccess(data, "Lấy danh sách cửa hàng cần duyệt thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy danh sách cửa hàng cần duyệt không thành công", err)
            next(err)
        }
    },
    approvePartnerRequest: async (req, res, next) => {
        try {
            const adminId = req.user.id
            const requestId = Number(req.params.requestId)
            const data = await adminService.approvePartnerRequest(requestId, adminId)
            const response = responseSuccess(data, "Chấp nhận thành đối tác thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Chấp nhận thành đối tác không thành công", err)
            next(err)
        }
    },
    rejectPartnerRequest: async (req, res, next) => {
        try {
            const adminId = req.user.id
            const requestId = Number(req.params.requestId)
            await adminService.rejectPartnerRequest(requestId, adminId)
            const response = responseSuccess(null, "Từ chối thành đối tác thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Từ chối thành đối tác không thành công", err)
            next(err)
        }
    },
    approveStoreRequest: async (req, res, next) => {
        try {
            const adminId = req.user.id
            const storeId = Number(req.params.requestId)
            await adminService.approveStoreRequest(storeId, adminId)
            const response = responseSuccess(null, "Chấp nhận cửa hàng đối tác thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Chấp nhận cửa hàng đối tác không thành công", err)
            next(err)
        }
    },
    rejectStoreRequest: async (req, res, next) => {
        try {
            const adminId = req.user.id
            const storeId = Number(req.params.requestId)
            await adminService.rejectStoreRequest(storeId, adminId)
            const response = responseSuccess(null, "Từ chối cửa hàng đối tác thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Từ chối cửa hàng đối tác không thành công", err)
            next(err)
        }
    },
    createPointCode: async (req, res, next) => {
        try {
            const adminId = req.user.id
            const data = await adminService.createPointCode(adminId,req.body)
            const response = responseSuccess(data, "Tạo mã cộng điểm thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Tạo mã cộng điểm không thành công", err)
            next(err)
        }
    },
    updatePointCode: async (req, res, next) => {
        try {
            const pointCodeId = req.params.pointCodeId
            const data = await adminService.updatePointCode(pointCodeId, req.body)
            const response = responseSuccess(data, "Cập nhật mã cộng điểm thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Cập nhật mã cộng điểm không thành công", err)
            next(err)
        }
    },
    getAllpointCode: async (req, res, next) => {
        try {
            const keyword = req.query.keyword || ""
            const page = Number(req.query.page) || 1
            const data = await adminService.getAllpointCode(keyword, page)
            const response = responseSuccess(data, "Lấy danh sách mã cộng điểm thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy danh sách mã cộng điểm không thành công", err)
            next(err)
        }
    },
    getAllUserUsedPointCode: async (req, res, next) => {
        try {
            const keyword = req.query.keyword || ""
            const page = Number(req.query.page) || 1
            const data = await adminService.getAllUserUsedPointCode(keyword, page)
            const response = responseSuccess(data, "Lấy danh sách người dùng đã sử dụng mã cộng điểm thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy danh sách người dùng đã sử dụng mã cộng điểm không thành công", err)
            next(err)
        }
    },
    createMemberLevel: async (req, res, next) => {
        try {
            const data = await adminService.createMemberLevel(req.body)
            const response = responseSuccess(data, "Tạo bậc thành viên thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Tạo bậc thành viên không thành công", err)
            next(err)
        }
    },
    updateMemberLevel: async (req, res, next) => {
        try {
            const memberLevelId = req.params.memberLevelId
            const data = await adminService.updateMemberLevel(memberLevelId, req.body)
            const response = responseSuccess(data, "Cập nhật bậc thành viên thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Cập nhật bậc thành viên không thành công", err)
            next(err)
        }
    },
    getAllMemberLevel: async (req, res, next) => {
        try {
            const keyword = req.query.keyword || ""
            const page = Number(req.query.page) || 1
            const data = await adminService.getAllMemberLevel(keyword, page)
            const response = responseSuccess(data, "Lấy danh sách bậc thành viên thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy danh sách bậc thành viên không thành công", err)
            next(err)
        }
    },
    createRewardGlobal: async (req, res, next) => {
        try {
            const data = await adminService.createRewardGlobal(req.body)
            const response = responseSuccess(data, "Tạo phần thưởng toàn hệ thống thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Tạo phần thưởng toàn hệ thống không thành công", err)
            next(err)
        }
    },
    updateRewardGlobal: async (req, res, next) => {
        try {
            const rewardGlobalId = req.params.rewardGlobalId
            const data = await adminService.updateRewardGlobal(rewardGlobalId, req.body)
            const response = responseSuccess(data, "Cập nhật phần thưởng toàn hệ thống thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Cập nhậtphần thưởng toàn hệ thống không thành công", err)
            next(err)
        }
    },
    getAllRewardGlobal: async (req, res, next) => {
        try {
            const keyword = req.query.keyword || ""
            const page = Number(req.query.page) || 1
            const data = await adminService.getAllRewardGlobal(keyword, page)
            const response = responseSuccess(data, "Lấy danh sách phần thưởng toàn quốc thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy danh sách phần thưởng toàn quốc không thành công", err)
            next(err)
        }
    },
    getTotal: async (req, res, next) => {
        try {
            const data = await adminService.getTotal()
            const response = responseSuccess(data, "Lấy tổng thống kế thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy tổng thống kế không thành công", err)
            next(err)
        }
    },
    topUsersByPoints: async (req, res, next) => {
        try {
            const data = await adminService.topUsersByPoints()
            const response = responseSuccess(data, "Lấy top người dùng điểm cao nhất thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy top người dùng điểm cao nhất không thành công", err)
            next(err)
        }
    },
    getMemberLevelDistribution: async (req, res, next) => {
        try {
            const data = await adminService.getMemberLevelDistribution()
            const response = responseSuccess(data, "Lấy số lượng các bậc thành viên người dùng toàn hệ thống thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy số lượng các bậc thành viên người dùng toàn hệ thống không thành công", err)
            next(err)
        }
    },
    getPointLineChart: async (req, res, next) => {
        try {
            const startDate = req.query.startDate
            const endDate = req.query.endDate
            const range = req.query.range
            const storeId = req.query.storeId
            const data = await adminService.getPointLineChart({ startDate, endDate, range, storeId })
            responseSuccess(data, "Lấy dữ liệu biểu đồ điểm giao dịch của người dùng toàn hệ thống thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy dữ liệu biểu đồ điểm giao dịch của người dùng toàn hệ thống thành công", err)
            next(err)
        }
    }
}