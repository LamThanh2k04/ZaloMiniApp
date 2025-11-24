import { https } from "../config";

export const getAllMemberLevelService = (keyword, page) => {
    return https.get(`/api/admin/getAllMemberLevel?keyword=${keyword}&page=${page}`);
}
export const createMemberLevel = (data) => {
    return https.post("/api/admin/createMemberLevel", data);
}
export const updateMemberLevel = (memberLevelId, data) => {
    return https.put(`/api/admin/updateMemberLevel/${memberLevelId}`, data);
}