import { https } from "../config"

export const getAllPointCode = (keyword, page) => {
    return https.get(`/api/admin/getAllpointCode?keyword=${keyword}&page=${page}`);
}
export const getAllUserUsedPointCode = (keyword, page) => {
    return https.get(`/api/admin/getAllUserUsedPointCode?keyword=${keyword}&page=${page}`);
}