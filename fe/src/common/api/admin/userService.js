import { https } from "../config"

export const getAllUserService = (keyword, page) => {
    return https.get(`/api/admin/getAllUSerZalo?keyword=${keyword}&page=${page}`);
}