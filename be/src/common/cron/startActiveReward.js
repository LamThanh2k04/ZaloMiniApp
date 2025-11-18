import cron from "node-cron";
import { adminService } from "../../services/adminService.js";

export const startActiveReward = () => {
   cron.schedule("*/15 * * * *", async () => {
    console.log("⏰ Bắt đầu cron check...");
    await adminService.updateActiveReward();
    console.log("✅ Cron check xong");
  });
}