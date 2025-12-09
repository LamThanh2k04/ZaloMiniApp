import { https } from "./config";

export const loginUserZalo = (token) => {
    // Key ở đây phải là 'accessToken' để khớp với: const { accessToken } = data ở Backend
    console.log("Token: ", token);
    return https.post("/api/auth/loginZalo", { accessToken: token });
};