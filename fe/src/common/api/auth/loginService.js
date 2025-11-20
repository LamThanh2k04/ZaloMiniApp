import { https } from "../config";
export const loginAdminService = (data) => {
    return https.post("/api/auth/loginAdmin", data);
};
export const loginPartnerService = (data) => {
    return https.post("/api/auth/loginPartner", data);
};
export const loginUserZaloService = (code) => {
    return https.post("/api/auth/loginZalo", { code });
};