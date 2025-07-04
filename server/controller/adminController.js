import { Admin } from "../model/adminModel.js";
import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import { passwordValidator } from "../utils/passwordValidator.js";
import kyc from "../model/kycModel.js";
import { Ad } from "../model/AdsModel.js";
import { ImageAd } from "../model/imageadModel.js";
import { VideoAd } from "../model/videoadModel.js";
import { SurveyAd } from "../model/surveyadModel.js";
import AdminWallet from "../model/adminwalletModel.js";
import Notification from "../model/notificationsModel.js";
import { sendNotification } from "../utils/sendNotifications.js";
import { UserWallet } from "../model/userWallet.js";
import couponRequestModel from "../model/couponRequestModel.js";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import redis from "../redisClient.js";
import config from "../config.js";
import couponBatchModel from "../model/couponBatchModel.js";

const USER_ROLE = process.env.USER_ROLE;
const ADMIN_ROLE = process.env.ADMIN_ROLE;
const SUPER_ADMIN_ROLE = process.env.SUPER_ADMIN_ROLE;
sgMail.setApiKey(config.SEND_GRID_API_KEY);

const registerAdmin = async (req, res) => {
  const { phoneNumber, password, username, address, adminEmail } = req.body;

  try {
    // Validate required fields
    if (!phoneNumber || !password || !username || !address || !adminEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Optional: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!passwordValidator(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const existingAdmin = await Admin.findOne({ phoneNumber });
    if (existingAdmin) {
      return res.status(409).json({ message: "Phone number already in use" });
    }

    const role = Number(process.env.ADMIN_ROLE) || 400;

    const admin = await Admin.create({
      phoneNumber,
      password,
      username,
      address,
      adminEmail,
      role,
    });

    const createdAdmin = await Admin.findById(admin._id).select("-password");
    if (!createdAdmin) {
      return res.status(500).json({ message: "Admin registration failed" });
    }

    res.status(201).json({
      message: "Admin registered successfully",
      data: createdAdmin,
    });
  } catch (error) {
    console.error("Admin Registration Error:", error);
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};

// const updateAdmin = async (req, res) => {
//   const { id } = req.params;
//   const { adminEmail, password, username, address } = req.body;

//   try {
//     const admin = await Admin.findById(id);
//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     // Update fields if provided
//     if (adminEmail) {
//       admin.adminEmail = adminEmail;
//     }

//     if (username) {
//       admin.username = username;
//     }

//     if (address) {
//       admin.address = address;
//     }

//     if (password) {
//       if (!passwordValidator(password)) {
//         return res.status(400).json({
//           message:
//             "Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character.",
//         });
//       }
//       admin.password = password;
//     }

//     await admin.save();

//     // Return updated admin without password
//     const updatedAdmin = await Admin.findById(id).select("-password");

//     res.status(200).json({
//       message: "Admin updated successfully",
//       data: updatedAdmin,
//     });
//   } catch (error) {
//     console.error("Admin update error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const adminLogin = async (req, res) => {
  const { adminEmail, password } = req.body;

  try {
    const admin = await Admin.findOne({ adminEmail });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await admin.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!admin.isAdminEnabled) {
      return res
        .status(400)
        .json({ message: " Your Login has been blocked by Admin" });
    }
    const token = jwt.sign(
      { id: admin._id, role: admin.adminRole },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role: admin.adminRole,
      adminId: admin._id,
      adminEmail: admin.adminEmail,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//to fetch all users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();

    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      users: allUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getSingleUser = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ message: "No user found,Please check the Id" });
    }
    return res
      .status(200)
      .json({ message: "User fetched Succesfully", data: user });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// to fetch users who have requested for Kyc verification
const fetchKycUploadedUsers = async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const pendingKycs = await kyc.find({
      kycStatus: "pending",
      $or: [
        { assignedAdminId: null },
        { assignmentTime: { $lte: fiveMinutesAgo } }
      ]
    }).populate("userId");

    if (!pendingKycs.length) {
      return res.status(404).json({ message: "No pending KYC verification requests" });
    }

    return res.status(200).json({
      message: "Fetched unassigned or expired pending KYCs",
      totalPendingUsers: pendingKycs.length,
      data: pendingKycs,
    });
  } catch (error) {
    console.error("Error in fetchKycUploadedUsers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




// to view each induvidual for kyc verification
const fetchSingleKycUploadUser = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found. Please check the ID." });
    }

    if (!user.kycDetails) {
      return res.status(400).json({ message: "User has not submitted KYC details." });
    }

    const kycDetails = await kyc.findById(user.kycDetails);
    if (!kycDetails) {
      return res.status(404).json({ message: "KYC details not found." });
    }

    return res.status(200).json({ message: "User fetched successfully", data: kycDetails });
  } catch (error) {
    console.error("Error fetching user KYC details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// kyc verification
const verifyKyc = async (req, res) => {
  const { id } = req.body;//this id is userId vishvannaa(id:userId)
  const adminId=req.params.id
  const { io, connectedUsers } = req;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ message: "No user found. Please check the ID." });
    }

    if (!user.kycDetails) {
      return res
        .status(400)
        .json({ message: "User has not submitted KYC details." });
    }

    const existingKyc = await kyc.findById(user.kycDetails);
    if (!existingKyc) {
      return res.status(404).json({ message: "KYC document not found." });
    }

    if (existingKyc.kycStatus === "approved") {
      return res.status(400).json({ message: "User KYC is already approved." });
    }

   existingKyc.kycStatus = "approved";
    existingKyc.assignedAdminId = adminId;
    existingKyc.assignmentTime = new Date(); 
      const updatedKyc = await existingKyc.save();

    if (adminId) {
      await Admin.findByIdAndUpdate(
        adminId,
        {
          $push: {
            kycsVerified: {
              kycId: updatedKyc._id,
              verifiedAt: new Date(),
              userId: id,
              status: "approved",
            },
          },
        },
        { new: true }
      );
    }

    // ✅ Send DB + real-time notification
    const message = "Your KYC has been approved!";
    await sendNotification(user._id, USER_ROLE, message, io, connectedUsers);

    return res.status(200).json({
      message: "KYC approved successfully.",
      kyc: updatedKyc,
    });
  } catch (error) {
    console.error("Error verifying KYC:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// kyc rejection
const rejectKyc = async (req, res) => {
  const { id, rejectionReason} = req.body;
  const adminId=req.params.id;
  const { io, connectedUsers } = req;

  if (!rejectionReason || rejectionReason.trim() === "") {
    return res.status(400).json({ message: "Rejection reason is required." });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ message: "No user found. Please check the ID." });
    }

    if (!user.kycDetails) {
      return res
        .status(400)
        .json({ message: "User has not submitted KYC details." });
    }

    const existingKyc = await kyc.findById(user.kycDetails);
    if (!existingKyc) {
      return res.status(404).json({ message: "KYC document not found." });
    }

    if (existingKyc.kycStatus === "rejected") {
      return res.status(400).json({ message: "User KYC is already rejected." });
    }

   existingKyc.kycStatus = "rejected";
    existingKyc.rejectionReason = rejectionReason.trim();
    existingKyc.assignedAdminId = adminId;
    existingKyc.assignmentTime = new Date();
    const updatedKyc = await existingKyc.save();

    if (adminId) {
      await Admin.findByIdAndUpdate(
        adminId,
        {
          $push: {
            kycsVerified: {
              kycId: updatedKyc._id,
              verifiedAt: new Date(),
              userId: id,
              status: "rejected",

            },
          },
        },
        { new: true }
      );
    }

    const message = `Your KYC has been rejected. Reason: ${rejectionReason}`;
    await sendNotification(user._id, USER_ROLE, message, io, connectedUsers);

    return res.status(200).json({
      message: "KYC rejected successfully.",
      rejectionReason,
      kyc: updatedKyc,
    });
  } catch (error) {
    console.error("Error rejecting KYC:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// to fetch users with kyc verified
const kycVerifiedUsers = async (req, res) => {
  try {
    const fetchKycVerifiedUsers = await User.find({
      kycDetails: { $exists: true, $ne: null },
    }).populate("kycDetails");

    const verifiedUsers = fetchKycVerifiedUsers.filter(
      (user) => user.kycDetails?.kycStatus === "approved"
    );

    if (verifiedUsers.length === 0) {
      return res.status(404).json({
        message: "No users with verified KYC found.",
        users: [],
      });
    }

    return res.status(200).json({
      message: "KYC verified users fetched successfully",
      users: verifiedUsers,
    });
  } catch (error) {
    console.error("Error fetching KYC verified users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// to verify ads
const verifyAdById = async (req, res) => {
  const { adId} = req.body;
  const adminId=req.params.id;
  const { io, connectedUsers } = req;

  if (!adId) {
    return res.status(400).json({ message: "adId is required" });
  }

  try {
    const ad = await Ad.findById(adId)
      .populate("imgAdRef")
      .populate("videoAdRef")
      .populate("surveyAdRef");

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    let updatedAd = null;
    let createdBy = null;
    let adType = "";
    let adTitle = "";
    let adPostedTime = "";

    const verifiedTime = new Date();

    const calculateExpirationDate = (views) => {
      let expirationDate = new Date(verifiedTime);
      if (views >= 100 && views <= 900) {
        expirationDate.setMonth(expirationDate.getMonth() + 3);
      } else if (views >= 1000 && views <= 9000) {
        expirationDate.setMonth(expirationDate.getMonth() + 6);
      } else if (views >= 10000) {
        expirationDate.setMonth(expirationDate.getMonth() + 9);
      }
      return expirationDate;
    };

    if (ad.imgAdRef && !ad.imgAdRef.isAdVerified) {
      const views = ad.imgAdRef.userViewsNeeded;
      const expirationDate = calculateExpirationDate(views);

      updatedAd = await ImageAd.findByIdAndUpdate(
        ad.imgAdRef._id,
        {
          isAdVerified: true,
          adVerifiedTime: verifiedTime,
          adExpirationTime: expirationDate,
        },
        { new: true }
      );

      createdBy = ad.imgAdRef.createdBy;
      adType = "Image Ad";
      adTitle = ad.imgAdRef.title;
      adPostedTime = ad.imgAdRef.createdAt;
    } else if (ad.videoAdRef && !ad.videoAdRef.isAdVerified) {
      const views = ad.videoAdRef.userViewsNeeded;
      const expirationDate = calculateExpirationDate(views);

      updatedAd = await VideoAd.findByIdAndUpdate(
        ad.videoAdRef._id,
        {
          isAdVerified: true,
          adVerifiedTime: verifiedTime,
          adExpirationTime: expirationDate,
        },
        { new: true }
      );

      createdBy = ad.videoAdRef.createdBy;
      adType = "Video Ad";
      adTitle = ad.videoAdRef.title;
      adPostedTime = ad.videoAdRef.createdAt;
    } else if (ad.surveyAdRef && !ad.surveyAdRef.isAdVerified) {
      const views = ad.surveyAdRef.userViewsNeeded;
      const expirationDate = calculateExpirationDate(views);

      updatedAd = await SurveyAd.findByIdAndUpdate(
        ad.surveyAdRef._id,
        {
          isAdVerified: true,
          adVerifiedTime: verifiedTime,
          adExpirationTime: expirationDate,
        },
        { new: true }
      );

      createdBy = ad.surveyAdRef.createdBy;
      adType = "Survey Ad";
      adTitle = ad.surveyAdRef.title;
      adPostedTime = ad.surveyAdRef.createdAt;
    } else {
      return res.status(200).json({ message: "Ad is already verified" });
    }
    if (adminId) {
      await Admin.findByIdAndUpdate(adminId, {
        $push: {
          verifiedAds: {
            adId: ad._id,
            verifiedAt: verifiedTime,
            userId: createdBy,
            status: "verified",
          },
        },
      });
    }
    // 🔔 Send notification to creator
    if (createdBy) {
      const formattedTime = new Date(adPostedTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });
      const link = `/adspreview/${createdBy}/${ad._id}`;
      const message = `Your ${adType} titled "${adTitle}" posted on ${formattedTime} has been verified successfully!`;
      await sendNotification(
        createdBy,
        USER_ROLE,
        message,
        io,
        connectedUsers,
        link
      );
    }

    return res.status(200).json({
      message: "Ad verified successfully",
      updatedAd,
    });
  } catch (error) {
    console.error("Error verifying ad:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAdminWallet = async (req, res) => {
  try {
    const wallet = await AdminWallet.findOne().populate(
      "transactions.userId",
      "email"
    );

    if (!wallet) {
      return res.status(404).json({ message: "Admin wallet not found" });
    }

    return res.status(200).json({
      message: "Admin wallet fetched successfully",
      totalStars: wallet.totalStars,
      transactions: wallet.transactions,
    });
  } catch (error) {
    console.error("Error fetching admin wallet:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getSuperAdminWallet = async (req, res) => {
  try {
    const wallet = await AdminWallet.findOne().populate(
      "transactions.userId",
      "email"
    );

    if (!wallet) {
      return res.status(404).json({ message: "Admin wallet not found" });
    }

    return res.status(200).json({
      message: "Admin wallet fetched successfully",
      totalStars: wallet.totalStars,
      transactions: wallet.transactions,
    });
  } catch (error) {
    console.error("Error fetching admin wallet:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const rejectAdById = async (req, res) => {
  const { adId, reason } = req.body;
  const adminId=req.params.id;
  const { io, connectedUsers } = req;

  if (!adId) {
    return res.status(400).json({ message: "adId is required" });
  }

  try {
    const ad = await Ad.findById(adId).populate({
      path: "imgAdRef videoAdRef surveyAdRef",
      populate: {
        path: "createdBy",
        populate: {
          path: "userWalletDetails",
        },
      },
    });

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    let updatedAd = null;
    let adDoc = null;
    let adType = "";
    let adTitle = "";
    let adPostedTime = "";
    let createdBy = null;
    let totalStarsAllocated = 0;
    const rejectionReason = reason || "Rejected by admin";
    const rejectedTime = new Date();

    // ✅ Image Ad
    if (ad.imgAdRef && !ad.imgAdRef.isAdVerified) {
      updatedAd = await ImageAd.findByIdAndUpdate(
        ad.imgAdRef._id,
        {
          isAdVerified: false,
          isAdVisible: false,
          isAdRejected: true,
          adRejectionReason: rejectionReason,
          adRejectedTime: rejectedTime,
        },
        { new: true }
      );
      adDoc = ad.imgAdRef;
      adType = "Image Ad";
    }

    // ✅ Video Ad
    else if (ad.videoAdRef && !ad.videoAdRef.isAdVerified) {
      updatedAd = await VideoAd.findByIdAndUpdate(
        ad.videoAdRef._id,
        {
          isAdVerified: false,
          isAdVisible: false,
          isAdRejected: true,
          adRejectionReason: rejectionReason,
          adRejectedTime: rejectedTime,
        },
        { new: true }
      );
      adDoc = ad.videoAdRef;
      adType = "Video Ad";
    }

    // ✅ Survey Ad
    else if (ad.surveyAdRef && !ad.surveyAdRef.isAdVerified) {
      updatedAd = await SurveyAd.findByIdAndUpdate(
        ad.surveyAdRef._id,
        {
          isAdVerified: false,
          isAdVisible: false,
          isAdRejected: true,
          adRejectionReason: rejectionReason,
          adRejectedTime: rejectedTime,
        },
        { new: true }
      );
      adDoc = ad.surveyAdRef;
      adType = "Survey Ad";
    }

    if (!updatedAd || !adDoc) {
      return res
        .status(400)
        .json({ message: "Ad is already verified or invalid ad type" });
    }

    createdBy = adDoc.createdBy;
    adTitle = adDoc.title;
    adPostedTime = adDoc.createdAt;
    totalStarsAllocated = adDoc.totalStarsAllocated;

    // ✅ Refund stars to user wallet (fallback safe)
    const walletId =
      createdBy?.userWalletDetails?._id || createdBy?.userWalletDetails;

    if (walletId && totalStarsAllocated > 0) {
      const updatedWallet = await UserWallet.findByIdAndUpdate(
        walletId,
        { $inc: { totalStars: totalStarsAllocated } },
        { new: true }
      );

      console.log(
        `✅ Refunded ${totalStarsAllocated} stars to wallet ${walletId}. New balance: ${updatedWallet?.totalStars}`
      );
    } else {
      console.warn("⚠️ Wallet not found or zero refund stars");
    }

    // ✅ Log to Admin's verifiedAds with status "rejected"
    if (adminId) {
      await Admin.findByIdAndUpdate(adminId, {
        $push: {
          verifiedAds: {
            adId: ad._id,
            verifiedAt: rejectedTime,
            userId: createdBy?._id || createdBy,
            status: "rejected",
          },
        },
      });
    }

    // ✅ Notification with refund info
    if (createdBy) {
      const formattedTime = new Date(adPostedTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      const message = `Your ${adType} titled "${adTitle}" posted on ${formattedTime} has been rejected. Reason: ${rejectionReason}. Refunded ${totalStarsAllocated} stars to your wallet.`;
      await sendNotification(
        createdBy._id,
        USER_ROLE,
        message,
        io,
        connectedUsers
      );
    }

    return res.status(200).json({
      message: `Ad rejected successfully (${adType}), stars refunded`,
      updatedAd,
      refundedStars: totalStarsAllocated,
    });
  } catch (error) {
    console.error("Error rejecting ad:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// kyc user details
const fetchUserKycStatus = async (req, res) => {
  try {
    const users = await User.find().populate("kycDetails");

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    const filteredUsers = users
      .filter(user => user.kycDetails) // only include users with KYC
      .map(user => ({
        userId: user._id,
        fullName: user.kycDetails.fullName || "N/A",
        kycStatus: user.kycDetails.kycStatus || "not submitted",
        requestedAt: user.kycDetails.createdAt || null
      }));

    return res.status(200).json({
      message: "Filtered KYC user details fetched successfully",
      users: filteredUsers,
    });

  } catch (error) {
    console.error("Error fetching user KYC status:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// to register admin using email otp(sendGrid &redis cloud)
const sendOtpToAdmin = async (req, res) => {
  const { adminEmail } = req.body;

  if (!adminEmail) return res.status(400).json({ message: "Email is required" });

  const existingAdmin = await Admin.findOne({ adminEmail });
  if (existingAdmin) {
    return res.status(409).json({ message: "Email already in use" });
  }


  const otp =
    config.USE_OTP_TEST_MODE === true &&
      adminEmail === config.OTP_TEST_EMAIL // <- Add this to config
      ? config.OTP_TEST_VALUE
      : crypto.randomInt(100000, 999999).toString();


  try {
    await redis.set(`admin_otp:${adminEmail}`, otp, "EX", 300);
    console.log(`✅ OTP for ${adminEmail}: ${otp}`);
  } catch (err) {
    return res.status(500).json({ message: "Redis error", error: err.message });
  }

  if (!config.USE_OTP_TEST_MODE) {
    try {
      await sgMail.send({
        to: adminEmail,
        from: config.SENDGRID_SENDER_EMAIL,
        subject: "Your Admin OTP Code",
        text: `Your OTP is ${otp}`,
        html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
      });
    } catch (err) {
      return res.status(500).json({ message: "SendGrid error", error: err.message });
    }
  }

  return res.status(200).json({
    message: "OTP sent to admin email",
    adminEmail,
    ...(config.USE_OTP_TEST_MODE ? { otp } : {}),
  });
};
// to verify otp and store the admin in db
const verifyOtpAndRegisterAdmin = async (req, res) => {
  const { adminEmail, otp } = req.body;

  if (!adminEmail || !otp) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const storedOtp = await redis.get(`admin_otp:${adminEmail}`);
  if (!storedOtp) return res.status(400).json({ message: "OTP expired or not found" });
  if (storedOtp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  await redis.del(`admin_otp:${adminEmail}`);



  const existingAdmin = await Admin.findOne({ adminEmail });
  if (existingAdmin) return res.status(409).json({ message: "Email already in use" });

  try {
    const role = Number(ADMIN_ROLE) || 400;
    const admin = await Admin.create({ adminEmail, role });
    // const createdAdmin = await Admin.findById(admin._id).select("-password");

    return res.status(201).json({
      message: "Admin registered successfully",
      data: admin,
    });
  } catch (err) {
    console.error("Admin Registration Error:", err);
    return res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
};


// pasword reset apis
const sendAdminForgotPasswordOtp = async (req, res) => {
  const { adminEmail } = req.body;

  if (!adminEmail) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  try {

    await redis.set(`forgot_otp:${adminEmail.toLowerCase()}`, otp, 'EX', 300);// expires in 5 min
    console.log(`✅ OTP for ${adminEmail}: ${otp}`);


    const msg = {
      to: adminEmail,
      from: config.SENDGRID_SENDER_EMAIL,
      subject: 'Your Admin OTP Code',
      text: `Your OTP is: ${otp}`,
      html: `<strong>Your OTP is: ${otp}</strong>`,
    };

    await sgMail.send(msg);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};
const verifyAdminForgotPasswordOtp = async (req, res) => {
  const { adminEmail, otp } = req.body;

  if (!adminEmail || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }
  const emailKey = adminEmail.toLowerCase();
  const storedOtp = await redis.get(`forgot_otp:${emailKey}`);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  await redis.del(`forgot_otp:${emailKey}`);
  await redis.set(`reset_session:${emailKey}`, true, "EX", 600); // valid for 10 minutes

  return res.status(200).json({ message: "OTP verified. You may now reset your password." });
};
const resetAdminPassword = async (req, res) => {
  const { adminEmail, newPassword } = req.body;

  if (!adminEmail || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required" });
  }

  const emailKey = adminEmail.toLowerCase();
  const sessionValid = await redis.get(`reset_session:${emailKey}`);
  if (!sessionValid) {
    return res.status(403).json({ message: "Session expired or OTP not verified" });
  }


  try {
    const admin = await Admin.findOne({ adminEmail });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.password = newPassword; // hashed via pre-save
    await admin.save();
    await redis.del(`reset_session:${adminEmail}`);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Password Reset Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const getallAdmins = await Admin.find();
    res.status(200).json({ message: "Fetched All Admins", data: getallAdmins })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

const deleteAdmins = async (req, res) => {
  try {
    const id = req.params.id
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Admin", data: deletedAdmin })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}


// const getAssignedCoupon


// to assign kyc into respectiveadmins dash for verification with 5min timeout
const assignKycToAdmin = async (req, res) => {
  const { kycId } = req.body;
  const adminId = req.params.id; 

  try {
    const kycDoc = await kyc.findById(kycId);

    if (!kycDoc || kycDoc.kycStatus !== "pending") {
      return res.status(400).json({ message: "Invalid or already processed KYC" });
    }

    console.log("Before Assignment:", kycDoc.assignedAdminId);
    console.log("Admin to assign:", adminId);

    // If already assigned and within 5 mins, block re-assignment
    if (
      kycDoc.assignedAdminId &&
      new Date() - new Date(kycDoc.assignmentTime) < 5 * 60 * 1000
    ) {
      return res.status(409).json({ message: "KYC is already assigned" });
    }

    // Assign the KYC to the admin
    kycDoc.assignedAdminId = adminId;
    kycDoc.assignmentTime = new Date();
    await kycDoc.save();

    console.log("Assigned Admin (after save):", kycDoc.assignedAdminId);

    return res.status(200).json({ message: "KYC assigned to admin", kycDoc });

  } catch (error) {
    console.error("Error in assignKycToAdmin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// to assign ads into respectiveadmins dash for verification with 5min timeout
const assignAdToAdmin = async (req, res) => {
  const { adId } = req.body; 
  const adminId = req.params.id;

  try {
    const adDoc = await Ad.findById(adId)
      .populate("imgAdRef")
      .populate("videoAdRef")
      .populate("surveyAdRef");

    if (!adDoc) {
      return res.status(404).json({ message: "Ad not found" });
    }

    
    const adTypeRef =
      adDoc.imgAdRef || adDoc.videoAdRef || adDoc.surveyAdRef;

    if (!adTypeRef) {
      return res.status(400).json({ message: "No associated ad found in this wrapper" });
    }

    
    if (adTypeRef.isAdVerified || adTypeRef.isAdRejected) {
      return res.status(400).json({ message: "Ad is already processed" });
    }

    // Prevent reassigning if still within the 5 minute lock window
    if (
      adTypeRef.assignedAdminId &&
      new Date() - new Date(adTypeRef.assignmentTime) < 5 * 60 * 1000
    ) {
      return res.status(409).json({ message: "Ad is already assigned" });
    }

    // Assign the ad
    adTypeRef.assignedAdminId = adminId;
    adTypeRef.assignmentTime = new Date();
    await adTypeRef.save();

    return res.status(200).json({
      message: "Ad assigned to admin",
      ad: adTypeRef,
    });

  } catch (err) {
    console.error("Error assigning ad:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const fetchKycsAssignedToAdmin = async (req, res) => {
  const adminId = req.params.id;

  try {
    const assignedKycs = await kyc.find({
      assignedAdminId: adminId,
      kycStatus: "pending",
      assignmentTime: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, 
    }).populate("userId");

    if (!assignedKycs.length) {
      return res.status(404).json({ message: "No KYCs assigned to this admin" });
    }

    return res.status(200).json({
      message: "Fetched KYCs assigned to admin",
      data: assignedKycs,
    });
  } catch (error) {
    console.error("Error fetching assigned KYCs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const fetchAdsAssignedToAdmin = async (req, res) => {
  const adminId = req.params.id;
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  try {
    const ads = await Ad.find()
      .populate({
        path: "imgAdRef",
        match: {
          assignedAdminId: adminId,
          assignmentTime: { $gte: fiveMinutesAgo },
          isAdVerified: false,
          isAdRejected: false,
        },
      })
      .populate({
        path: "videoAdRef",
        match: {
          assignedAdminId: adminId,
          assignmentTime: { $gte: fiveMinutesAgo },
          isAdVerified: false,
          isAdRejected: false,
        },
      })
      .populate({
        path: "surveyAdRef",
        match: {
          assignedAdminId: adminId,
          assignmentTime: { $gte: fiveMinutesAgo },
          isAdVerified: false,
          isAdRejected: false,
        },
      });

    const assignedAds = ads.filter(
      (ad) => ad.imgAdRef || ad.videoAdRef || ad.surveyAdRef
    );

    if (!assignedAds.length) {
      return res.status(404).json({ message: "No ads assigned to this admin" });
    }

    const result = assignedAds.map((ad) => ({
      _id: ad._id,
      imageAd: ad.imgAdRef || null,
      videoAd: ad.videoAdRef || null,
      surveyAd: ad.surveyAdRef || null,
    }));

    return res.status(200).json({
      message: "Fetched ads assigned to admin",
      ads: result,
    });
  } catch (err) {
    console.error("Error fetching assigned ads:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAdsVerifiedByAdmin = async (req, res) => {
  const  adminId  = req.params.id;

  try {
    const admin = await Admin.findById(adminId)
      .populate({
        path: "verifiedAds.adId",
        populate: [
          { path: "imgAdRef" },
          { path: "videoAdRef" },
          { path: "surveyAdRef" },
        ],
      })
      .populate("verifiedAds.userId", "username adminEmail phoneNumber");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const verified = admin.verifiedAds.filter((entry) => entry.status === "verified");

    return res.status(200).json({
      message: "Ads verified by admin",
      data: verified,
    });
  } catch (error) {
    console.error("Error fetching verified ads:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAdsRejectedByAdmin = async (req, res) => {
  const adminId = req.params.id;

  try {
    const admin = await Admin.findById(adminId)
      .populate({
        path: "verifiedAds.adId",
        populate: [
          { path: "imgAdRef" },
          { path: "videoAdRef" },
          { path: "surveyAdRef" },
        ],
      })
      .populate("verifiedAds.userId", "username adminEmail phoneNumber");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const rejected = admin.verifiedAds.filter((entry) => entry.status === "rejected");

    return res.status(200).json({
      message: "Ads rejected by admin",
      data: rejected,
    });
  } catch (error) {
    console.error("Error fetching rejected ads:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getKycsVerifiedByAdmin = async (req, res) => {
  const  adminId = req.params.id;

  try {
    const admin = await Admin.findById(adminId)
      .populate("kycsVerified.kycId")
      .populate("kycsVerified.userId", "username adminEmail phoneNumber");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const verified = admin.kycsVerified.filter((entry) => entry.status === "approved");

    return res.status(200).json({
      message: "KYCs approved by admin",
      data: verified,
    });
  } catch (error) {
    console.error("Error fetching approved KYCs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getKycsRejectedByAdmin = async (req, res) => {
  const  adminId  = req.params.id;

  try {
    const admin = await Admin.findById(adminId)
      .populate("kycsVerified.kycId")
      .populate("kycsVerified.userId", "username adminEmail phoneNumber");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const rejected = admin.kycsVerified.filter((entry) => entry.status === "rejected");

    return res.status(200).json({
      message: "KYCs rejected by admin",
      data: rejected,
    });
  } catch (error) {
    console.error("Error fetching rejected KYCs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// const distributeCoupon=async(req,res)=>{
//   const {userId,batchId}=req.body;
//   try {
//     const user=await user.findById(userId)
//   } catch (error) {
    
//   }
// }
//edit on 03-07-2025

const getAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id)
      //  .select("-password -otp") // exclude sensitive fields
      // .populate("verifiedAds.adId")
      // .populate("verifiedAds.userId")
      // .populate("kycsVerified.kycId")
      // .populate("kycsVerified.userId")
      // .populate("assignedCouponBatches.batchId");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// to fetch all the user coupon requests
const fetchAllCouponRequest = async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const requests = await couponRequestModel.find({
      paymentStatus: "pending",
      isProcessed: false,
      $or: [
        { assignedForVerification: null },
        {
          assignedForVerification: { $ne: null },
          assignedAtForVerification: { $lte: fiveMinutesAgo }
        }
      ]
    }).populate({
      path: "userId",
      select: "firstName lastName"
    });

    if (!requests.length) {
      return res.status(404).json({ message: "No pending coupon requests found" });
    }

    // Format response to include userName
    const formattedRequests = requests.map(request => {
      const { firstName = "", lastName = "" } = request.userId || {};
      return {
        ...request._doc,
        userName: `${firstName} ${lastName}`.trim()
      };
    });

    return res.status(200).json({
      success: true,
      message: "Fetched unassigned or expired coupon requests",
      totalPendingRequests: formattedRequests.length,
      data: formattedRequests
    });

  } catch (error) {
    console.error("Error in fetchAllCouponRequest:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};



//to fetch each requests for verification
const fetchSingleCouponRequest=async(req,res)=>{
  const{couponId}=req.body;
  if(!couponId){
    return res.status(404).json({message:"Invalid Id "})
  }
  try {
    const singleRequest=await couponRequestModel.findById(couponId);
    if(!singleRequest){
      return res.status(404).json({message:"No request found for the Id"})
    }
    return res.status(200).json({succes:true,message:"Request fetched succesfully",data:singleRequest})
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error",error})
  }
}
//assign to respective admin
const assignBatchToAdmin = async (req, res) => {
  const { batchId } = req.body;
  const adminId = req.params.id;

  try {
    const batch = await couponRequestModel.findById(batchId);

    if (!batch) {
      return res.status(404).json({ message: "Coupon batch not found" });
    }

    // Check if already assigned within last 5 minutes
    if (
      batch.assignedForVerification &&
      new Date() - new Date(batch.assignedAtForVerification) < 5 * 60 * 1000
    ) {
      return res.status(409).json({ message: "Batch already assigned recently" });
    }

    // Assign to admin
    batch.assignedForVerification = adminId;
    batch.assignedAtForVerification = new Date();
    await batch.save();

    return res.status(200).json({
      message: "Coupon batch assigned to admin successfully",
      batch
    });

  } catch (err) {
    console.error("Error assigning batch:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//to approve the batch by admin
const approveCouponRequest=async(req,res)=>{
  const{batchId}=req.body;
  try {
    
  } catch (error) {
    
  }
}


export {
  registerAdmin,
  adminLogin,
  getAllUsers,
  getSingleUser,
  fetchKycUploadedUsers,
  fetchSingleKycUploadUser,
  verifyKyc,
  rejectKyc,
  verifyAdById,
  getAdminWallet,
  getSuperAdminWallet,
  rejectAdById,
  kycVerifiedUsers,
  fetchUserKycStatus,
  sendOtpToAdmin,
  verifyOtpAndRegisterAdmin,
  sendAdminForgotPasswordOtp,
  verifyAdminForgotPasswordOtp,
  resetAdminPassword, 
  getAllAdmins, 
  deleteAdmins,
  assignKycToAdmin,
  assignAdToAdmin,
  fetchAdsAssignedToAdmin,
  fetchKycsAssignedToAdmin,
  getAdsVerifiedByAdmin,
  getAdsRejectedByAdmin,
  getKycsVerifiedByAdmin,
  getKycsRejectedByAdmin,
  getAdminById,
  fetchAllCouponRequest,
  fetchSingleCouponRequest,
  assignBatchToAdmin
};
