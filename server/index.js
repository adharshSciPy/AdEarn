import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
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
import notificationRouter from "./routes/notificationRoute.js";
import authMiddleware from "./auth/authMiddleware.js";
import kyc from "./model/kycModel.js";
import subscriptionRouter from "./routes/subscriptionRoute.js";
import couponBatchModel from "./model/couponBatchModel.js";


dotenv.config();
const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);
const app = express(); 
const server = createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "*", // Allow frontend origin here
    methods: ["GET", "POST"],
  },
});

const connectedUsers = new Map(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use(cors());
app.use("/userUploads", express.static(path.join(__dirname, "Uploads/userUploads")));
app.use("/userKyc", express.static(path.join(__dirname, "Uploads/userKyc")));
app.use("/imgAdUploads", express.static(path.join(__dirname, "Uploads/imageAdUploads")));
app.use('/videoAdUploads', express.static(path.join(__dirname, 'Uploads/videoAdUploads')));
app.use('/welcomeBonusUploads', express.static(path.join(__dirname, 'Uploads/welcomeBonusImages')));
app.use("/surveyAdUploads", express.static(path.join(__dirname, "Uploads/surveyAdImages")));
app.use("/contestPrizeImages", express.static(path.join(__dirname, "Uploads/contestPrizeImages")));





app.use('/api/v1/user', (req, res, next) => {
  req.io = io; req.connectedUsers = connectedUsers; next();
}, userRouter);

app.use('/api/v1/admin', (req, res, next) => {
  req.io = io; req.connectedUsers = connectedUsers; next();
}, adminRouter);

app.use('/api/v1/ads', adsRouter);
app.use('/api/v1/super-admin', (req, res, next) => {
  req.io = io; req.connectedUsers = connectedUsers; next();
}, superAdminRouter);
app.use('/api/v1/notifications', 
  (req, res, next) => {
    req.io = io; 
    req.connectedUsers = connectedUsers; 
    next();
  },
  authMiddleware,
  notificationRouter
);

app.use('/api/v1/subscription', (req, res, next) => {
  req.io = io; req.connectedUsers = connectedUsers; next();
}, subscriptionRouter);
// app.get("/api/test-protected", authMiddleware, (req, res) => {
//   res.json({ message: "You are authenticated", user: req.user });
// });

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log(" New client connected:", socket.id);

  socket.on("register", (userId) => {
    if (userId) {
      connectedUsers.set(userId, socket.id);
      console.log(`🟢 User ${userId} registered with socket ${socket.id}`);
      console.log("Connected users map:", connectedUsers);

    }
  });

  socket.on("disconnect", () => {
    for (const [userId, sockId] of connectedUsers.entries()) {
      if (sockId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`🔴 User ${userId} disconnected`);
        break;
      }
    }
  });
});

cron.schedule("0 0 * * *", async () => {
  console.log(`[${new Date().toISOString()}] 🕓 Running daily maintenance job...`);

 try {
    const { refundedCoupons, starsRefunded } = await runRefundExpiredCoupons();
    console.log(`✅ Refunded ${starsRefunded} stars for coupons:`, refundedCoupons);
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
cron.schedule("* * * * *", async () => {
  const timeoutThreshold = new Date(Date.now() - 5 * 60 * 1000); // 5 min ago

  try {
    const expiredAssignments = await kyc.updateMany(
      {
        kycStatus: "pending",
        assignedAdminId: { $ne: null },
        assignmentTime: { $lt: timeoutThreshold },
      },
      {
        $set: {
          assignedAdminId: null,
          assignmentTime: null,
        },
      }
    );

    if (expiredAssignments.modifiedCount > 0) {
      console.log(`🔄 Unassigned ${expiredAssignments.modifiedCount} stale KYC requests`);
    }
  } catch (error) {
    console.error("❌ Error in KYC cleanup cron:", error);
  }
});
cron.schedule("* * * * *", async () => {
  const timeoutThreshold = new Date(Date.now() - 5 * 60 * 1000);

  try {
    const models = [ImageAd, VideoAd, SurveyAd];

    for (const Model of models) {
      const result = await Model.updateMany(
        {
          isAdVerified: false,
          isAdRejected: false,
          assignedAdminId: { $ne: null },
          assignmentTime: { $lt: timeoutThreshold },
        },
        {
          $set: {
            assignedAdminId: null,
            assignmentTime: null,
          },
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`🔄 Unassigned ${result.modifiedCount} stale ${Model.modelName} ads`);
      }
    }
  } catch (error) {
    console.error("❌ Error in Ad cleanup cron:", error);
  }
});
cron.schedule("* * * * *", async () => {
  const timeoutThreshold = new Date(Date.now() - 5 * 60 * 1000); // 5 mins ago

  try {
    const result = await couponBatchModel.updateMany(
      {
        status: "pending", 
        assignedTo: { $ne: null },
        assignedAt: { $lt: timeoutThreshold },
      },
      {
        $set: {
          assignedTo: null,
          assignedAt: null,
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`🔄 Unassigned ${result.modifiedCount} stale pending CouponBatch(es)`);
    }
  } catch (error) {
    console.error("Error in CouponBatch cleanup cron:", error);
  }
});


const PORT = process.env.PORT || 8000;

connectDb()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Mongodb connection error", err);
    });
