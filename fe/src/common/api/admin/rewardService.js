import { https } from "../config"

export const getAllRewardGlobal = (keyword, page) => {
    return https.get(`/api/admin/getAllRewardGlobal?keyword=${keyword}&page=${page}`);
}