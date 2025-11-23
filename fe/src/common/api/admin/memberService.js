import { https } from "../config";

export const getAllMemberLevelService = (keyword, page) => {
    return https.get(`/api/admin/getAllMemberLevel?keyword=${keyword}&page=${page}`);
}