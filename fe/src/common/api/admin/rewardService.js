import { https } from "../config"

// admin
export const getAllRewardGlobal = (keyword, page) => {
    return https.get(`/api/admin/getAllRewardGlobal?keyword=${keyword}&page=${page}`);
}
export const createRewardGlobal = (data) => {
    return https.post("/api/admin/createRewardGlobal", data);
}
export const updateRewardGlobal = (rewardGlobalId, data) => {
    return https.put(`/api/admin/updateRewardGlobal/${rewardGlobalId}`, data);
}
// partner
export const getRewardStore = (storeId, keyword, page) => {
    return https.get(`/api/partner/getRewardsStore?storeId=${storeId || ""}&keyword=${keyword || ""}&page=${page}`);
}