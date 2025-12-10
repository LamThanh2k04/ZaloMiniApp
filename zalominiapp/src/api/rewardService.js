import { https } from "./config";
export const rewardApi = {
    // 1. Lấy danh sách Hot Deal (Quà Global)
    getGlobalRewards: () => https.get("/api/userZalo/listRewardIsGlobal"),

    // 2. Lấy danh sách Voucher theo cửa hàng (VD: Voucher dành cho bạn)
    getRewardsByStore: (storeId) => https.get("/api/userZalo/listRewardsByStoreId", {
        params: { storeId }
    }),
    // 3 Lấy dánh sách cửa hàng
    getAllStores: () => {
        return https.get("/api/userZalo/getAllStore");
    },
    // 4. Đổi quà
    redeemReward: (rewardId) => https.post(`/api/userZalo/redeemReward/${rewardId}`),

    // 5. Lấy danh sách quà Của Tôi (Đã đổi)
    getMyRewards: (status = 'all', page = 1) => https.get("/api/userZalo/getAllRewardsUser", {
        params: { status, page } // status: 'unused', 'used', 'expired'
    }),
    getRewarDetail: (rewardId) => {
        return https.get(`/api/userZalo/getInfoRewardUser/${rewardId}`)
    },
    // 6. Nhập mã code tích điểm
    redeemCode: (code) => https.post("/api/userZalo/redeemCode", { code }),
};