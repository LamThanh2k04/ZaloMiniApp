import express from "express"
import { authController } from "../controllers/authController.js"
const router = express.Router()

router.post("/loginZalo", authController.loginZalo)
router.post("/loginPartner",authController.loginPartner)
router.post("/loginAdmin",authController.loginAdmin)
router.post("/createAdmin",authController.createAdmin)

export default router