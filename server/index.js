import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./mongoDb/connectDb.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import adsRouter from "./routes/adsRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import superAdminRouter from "./routes/superAdminRoute.js";
import cron from "node-cron";
import { runRefundExpiredCoupons}  from "./utils/redeemCoupons.js";
import mongoose from "mongoose";


dotenv.config();
const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);
const app = express();  

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use(cors());
app.use('/api/v1/user',userRouter)
app.use("/userUploads", express.static(path.join(__dirname, "Uploads/userUploads")));
app.use("/userKyc", express.static(path.join(__dirname, "Uploads/userKyc")));
app.use("/imgAdUploads", express.static(path.join(__dirname, "Uploads/imageAdUploads")));

app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/ads',adsRouter)
app.use('/videoAdUploads', express.static(path.join(__dirname, 'Uploads/videoAdUploads')));

app.use('/api/v1/super-admin',superAdminRouter)

// to automatically fetch expired coupns
cron.schedule("0 0 * * *", async () => {
//   console.log(`[${new Date().toISOString()}] Running 5-minute expired coupon refund job...`);
  try {
    const result = await runRefundExpiredCoupons();
    // console.log("Cron refund result:", result);
  } catch (err) {
    console.error("Cron refund error:", err.message, err.stack);
  }
});

const PORT = process.env.PORT || 8000;

connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Mongodb connection error", err);
    });
