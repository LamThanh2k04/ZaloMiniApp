import { https } from "../config"

export const getTotal = () => {
    return https.get("/api/admin/getTotal");
};
export const getTopUsersByPoints = () => {
    return https.get("/api/admin/topUsersByPoints");
};
export const getMemberLevelDistribution = () => {
    return https.get("/api/admin/getMemberLevelDistribution");
};
export const getPointLineChart = (startDate, endDate, storeId, range) => {
    const params = range
        ? { range, storeId }
        : { startDate, endDate, storeId };

    return https.get("/api/admin/getPointLineChart", { params });
};
export const getAllStore = () => {
    return https.get("/api/admin/getAllStore");
};