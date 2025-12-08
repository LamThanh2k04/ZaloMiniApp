import { getAuthCode } from "zmp-sdk";
import { https } from "./config";

export const loginUserZalo = async () => {
    const { code } = await getAuthCode();
    console.log("Zalo login code ===>", code);
    return https.post("/api/auth/loginZalo", { code });
};
