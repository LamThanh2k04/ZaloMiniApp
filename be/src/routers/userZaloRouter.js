import express from "express"

import { authMiddleware } from "../common/middlewares/authMiddleware.js"
import { userZaloController } from "../controllers/userZaloController.js"
import { upload } from "../common/cloudinary/initCloudinary.js"
const router = express.Router()

router.get("/getInfoUserZalo", authMiddleware, userZaloController.getInfoUserZalo)
router.put("/updateUserZalo", authMiddleware, upload.single("avatar"), userZaloController.updateUserZalo)
router.post("/redeemCode", authMiddleware, userZaloController.redeemCode)
router.get("/getUserTransactionSummary", authMiddleware, userZaloController.getUserTransactionSummary)
router.get("/listRewardsByStoreId", userZaloController.listRewardsByStoreId)
router.get("/listRewardIsGlobal", userZaloController.listRewardIsGlobal)
router.post("/redeemReward/:rewardId", authMiddleware, userZaloController.redeemReward)
router.post("/registerPartnerRequest", authMiddleware, userZaloController.registerPartnerRequest)
router.get("/getAllRewardsUser", authMiddleware, userZaloController.getAllRewardsUser)
router.get("/getAllNotificationUser", authMiddleware, userZaloController.getAllNotificationUser)
router.get("/getInfoNotificationUser/:notificationId", authMiddleware, userZaloController.getInfoNotificationUser)
router.get("/getAllStore", userZaloController.getAllStore)
router.get("/getInfoRewardUser/:rewardId", authMiddleware, userZaloController.getInfoRewardUser);
export default router