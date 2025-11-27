import { https } from '../config';
export const getAllStoresPartner = (keyword, status, page) => {
    return https.get(
        `/api/partner/getAllStoresPartner?keyword=${keyword}&status=${status}&page=${page}`
    );
};
export const createStorePartner = (data) => {
    return https.post("/api/partner/createStore", data);
};
export const updateStorePartner = (storedId, data) => {
    return https.put(`/api/partner/updateStore/${storedId}`, data);
};