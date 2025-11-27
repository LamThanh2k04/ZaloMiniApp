import { https } from '../config';
export const getRewardStore = (storeId, keyword, page) => {
    return https.get(`/api/partner/getRewardsStore?storeId=${storeId || ""}&keyword=${keyword || ""}&page=${page}`);
};
export const createRewardStore = (data) => {
    return https.post("/api/partner/createRewardStore", data);
};
export const getAllStoresPartnerName = () => {
    return https.get("/api/partner/getAllStoresPartnerName");
};
export const updateRewardStore = (rewardStoreId, data) => {
    return https.put(`/api/partner/updateRewardStore/${rewardStoreId}`, data);
};