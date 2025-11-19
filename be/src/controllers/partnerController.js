import { responseSuccess } from "../common/helpers/response.helper.js"
import { partnerService } from "../services/partnerService.js"


export const partnerController = {
    createStore: async (req, res, next) => {
        try {
            const partnerId = req.user.id
            const logo = req.file?.path
            const data = await partnerService.createStore(partnerId, req.body, logo)
            const response = responseSuccess(data, "Đăng kí cửa hàng thành công. Đợi admin duyệt")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Đăng kí cửa hàng Không thành công")
            next(err)
        }
    },
    updateStore: async (req, res, next) => {
        try {
            const storeId = req.user.storeId
            const logo = req.file?.path
            const data = await partnerService.updateStore(storeId, req.body, logo)
            const response = responseSuccess(data, "Cập nhật cửa hàng thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Cập nhật cửa hàng không thành công")
            next(err)
        }
    },
    getAllStoresPartner: async (req, res, next) => {
        try {
            const partnerId = req.user.id
            const data = await partnerService.getAllStoresPartner(partnerId)
            const response = responseSuccess(data, "Lấy danh sách cửa hàng của đối tác đó thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy danh sách cửa hàng của đối tác đó không thành công")
            next(err)
        }
    },
    createRewardStore: async (req, res, next) => {
        try {
            const data = await partnerService.createRewardStore(req.body)
            const response = responseSuccess(data, "Tạo reward cho cửa hàng thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Tạo reward cho cửa hàng không thành công")
            next(err)
        }
    },
    updateRewardStore: async (req, res, next) => {
        try {
            const rewardStoreId = req.params.rewardStoreId
            const data = await partnerService.updateRewardStore(rewardStoreId, req.body)
            const response = responseSuccess(data, "Cập nhật reward cho cửa hàng thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Cập nhật reward cho cửa hàng không thành công")
            next(err)
        }
    },
    getRewardsStore: async (req, res, next) => {
        try {
            const partnerId = req.user.id
            const keyword = req.query.keyword || ""
            const storeId = Number(req.query.storeId)
            const page = Number(req.query.page) || 1
            const data = await partnerService.getRewardsStore(partnerId, keyword, storeId, page)
            const response = responseSuccess(data, "Lấy danh sách reward cho cửa hàng thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy danh sách reward cho cửa hàng không thành công")
            next(err)
        }
    },
    getUserVouchersByStatus: async (req, res, next) => {
        try {
            const partnerId = req.user.id
            const status = req.query.status || ""
            const page = Number(req.query.page) || 1
            const data = await partnerService.getUserVouchersByStatus(partnerId, status, page)
            const response = responseSuccess(data, "Lấy danh sách người lấy voucher nào ở cửa hàng thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy danh sách người lấy voucher nào ở cửa hàng không thành công")
            next(err)
        }
    },
    getTotal: async (req, res, next) => {
        try {
            const data = await partnerService.getTotal()
            const response = responseSuccess(data, "Lấy tổng thống kế thành công")
            res.status(response.status).json(response)
        } catch (err) {
            console.error("Lấy tổng thống kế không thành công", err)
            next(err)
        }
    },
    getTopUserPointStore: async (req, res, next) => {
    try {
        const partnerId = req.user.id;
        const storeId = req.query.storeId;

        const data = await partnerService.getTopUserPointStore(partnerId, storeId);

        const response = responseSuccess(data, "Lấy top user tích điểm thành công");
        res.status(response.status).json(response);

    } catch (err) {
        console.error("Lỗi khi lấy top user:", err);
        next(err);
    }
},

    getPointRevenueTimeline: async (req, res, next) => {
    try {
        const partnerId = req.user.id;

        const type = req.query.type;          // day | week | month
        const storeId = req.query.storeId;    // optional
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        if (!type) {
            throw new BadrequestException("type là bắt buộc: day | week | month");
        }

        const data = await partnerService.getPointRevenueTimeline(
            partnerId,
            type,
            storeId,
            startDate,
            endDate
        );

        const response = responseSuccess(
            data,
            "Lấy thống kê doanh thu điểm thành công"
        );

        res.status(response.status).json(response);

    } catch (err) {
        console.error('Lỗi khi lấy thống kê điểm:', err);
        next(err);
    }
}

}
