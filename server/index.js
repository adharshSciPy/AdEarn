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
import { Ad } from "./model/AdsModel.js";
import { ImageAd } from "./model/imageadModel.js";
import { VideoAd } from "./model/videoadModel.js";
import { SurveyAd } from "./model/surveyadModel.js";


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

// // to automatically fetch expired coupns
// cron.schedule("0 0 * * *", async () => {
// //   console.log(`[${new Date().toISOString()}] Running 5-minute expired coupon refund job...`);
//   try {
//     const result = await runRefundExpiredCoupons();
//     // console.log("Cron refund result:", result);
//   } catch (err) {
//     console.error("Cron refund error:", err.message, err.stack);
//   }
// });
// // to clear ads from db after 3 days of expiry date is reached
// cron.schedule("30 2 * * *", async () => {
//   const threeDaysAfter = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); 
  
//   try {
//     const ads = await Ad.find().populate(["imgAdRef", "videoAdRef", "surveyAdRef"]);

//     for (const ad of ads) {
//       const { _id, imgAdRef, videoAdRef, surveyAdRef } = ad;
//       let shouldDelete = false;

//       // Check Image Ad
//       if (
//         imgAdRef?.adExpirationTime &&
//         new Date(imgAdRef.adExpirationTime).getTime() + 3 * 24 * 60 * 60 * 1000 <= threeDaysAfter.getTime()
//       ) {
//         await ImageAd.findByIdAndDelete(imgAdRef._id);
//         shouldDelete = true;
//       }

//       // Check Video Ad
//       if (
//         videoAdRef?.adExpirationTime &&
//         new Date(videoAdRef.adExpirationTime).getTime() + 3 * 24 * 60 * 60 * 1000 <= threeDaysAfter.getTime()
//       ) {
//         await VideoAd.findByIdAndDelete(videoAdRef._id);
//         shouldDelete = true;
//       }

//       // Check Survey Ad
//       if (
//         surveyAdRef?.adExpirationTime &&
//         new Date(surveyAdRef.adExpirationTime).getTime() + 3 * 24 * 60 * 60 * 1000 <= threeDaysAfter.getTime()
//       ) {
//         await SurveyAd.findByIdAndDelete(surveyAdRef._id);
//         shouldDelete = true;
//       }

//       if (shouldDelete) {
//         await Ad.findByIdAndDelete(_id); // Delete the parent ad if any child ad is deleted
//       }
//     }

//     console.log(`[${new Date().toISOString()}] ✅ Expired ads cleaned up`);
//   } catch (err) {
//     console.error(`[${new Date().toISOString()}] ❌ Error cleaning expired ads:`, err.message);
//   }
// });
// // to check daily whether the user is subscribed or not
// // Run daily
// cron.schedule("0 0 * * *", async () => {
//   const now = new Date();
//   await User.updateMany(
//     { isSubscribed: true, subscriptionEndDate: { $lt: now } },
//     { $set: { isSubscribed: false } }
//   );
//   console.log("Expired subscriptions updated");
// });
cron.schedule("0 0 * * *", async () => {
  console.log(`[${new Date().toISOString()}] 🕓 Running daily maintenance job...`);

  try {
    // 1. Run expired coupon refunds
    await runRefundExpiredCoupons();
    console.log("✅ Expired coupon refund completed");
  } catch (err) {
    console.error("❌ Coupon refund error:", err.message);
  }

  try {
    // 2. Clean expired ads
    const threeDaysAfter = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const ads = await Ad.find().populate(["imgAdRef", "videoAdRef", "surveyAdRef"]);

    for (const ad of ads) {
      const { _id, imgAdRef, videoAdRef, surveyAdRef } = ad;
      let shouldDelete = false;

      if (
        imgAdRef?.adExpirationTime &&
        new Date(imgAdRef.adExpirationTime).getTime() + 3 * 24 * 60 * 60 * 1000 <= threeDaysAfter.getTime()
      ) {
        await ImageAd.findByIdAndDelete(imgAdRef._id);
        shouldDelete = true;
      }

      if (
        videoAdRef?.adExpirationTime &&
        new Date(videoAdRef.adExpirationTime).getTime() + 3 * 24 * 60 * 60 * 1000 <= threeDaysAfter.getTime()
      ) {
        await VideoAd.findByIdAndDelete(videoAdRef._id);
        shouldDelete = true;
      }

      if (
        surveyAdRef?.adExpirationTime &&
        new Date(surveyAdRef.adExpirationTime).getTime() + 3 * 24 * 60 * 60 * 1000 <= threeDaysAfter.getTime()
      ) {
        await SurveyAd.findByIdAndDelete(surveyAdRef._id);
        shouldDelete = true;
      }

      if (shouldDelete) {
        await Ad.findByIdAndDelete(_id);
      }
    }

    console.log("✅ Expired ads cleaned up");
  } catch (err) {
    console.error("❌ Error cleaning expired ads:", err.message);
  }

  try {
    // 3. Update expired subscriptions
    const now = new Date();
    await User.updateMany(
      { isSubscribed: true, subscriptionEndDate: { $lt: now } },
      { $set: { isSubscribed: false } }
    );
    console.log("✅ Expired subscriptions updated");
  } catch (err) {
    console.error("❌ Subscription update error:", err.message);
  }

  console.log(`[${new Date().toISOString()}] ✅ Daily maintenance job complete`);
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
