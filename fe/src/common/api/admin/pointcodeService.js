import { https } from "../config"

export const getAllPointCode = (keyword, page) => {
    return https.get(`/api/admin/getAllpointCode?keyword=${keyword}&page=${page}`);
}
export const getAllUserUsedPointCode = (keyword, page) => {
    return https.get(`/api/admin/getAllUserUsedPointCode?keyword=${keyword}&page=${page}`);
}
export const createPointCode = (data) => {
    return https.post("/api/admin/createPointCode", data);
}
export const updatePointCode = (pointCodeId, data) => {
    return https.put(`/api/admin/updatePointCode/${pointCodeId}`, data)
}