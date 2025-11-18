import cron from "node-cron";
import { userZaloService } from "../../services/userZaloService.js";
export const updateLevelUsers = () => {
    cron.schedule("*/15 * * * *", async () => {
        console.log("⏰ Bắt đầu cron check...");
        await userZaloService.updateAllUsersLevelsOptimized();
        console.log("✅ Cron check xong");
    });
}