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
  try {
    const fetchKycUsers = await User.find({
      kycDetails: { $exists: true, $ne: null },
    });
    if (!fetchKycUsers || fetchKycUsers.length === 0) {
      return res
        .status(400)
        .json({ message: "No pending verification requests" });
    }
    return res
      .status(200)
      .json({
        message: "Users who have requested for kyc verification",
        data: fetchKycUsers,
      });
  } catch (error) {
    console.error("Error fetching users:", error);
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

    const updatedKyc = await kyc.findByIdAndUpdate(
      user.kycDetails,
      { kycStatus: "approved" },
      { new: true }
    );

    if (!updatedKyc) {
      return res.status(404).json({ message: "KYC document not found." });
    }

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
  const { id } = req.body;
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
    const updatedKyc = await kyc.findByIdAndUpdate(
      user.kycDetails,
      { kycStatus: "rejected" },
      { new: true }
    );
    if (!updatedKyc) {
      return res.status(404).json({ message: "KYC document not found." });
    }
    return res.status(200).json({
      message: "Your request for kyc verification has been rejected.",
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

    if (ad.imgAdRef && !ad.imgAdRef.isAdVerified) {
      const verifiedTime = new Date();
      const views = ad.imgAdRef.userViewsNeeded;
      let expirationDate = new Date(verifiedTime);
      if (views >= 100 && views <= 900) {
        expirationDate.setMonth(expirationDate.getMonth() + 3);
      } else if (views >= 1000 && views <= 9000) {
        expirationDate.setMonth(expirationDate.getMonth() + 6);
      } else if (views >= 10000) {
        expirationDate.setMonth(expirationDate.getMonth() + 9);
      }
      updatedAd = await ImageAd.findByIdAndUpdate(
        ad.imgAdRef._id,
        {
          isAdVerified: true,
          adVerifiedTime: verifiedTime,
          adExpirationTime: expirationDate,
        },
        { new: true }
      );
    } else if (ad.videoAdRef && !ad.videoAdRef.isAdVerified) {
       const verifiedTime = new Date();
      const views = ad.videoAdRef.userViewsNeeded;
      let expirationDate = new Date(verifiedTime);
      if (views >= 100 && views <= 900) {
        expirationDate.setMonth(expirationDate.getMonth() + 3);
      } else if (views >= 1000 && views <= 9000) {
        expirationDate.setMonth(expirationDate.getMonth() + 6);
      } else if (views >= 10000) {
        expirationDate.setMonth(expirationDate.getMonth() + 9);
      }
      updatedAd = await VideoAd.findByIdAndUpdate(
        ad.videoAdRef._id,
        { isAdVerified: true ,
          adVerifiedTime: verifiedTime,
          adExpirationTime: expirationDate,
        },
        { new: true }
      );
    } else if (ad.surveyAdRef && !ad.surveyAdRef.isAdVerified) {
        const verifiedTime = new Date();
      const views = ad.surveyAdRef.userViewsNeeded;
      let expirationDate = new Date(verifiedTime);
      if (views >= 100 && views <= 900) {
        expirationDate.setMonth(expirationDate.getMonth() + 3);
      } else if (views >= 1000 && views <= 9000) {
        expirationDate.setMonth(expirationDate.getMonth() + 6);
      } else if (views >= 10000) {
        expirationDate.setMonth(expirationDate.getMonth() + 9);
      }
      updatedAd = await SurveyAd.findByIdAndUpdate(
        ad.surveyAdRef._id,
        { isAdVerified: true,
          adVerifiedTime: verifiedTime,
          adExpirationTime: expirationDate,
         },
        { new: true }
      );
    } else {
      return res.status(200).json({ message: "Ad is already verified" });
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
    let adType = "";

    // ✅ Handle image ad rejection
    if (ad.imgAdRef && !ad.imgAdRef.isAdVerified) {
      updatedAd = await ImageAd.findByIdAndUpdate(
        ad.imgAdRef._id,
        {
          isAdVerified: false,
          isAdVisible: false,
          adRejectionReason: reason || "Rejected by admin",
          adRejectedTime: new Date(),
        },
        { new: true }
      );
      adType = "image";
    }

    // ✅ Optionally add video/survey ad rejection logic
    /*
    else if (ad.videoAdRef && !ad.videoAdRef.isAdVerified) {
      // handle video ad rejection
    } else if (ad.surveyAdRef && !ad.surveyAdRef.isAdVerified) {
      // handle survey ad rejection
    }
    */

    if (!updatedAd) {
      return res.status(400).json({ message: "Ad is already verified or invalid ad type" });
    }

    return res.status(200).json({
      message: `Ad rejected successfully (${adType} ad)`,
      updatedAd,
    });
  } catch (error) {
    console.error("Error rejecting ad:", error);
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
