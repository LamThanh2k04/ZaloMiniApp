import express from "express"
import { authMiddleware } from "../common/middlewares/authMiddleware.js"
import { validateAdmin } from "../common/middlewares/validateRole.js"
import { adminController } from "../controllers/adminController.js"
const router = express.Router()

router.get("/getAllUSerZalo",authMiddleware,validateAdmin,adminController.getAllUSerZalo)
router.get("/getAllPartner",authMiddleware,validateAdmin,adminController.getAllPartner)
router.put("/updateUserZaloActive/:userId",authMiddleware,validateAdmin,adminController.updateUserZaloActive)
router.put("/updatePartnerActive/:partnerId",authMiddleware,validateAdmin,adminController.updatePartnerActive)
router.get("/getAllPartnerRequest",authMiddleware,validateAdmin,adminController.getAllPartnerRequest)
router.get("/getAllStoreRequest",authMiddleware,validateAdmin,adminController.getAllStoreRequest)
router.post("/approvePartnerRequest/:requestId",authMiddleware,validateAdmin,adminController.approvePartnerRequest)
router.post("/rejectPartnerRequest/:requestId",authMiddleware,validateAdmin,adminController.rejectPartnerRequest)
router.post("/approveStoreRequest/:requestId",authMiddleware,validateAdmin,adminController.approveStoreRequest)
router.post("/rejectStoreRequest/:requestId",authMiddleware,validateAdmin,adminController.rejectStoreRequest)
router.post("/createPointCode",authMiddleware,validateAdmin,adminController.createPointCode)
router.put("/updatePointCode/:pointCodeId",authMiddleware,validateAdmin,adminController.updatePointCode)
router.get("/getAllpointCode",authMiddleware,validateAdmin,adminController.getAllpointCode)
router.get("/getAllUserUsedPointCode",authMiddleware,validateAdmin,adminController.getAllUserUsedPointCode)
router.post("/createMemberLevel",authMiddleware,validateAdmin,adminController.createMemberLevel)
router.put("/updateMemberLevel/:memberLevelId",authMiddleware,validateAdmin,adminController.updateMemberLevel)
router.get("/getAllMemberLevel",authMiddleware,validateAdmin,adminController.getAllMemberLevel)
router.post("/createRewardGlobal",authMiddleware,validateAdmin,adminController.createRewardGlobal)
router.put("/updateRewardGlobal/:rewardGlobalId",authMiddleware,validateAdmin,adminController.updateRewardGlobal)
router.get("/getAllRewardGlobal",authMiddleware,validateAdmin,adminController.getAllRewardGlobal)
router.get("/getTotal",authMiddleware,validateAdmin,adminController.getTotal)
router.get("/topUsersByPoints",authMiddleware,validateAdmin,adminController.topUsersByPoints)
router.get("/getMemberLevelDistribution",authMiddleware,validateAdmin,adminController.getMemberLevelDistribution)
router.get("/getPointLineChart",authMiddleware,validateAdmin,adminController.getPointLineChart)
router.get("/getAllStore",authMiddleware,validateAdmin,adminController.getAllStore)
export default router