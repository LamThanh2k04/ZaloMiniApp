import express from "express"
import { authMiddleware } from "../common/middlewares/authMiddleware.js"
import { validatePartner } from "../common/middlewares/validateRole.js"
import { upload } from "../common/cloudinary/initCloudinary.js"
import { partnerController } from "../controllers/partnerController.js"
const router = express.Router()

router.post("/createStore",upload.single("logo"),authMiddleware,validatePartner,partnerController.createStore)
router.put("/updateStore/:storeId",upload.single("logo"),authMiddleware,validatePartner,partnerController.updateStore)
router.get("/getAllStoresPartner",authMiddleware,validatePartner,partnerController.getAllStoresPartner)
router.get("/getAllStoresPartnerName",authMiddleware,validatePartner,partnerController.getAllStoresPartnerName)
router.post("/createRewardStore",authMiddleware,validatePartner,partnerController.createRewardStore)
router.put("/updateRewardStore/:rewardStoreId",authMiddleware,validatePartner,partnerController.updateRewardStore)
router.get("/getRewardsStore",authMiddleware,validatePartner,partnerController.getRewardsStore)
router.get("/getUserVouchersByStatus",authMiddleware,validatePartner,partnerController.getUserVouchersByStatus)
router.get("/getTotal",authMiddleware,validatePartner,partnerController.getTotal)
router.get("/getTopUserPointStore",authMiddleware,validatePartner,partnerController.getTopUserPointStore)
router.get("/getPointRevenueTimeline",authMiddleware,validatePartner,partnerController.getPointRevenueTimeline)
export default router