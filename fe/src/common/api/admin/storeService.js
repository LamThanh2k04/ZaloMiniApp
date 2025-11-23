import { https } from "../config"

export const getAllStoreRequest = (page) => {
    return https.get(`/api/admin/getAllStoreRequest?page=${page}`);
}