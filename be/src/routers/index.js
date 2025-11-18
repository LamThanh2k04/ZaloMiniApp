import express from "express"
import authRouter from "../routers/authRouter.js"
import userZaloRouter from "../routers/userZaloRouter.js"
import partnerRouter from  "../routers/partnerRouter.js"
import adminRouter from "../routers/adminRouter.js"
const router = express.Router()

router.use("/api/auth",authRouter)
router.use("/api/userZalo",userZaloRouter)
router.use("/api/partner",partnerRouter)
router.use("/api/admin",adminRouter)

export default router