import { https } from "../config";

export const getAllPartnerService = (keyword, page) => {
    return https.get(`/api/admin/getAllPartner?keyword=${keyword}&page=${page}`);
}
export const getAllPartnerRequestService = (page) => {
    return https.get(`/api/admin/getAllPartnerRequest?page=${page}`);
}