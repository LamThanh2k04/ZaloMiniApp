import { https } from "./config";
export const rewardApi = {
    // 1. Lấy danh sách Hot Deal (Quà Global)
    getGlobalRewards: () => https.get("/api/userZalo/listRewardIsGlobal"),

    // 2. Lấy danh sách Voucher theo cửa hàng (VD: Voucher dành cho bạn)
    getRewardsByStore: (storeId) => https.get("/api/userZalo/listRewardsByStoreId", {
        params: { storeId }
    }),

    // 3. Đổi quà
    redeemReward: (rewardId) => https.post(`/api/userZalo/redeemReward/${rewardId}`),

    // 4. Lấy danh sách quà Của Tôi (Đã đổi)
    getMyRewards: (status = 'all', page = 1) => https.get("/api/userZalo/getAllRewardsUser", {
        params: { status, page } // status: 'unused', 'used', 'expired'
    }),
    getRewarDetail: (rewardId) => {
        https.get(`/api/userZalo/getInfoRewardUser/${rewardId}`)
    },
    // 5. Nhập mã code tích điểm
    redeemCode: (code) => https.post("/api/userZalo/redeemCode", { code }),
};