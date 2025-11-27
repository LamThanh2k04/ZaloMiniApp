import { https } from "../config"

export const getAllRewardGlobal = (keyword, page) => {
    return https.get(`/api/admin/getAllRewardGlobal?keyword=${keyword}&page=${page}`);
};
export const createRewardGlobal = (data) => {
    return https.post("/api/admin/createRewardGlobal", data);
};
export const updateRewardGlobal = (rewardGlobalId, data) => {
    return https.put(`/api/admin/updateRewardGlobal/${rewardGlobalId}`, data);
};

