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
import  Notification  from "../model/notificationsModel.js";
import  {sendNotification } from "../utils/sendNotifications.js";
import { UserWallet } from "../model/userWallet.js";

const USER_ROLE=process.env.USER_ROLE;
const ADMIN_ROLE=process.env.ADMIN_ROLE;
const SUPER_ADMIN_ROLE=process.env.SUPER_ADMIN_ROLE;

const registerAdmin = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    // Validate inputs
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
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

    const admin = await Admin.create({ phoneNumber, password, role });

    // Return admin without password
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
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { adminEmail, password } = req.body;

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update email if provided
    if (adminEmail) {
      admin.adminEmail = adminEmail;
    }

    if (password) {
      if (!passwordValidator(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character.",
        });
      }
    }

    await admin.save();

    // Return updated admin without password
    const updatedAdmin = await Admin.findById(id).select("-password");

    res.status(200).json({
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error("Admin update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
  // const { io, connectedUsers } = req;

  try {
    // 1. Find users who uploaded KYC
    const fetchKycUsers = await User.find({
      kycDetails: { $exists: true, $ne: null },
    });

    if (!fetchKycUsers || fetchKycUsers.length === 0) {
      return res.status(400).json({ message: "No pending verification requests" });
    }

    // 2. Get all admin users
    // const adminUsers = await Admin.find({ adminRole: ADMIN_ROLE });

    // // 3. Prepare notifications
    // const message = `New KYC verification request(s) submitted.`;
    // const adminNotifications = adminUsers.map((admin) => ({
    //   receiverId: admin._id,
    //   receiverRole: ADMIN_ROLE,
    //   message,
    // }));

    // 4. Save notifications to DB
    // await Notification.insertMany(adminNotifications);

    // // 5. Send real-time notifications via socket.io
    // const notifyAdmins = adminUsers.map((admin) =>
    //   sendNotification(admin._id, ADMIN_ROLE, message, io, connectedUsers)
    // );
    // await Promise.all(notifyAdmins);

    // 6. Respond
    return res.status(200).json({
      message: "Admins notified of KYC requests",
      totalPendingUsers: fetchKycUsers.length,
      data: fetchKycUsers,
    });
  } catch (error) {
    console.error("Error in fetchKycUploadedUsers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// to view each induvidual for kyc verification
const fetchSingleKycUploadUser = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ message: "No user found,Please check the Id" });
    }
    if (!user.kycDetails) {
      return res
        .status(400)
        .json({ message: "User has not submitted KYC details." });
    }
    const kycDetails = await kyc.findById(user.kycDetails);
    return res
      .status(200)
      .json({ message: "User fetched Succesfully", data: kycDetails });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// kyc verification
const verifyKyc = async (req, res) => {
  const { id } = req.body;
  const { io, connectedUsers } = req;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "No user found. Please check the ID." });
    }

    if (!user.kycDetails) {
      return res.status(400).json({ message: "User has not submitted KYC details." });
    }

    const existingKyc = await kyc.findById(user.kycDetails);
    if (!existingKyc) {
      return res.status(404).json({ message: "KYC document not found." });
    }


    if (existingKyc.kycStatus === "approved") {
      return res.status(400).json({ message: "User KYC is already approved." });
    }

    
    const updatedKyc = await kyc.findByIdAndUpdate(
      user.kycDetails,
      { kycStatus: "approved" },
      { new: true }
    );

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
  const { id, rejectionReason } = req.body;
  const { io, connectedUsers } = req;

  if (!rejectionReason || rejectionReason.trim() === "") {
    return res.status(400).json({ message: "Rejection reason is required." });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "No user found. Please check the ID." });
    }

    if (!user.kycDetails) {
      return res.status(400).json({ message: "User has not submitted KYC details." });
    }

    const existingKyc = await kyc.findById(user.kycDetails);
    if (!existingKyc) {
      return res.status(404).json({ message: "KYC document not found." });
    }

    if (existingKyc.kycStatus === "rejected") {
      return res.status(400).json({ message: "User KYC is already rejected." });
    }

    const updatedKyc = await kyc.findByIdAndUpdate(
      user.kycDetails,
      {
        kycStatus: "rejected",
        rejectionReason: rejectionReason.trim(),
      },
      { new: true }
    );

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

// to verify ads
const verifyAdById = async (req, res) => {
  const { adId } = req.body;
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

    // 🔔 Send notification to creator
    if (createdBy) {
      const formattedTime = new Date(adPostedTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short"
      });
        const link = `/adspreview/${createdBy}/${ad._id}`;
      const message = `Your ${adType} titled "${adTitle}" posted on ${formattedTime} has been verified successfully!`;
      await sendNotification(createdBy, USER_ROLE, message, io, connectedUsers,link);
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
  const { io, connectedUsers } = req;

  if (!adId) {
    return res.status(400).json({ message: "adId is required" });
  }

  try {
    const ad = await Ad.findById(adId)
      .populate({
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
      return res.status(400).json({ message: "Ad is already verified or invalid ad type" });
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

    // ✅ Notification with refund info
    if (createdBy) {
      const formattedTime = new Date(adPostedTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      const message = `Your ${adType} titled "${adTitle}" posted on ${formattedTime} has been rejected. Reason: ${rejectionReason}. Refunded ${totalStarsAllocated} stars to your wallet.`;
      await sendNotification(createdBy._id, USER_ROLE, message, io, connectedUsers);
    }

    return res.status(200).json({
      message: `Ad rejected successfully (${adType}), stars refunded`,
      updatedAd,
      refundedStars: totalStarsAllocated,
    });

  } catch (error) {
    console.error("❌ Error rejecting ad:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




export {
  registerAdmin,
  updateAdmin,
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
  rejectAdById 
};
