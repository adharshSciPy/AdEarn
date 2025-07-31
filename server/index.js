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
import geocodeRouter from "./routes/geocodeRoute.js";
import broadcastRouter from "./routes/broadcastRoute.js";
import ContestEntry from "./model/contestEntrySchema.js";
import User from "./model/userModel.js";
import payoutRoute from "./routes/payoutRoute.js";
import { selectAutomaticWinnersInternal } from "./controller/superAdminController.js";


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
app.use('/Uploads/welcomeBonusImages', express.static(path.join(__dirname, 'Uploads/welcomeBonusImages')));
app.use("/surveyAdUploads", express.static(path.join(__dirname, "Uploads/surveyAdImages")));
app.use("/contestPrizeImages", express.static(path.join(__dirname, "Uploads/contestPrizeImages")));
app.use("/api/v1/geocode", geocodeRouter);




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

app.use('/api/v1/broadcast', (req, res, next) => {
  req.io = io; req.connectedUsers = connectedUsers; next();
}, broadcastRouter);


app.use('/api/v1/payout', (req, res, next) => {
  req.io = io; req.connectedUsers = connectedUsers; next();
}, payoutRoute);
// Socket.IO Connection
io.on("connection", (socket) => {
  // console.log(" New client connected:", socket.id);

  socket.on("register", (userId) => {
    if (userId) {
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
      console.log("Connected users map:", connectedUsers);

    }
  });

  socket.on("disconnect", () => {
    for (const [userId, sockId] of connectedUsers.entries()) {
      if (sockId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

cron.schedule("0 0 * * *", async () => {
  console.log(`[${new Date().toISOString()}] 🕓 Running daily maintenance job...`);

 try {
    const { refundedCoupons, starsRefunded } = await runRefundExpiredCoupons();
    console.log(`Refunded ${starsRefunded} stars for coupons:`, refundedCoupons);
  } catch (err) {
    console.error(" Coupon refund error:", err.message);
  }

 try {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const ads = await Ad.find().populate(["imgAdRef", "videoAdRef", "surveyAdRef"]);

    for (const ad of ads) {
      const { _id, imgAdRef, videoAdRef, surveyAdRef } = ad;
      let shouldDelete = false;

  
     const refundUnusedStars = async (adDoc, adType) => {
  if (
    adDoc?.isAdVerified &&
    adDoc?.isPaymentCompleted &&
    !adDoc?.isViewsReached &&
    adDoc?.adExpirationTime &&
    new Date(adDoc.adExpirationTime).getTime() <= now.getTime()
  ) {
    const {
      createdBy,
      userViewsNeeded,
      totalViewCount = 0,
      starPayoutPlan = [],
      viewersRewarded = [],
    } = adDoc;

    const totalStarsAllocated = starPayoutPlan.reduce((sum, val) => sum + val, 0);
    const starsAlreadyGiven = viewersRewarded.reduce((sum, view) => sum + (view.starsGiven || 0), 0);

    const unusedStars = totalStarsAllocated - starsAlreadyGiven;

    if (unusedStars > 0 && createdBy) {
      const user = await User.findById(createdBy).populate("userWalletDetails");

      if (user && user.userWalletDetails) {
        user.userWalletDetails.totalStars += unusedStars;
        user.userWalletDetails.refundedStars = user.userWalletDetails.refundedStars || [];

        user.userWalletDetails.refundedStars.push({
          adId: adDoc._id,
          adType,
          refundedStars: unusedStars,
          totalViews: userViewsNeeded,
          viewsReached: totalViewCount,
          refundedAt: now,
        });

        await user.userWalletDetails.save();
        console.log(`Refunded ${unusedStars} unused stars for ${adType} ad: ${adDoc._id}`);
      }
    }
  }
};


      // ✅ Image Ad
      if (
        imgAdRef?.adExpirationTime &&
        new Date(imgAdRef.adExpirationTime).getTime() + 3 * 24 * 60 * 60 * 1000 <= threeDaysFromNow.getTime()
      ) {
        await refundUnusedStars(imgAdRef, "Image");
        await ImageAd.findByIdAndDelete(imgAdRef._id);
        shouldDelete = true;
      }

      // ✅ Video Ad
      if (
        videoAdRef?.adExpirationTime &&
        new Date(videoAdRef.adExpirationTime).getTime() + 3 * 24 * 60 * 60 * 1000 <= threeDaysFromNow.getTime()
      ) {
        await refundUnusedStars(videoAdRef, "Video");
        await VideoAd.findByIdAndDelete(videoAdRef._id);
        shouldDelete = true;
      }

      // ✅ Survey Ad
      if (
        surveyAdRef?.adExpirationTime &&
        new Date(surveyAdRef.adExpirationTime).getTime() + 3 * 24 * 60 * 60 * 1000 <= threeDaysFromNow.getTime()
      ) {
        await refundUnusedStars(surveyAdRef, "Survey");
        await SurveyAd.findByIdAndDelete(surveyAdRef._id);
        shouldDelete = true;
      }

      if (shouldDelete) {
        await Ad.findByIdAndDelete(_id);
      }
    }

    console.log("Expired ads cleaned up and unused stars refunded");
  } catch (err) {
    console.error("Error cleaning expired ads:", err.message);
  }

  try {
    // 3. Update expired subscriptions
    const now = new Date();
    await User.updateMany(
      { isSubscribed: true, subscriptionEndDate: { $lt: now } },
      { $set: { isSubscribed: false } }
    );
    console.log("Expired subscriptions updated");
  } catch (err) {
    console.error("Subscription update error:", err.message);
  }

  console.log(`[${new Date().toISOString()}] Daily maintenance job complete`);
});
// cron.schedule("* * * * *", async () => {
//   const timeoutThreshold = new Date(Date.now() - 5 * 60 * 1000); // 5 min ago

//   try {
//     const expiredAssignments = await kyc.updateMany(
//       {
//         kycStatus: "pending",
//         assignedAdminId: { $ne: null },
//         assignmentTime: { $lt: timeoutThreshold },
//       },
//       {
//         $set: {
//           assignedAdminId: null,
//           assignmentTime: null,
//         },
//       }
//     );

//     if (expiredAssignments.modifiedCount > 0) {
//       console.log(`🔄 Unassigned ${expiredAssignments.modifiedCount} stale KYC requests`);
//     }
//   } catch (error) {
//     console.error("❌ Error in KYC cleanup cron:", error);
//   }
// });
// cron.schedule("* * * * *", async () => {
//   const timeoutThreshold = new Date(Date.now() - 5 * 60 * 1000);

//   try {
//     const models = [ImageAd, VideoAd, SurveyAd];

//     for (const Model of models) {
//       const result = await Model.updateMany(
//         {
//           isAdVerified: false,
//           isAdRejected: false,
//           assignedAdminId: { $ne: null },
//           assignmentTime: { $lt: timeoutThreshold },
//         },
//         {
//           $set: {
//             assignedAdminId: null,
//             assignmentTime: null,
//           },
//         }
//       );

//       if (result.modifiedCount > 0) {
//         console.log(`🔄 Unassigned ${result.modifiedCount} stale ${Model.modelName} ads`);
//       }
//     }
//   } catch (error) {
//     console.error("❌ Error in Ad cleanup cron:", error);
//   }
// });
// cron.schedule("* * * * *", async () => {
//   const timeoutThreshold = new Date(Date.now() - 5 * 60 * 1000); // 5 mins ago

//   try {
//     const result = await couponBatchModel.updateMany(
//       {
//         status: "pending", 
//         assignedTo: { $ne: null },
//         assignedAt: { $lt: timeoutThreshold },
//       },
//       {
//         $set: {
//           assignedTo: null,
//           assignedAt: null,
//         },
//       }
//     );

//     if (result.modifiedCount > 0) {
//       console.log(`🔄 Unassigned ${result.modifiedCount} stale pending CouponBatch(es)`);
//     }
//   } catch (error) {
//     console.error("Error in CouponBatch cleanup cron:", error);
//   }
// });

cron.schedule("* * * * *", async () => {
  const timeoutThreshold = new Date(Date.now() - 5 * 60 * 1000); // 5 mins ago

  try {
    const kycResult = await kyc.updateMany(
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
    if (kycResult.modifiedCount > 0) {
      console.log(`Unassigned ${kycResult.modifiedCount} stale KYC requests`);
    }
    const adModels = [ImageAd, VideoAd, SurveyAd];
    for (const Model of adModels) {
      const adResult = await Model.updateMany(
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

      if (adResult.modifiedCount > 0) {
        console.log(`Unassigned ${adResult.modifiedCount} stale ${Model.modelName} ads`);
      }
    }
    const couponResult = await couponBatchModel.updateMany(
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
    if (couponResult.modifiedCount > 0) {
      console.log(`Unassigned ${couponResult.modifiedCount} stale pending CouponBatch(es)`);
    }

  } catch (error) {
    console.error("Error in combined cleanup cron:", error);
  }
});

// cron.schedule("* * * * *", async () => {
//   const now = new Date();

//   try {
//     const updated = await ContestEntry.updateMany(
//       {
//         status: "Scheduled",
//         startDate: { $lte: now },
//       },
//       {
//         $set: { status: "Active" },
//       }
//     );

//     if (updated.modifiedCount > 0) {
//       console.log(`✅ Activated ${updated.modifiedCount} scheduled contest(s)`);
//     }
//   } catch (err) {
//     console.error("❌ Error auto-activating contests:", err.message);
//   }
// });
// index.js


cron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log(`[${now.toISOString()}] 🔁 Running 2-minute contest scheduler...`);

  // ✅ Start scheduled contests
  try {
    console.log("⏳ Checking for scheduled contests to activate...");
    const result = await ContestEntry.updateMany(
      {
        status: "Scheduled",
        startDate: { $lte: now },
      },
      { $set: { status: "Active" } }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Activated ${result.modifiedCount} scheduled contest(s)`);
    } else {
      console.log("ℹ️ No scheduled contests to activate at this time.");
    }
  } catch (err) {
    console.error("❌ Error activating scheduled contests:", err.message);
  }

  // ✅ End expired dateRange contests
  try {
    console.log("⏳ Checking for active dateRange contests to end...");
    const contestsToEnd = await ContestEntry.find({
      status: "Active",
      contestType: "dateRange",
      endDate: { $lte: now },
      winnerSelectionType: "Automatic",
    });

    if (contestsToEnd.length === 0) {
      console.log("ℹ️ No expired dateRange contests found.");
    }

    for (const contest of contestsToEnd) {
      console.log(`🏁 Ending contest: ${contest.contestName || contest._id}`);
      await selectAutomaticWinnersInternal(contest._id, io, connectedUsers);
      console.log(`✅ Winners selected for contest: ${contest.contestName || contest._id}`);
    }
  } catch (err) {
    console.error("❌ Error ending expired contests:", err.message);
  }

  console.log(`[${new Date().toISOString()}] ✅ Scheduler cycle complete.\n`);
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
