import { https } from "../config"

export const getAllUserService = (keyword, page) => {
    return https.get(`/api/admin/getAllUSerZalo?keyword=${keyword}&page=${page}`);
}
export const updateUserZaloActive = (userId, data) => {
    return https.put(`/api/admin/updateUserZaloActive/${userId}`, data);
}