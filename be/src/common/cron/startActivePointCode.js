import cron from "node-cron";
import { adminService } from "../../services/adminService.js";

export const startActivePointCode = () => {
   cron.schedule("*/15 * * * *", async () => {
    console.log("⏰ Bắt đầu cron check...");
    await adminService.updateActivePointCode();
    console.log("✅ Cron check xong");
  });
}