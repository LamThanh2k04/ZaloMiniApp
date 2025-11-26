import { https } from "../config"

export const getUserVouchersByStatus = (status, page) => {
    return https.get(`/api/partner/getUserVouchersByStatus?status=${status}&page=${page}`);
}