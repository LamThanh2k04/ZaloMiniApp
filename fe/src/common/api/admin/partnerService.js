import { https } from "../config";

export const getAllPartnerService = (keyword, page) => {
    return https.get(`/api/admin/getAllPartner?keyword=${keyword}&page=${page}`);
}
export const getAllPartnerRequestService = (page) => {
    return https.get(`/api/admin/getAllPartnerRequest?page=${page}`);
}
export const updatePartnerActive = (partnerId, data) => {
    return https.put(`/api/admin/updatePartnerActive/${partnerId}`, data)
}
export const approvePartnerRequest = (requestId) => {
    return https.post(`/api/admin/approvePartnerRequest/${requestId}`);
}
export const rejectPartnerRequest = (requestId) => {
    return https.post(`/api/admin/rejectPartnerRequest/${requestId}`);
}