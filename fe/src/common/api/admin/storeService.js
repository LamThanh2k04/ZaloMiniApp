import { https } from "../config"
export const getAllStoreRequest = (page) => {
    return https.get(`/api/admin/getAllStoreRequest?page=${page}`);
}
export const approveStoreRequest = (requestId) => {
    return https.post(`/api/admin/approveStoreRequest/${requestId}`);
}
export const rejectStoreRequest = (requestId) => {
    return https.post(`/api/admin/rejectStoreRequest/${requestId}`);
}
