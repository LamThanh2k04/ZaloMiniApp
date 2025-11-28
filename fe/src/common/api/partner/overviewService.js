import { https } from "../config"

export const getTotal = () => {
    return https.get("/api/partner/getTotal");
};
export const getTopUserPointStore = (storeId) => {
    const params = storeId ? { storeId } : {};
    return https.get("/api/partner/getTopUserPointStore", { params });
};
export const getPointRevenueTimeline = (startDate, endDate, storeId, range) => {
    const params = range
        ? { range, storeId }
        : { startDate, endDate, storeId };
    return https.get("/api/partner/getPointRevenueTimeline", { params });
};