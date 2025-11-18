import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { errorHandler } from "./src/common/middlewares/errorHandler.js"
import router from "./src/routers/index.js"
import { updateLevelUsers } from "./src/common/cron/updateLevelUsers.js"
import { startActivePointCode } from "./src/common/cron/startActivePointCode.js"
import { startActiveReward } from "./src/common/cron/startActiveReward.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080;
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
console.log(process.env.DATABASE_URL)
app.get("/",(req,res) => {
    res.send("oke")
})
updateLevelUsers()
startActivePointCode()
startActiveReward()
app.use(router)
app.use(errorHandler)
app.listen(PORT,()=>{
     console.log(`Máy chủ đang chạy tại: http://localhost:${PORT}`);
})

