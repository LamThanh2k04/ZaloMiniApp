import { https } from "../config"
// admin
export const getAllStoreRequest = (page) => {
    return https.get(`/api/admin/getAllStoreRequest?page=${page}`);
}
export const approveStoreRequest = (requestId) => {
    return https.post(`/api/admin/approveStoreRequest/${requestId}`);
}
export const rejectStoreRequest = (requestId) => {
    return https.post(`/api/admin/rejectStoreRequest/${requestId}`);
}
// partner
export const getAllStoresPartner = (keyword, status, page) => {
    return https.get(
        `/api/partner/getAllStoresPartner?keyword=${keyword}&status=${status}&page=${page}`
    );
};
export const getAllStoresPartnerName = () => {
    return https.get("/api/partner/getAllStoresPartnerName");
} 