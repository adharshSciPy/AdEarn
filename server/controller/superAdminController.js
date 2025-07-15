import superAdmin from "../model/superAdminModel.js";
import jwt from "jsonwebtoken";
import path from "path";
import { Admin } from "../model/adminModel.js";
import User from "../model/userModel.js";
import SuperAdminWallet from "../model/superAdminWallet.js";
import Coupon from "../model/couponModel.js";
import WelcomeBonusSetting from "../model/WelcomeBonusSetting.js";
import ContestEntry from "../model/contestEntrySchema.js";
import ContestParticipant from "../model/contestParticipantsSchema.js"
// import userEntrySchema from "../model/superAdminWallet.js"
import { UserWallet } from "../model/userWallet.js";
import kyc from "../model/kycModel.js";
import { passwordValidator } from "../utils/passwordValidator.js";
import { sendNotification } from "../utils/sendNotifications.js";
import CouponBatch from "../model/couponBatchModel.js";
import mongoose from "mongoose";
import couponBatchModel from "../model/couponBatchModel.js";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import redis from "../redisClient.js";
import config from "../config.js";
import getDateRange from "../utils/getDateRange.js";
import getCouponAmount from "../utils/getCouponAmount.js";
import couponRequestModel from "../model/couponRequestModel.js";
import UserContestEntry from "../model/userContestEntryModel.js"
// import superAdminWallet from "../model/superAdminWallet.js";
import { VideoAd } from "../model/videoadModel.js";
import { ImageAd } from "../model/imageadModel.js";
import { SurveyAd } from "../model/surveyadModel.js";
import { Ad } from "../model/AdsModel.js";
// import superAdminWallet from "../model/superAdminWallet.js";
import { convertStarsToRupees } from "../utils/convertStarsToRupees.js";
const ObjectId = mongoose.Types.ObjectId;

const USER_ROLE = process.env.USER_ROLE;
sgMail.setApiKey(config.SEND_GRID_API_KEY);
// to generate coupons randomly and store
function generateRandomCode(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
// to calculate the coupon amount
// function getCouponAmount(starCount) {
//   switch (starCount) {
//     case 5: return 5.00;
//     case 10: return 7.50;
//     case 25: return 12.50;
//     case 50: return 20.00;
//     case 100: return 40.00;
//     case 250: return 100.00;
//     default: return starCount; // fallback logic (₹1 per star)
//   }
// }


// register super admin
const registerSuperAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!passwordValidator(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const existingAdmin = await superAdmin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const newAdmin = await superAdmin.create({
      email,
      password,
    });

    // ✅ Automatically create SuperAdminWallet
    await SuperAdminWallet.create({
  totalStars: 0,
  perUserWelcomeBonus: 0,
  transactions: [],
  expiredCouponRefunds: [],
  deletedUserStars: [],
  welcomeBonusWallet: {
    totalReceived: 0,
    remainingStars: 0,
    given: [],
    logs: [],
  },
  companyRewardWallet: {
    totalReceived: 0,
    remainingStars: 0,
    companyDeposits: [],
    givenToWinners: [],
  },
  contestEntryWallet: {
    totalReceived: 0,
    totalEntries: 0,
    collectedFromUsers: [],
  },
  // Provide a default valid entry if starsUsed is required
  userEntry: {
    userId: newAdmin._id,
    starsUsed: 0,
    contestId: null,
  },
  blacklistedUserStars: {
    userId: newAdmin._id,
    starsTransferred: 0,
  },
  subscriptionLogs: [],
});


    const token = jwt.sign(
      { id: newAdmin._id, role: newAdmin.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Super Admin registered successfully",
      admin: {
        id: newAdmin._id,
        email: newAdmin.email,
        role: newAdmin.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error in registerSuperAdmin:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// super admin login
const superAdminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await superAdmin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await admin.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      superAdminId: admin._id,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// to fetch all admins
const getAllAdmins = async (req, res) => {
  try {
    const allAdmins = await Admin.find();
    if (!allAdmins || allAdmins.length === 0) {
      return res.status(400).json({ message: "No admins Found" });
    }
    return res
      .status(200)
      .json({ message: "All admins fetched succesfully", data: allAdmins });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// to enable or disable user (user.isUserEnabled:true?Enabled User:Disabled User)
const toggleUserStatus = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "No User Found" });
    }
    user.isUserEnabled = !user.isUserEnabled;
    await user.save();
    res.status(200).json({
      message: `User status updated to ${
        user.isUserEnabled ? "Enabled" : "Disabled"
      }`,
      user,
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// to enable or disable Admins(admin.isAdminEnabled:true?Enabled Admin:Disabled User)
const toggleAdminStatus = async (req, res) => {
  const { id } = req.body;
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(400).json("Admin not found");
    }
    admin.isAdminEnabled = !admin.isAdminEnabled;
    await admin.save();
    res.status(200).json({
      message: `Admin status updated to ${
        admin.isAdminEnabled ? "Enabled" : "Disabled"
      }`,
      admin,
    });
  } catch (error) {
    console.error("Error toggling admin status:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
const getSuperAdminWallet = async (req, res) => {
  try {
    const Swallet = await SuperAdminWallet.findOne()
      .populate("transactions.userId", "email")
      .populate("adExtraDeductions.userId", "email");

    if (!Swallet) {
      return res.status(404).json({ message: "Admin wallet not found" });
    }

    const getTotal = (array = [], key) =>
      array.reduce((sum, item) => sum + (item[key] || 0), 0);

    // Compute star totals
    const totals = {
      transactionsTotalStars: getTotal(Swallet.transactions, "starsReceived"),
      adExtraDeductionsTotalStars: getTotal(Swallet.adExtraDeductions, "stars"),
      expiredCouponRefundsTotalStars: getTotal(Swallet.expiredCouponRefunds, "stars"),
      deletedUserStarsTotalStars: getTotal(Swallet.deletedUserStars, "starsTransferred"),
      welcomeBonusGivenTotalStars: getTotal(Swallet.welcomeBonusWallet?.given, "stars"),
      welcomeBonusLogsTotalStars: getTotal(Swallet.welcomeBonusWallet?.logs, "stars"),
      companyDepositsTotalStars: getTotal(Swallet.companyRewardWallet?.companyDeposits, "stars"),
      companyGivenToWinnersTotalStars: getTotal(Swallet.companyRewardWallet?.givenToWinners, "stars"),
      contestCollectedStars: (Swallet.contestEntryWallet?.collectedFromUsers || []).length,
      userEntryTotalStars: getTotal(Swallet.userEntry, "starsUsed"),
      blacklistedUserStarsTotal: getTotal(Swallet.blacklistedUserStars, "starsTransferred"),
      subscriptionStarsUsed: getTotal(Swallet.subscriptionLogs, "starsUsed"),
      starDistributionsTotalStars: getTotal(Swallet.starDistributions, "stars"),
      couponGenerationTotalStars: getTotal(Swallet.couponGenerationLogs, "starsSpent"),
    };

    // Add rupee conversion for all totals
    const totalsWithAmounts = {};
    for (const [key, stars] of Object.entries(totals)) {
      totalsWithAmounts[key] = stars;

      // Allow conversion for all types (not just ending in 'Stars')
      const amountKey =
        key === "contestCollectedStars"
          ? "contestCollectedAmountInRupees"
          : key.replace("Stars", "AmountInRupees");

      totalsWithAmounts[amountKey] = convertStarsToRupees(stars);
    }

    // Add rupee info inside nested wallets
    const welcomeBonusWallet = {
      ...Swallet.welcomeBonusWallet?._doc,
      totalReceivedAmountInRupees: convertStarsToRupees(Swallet.welcomeBonusWallet?.totalReceived || 0),
      remainingStarsAmountInRupees: convertStarsToRupees(Swallet.welcomeBonusWallet?.remainingStars || 0),
    };

    const companyRewardWallet = {
      ...Swallet.companyRewardWallet?._doc,
      totalReceivedAmountInRupees: convertStarsToRupees(Swallet.companyRewardWallet?.totalReceived || 0),
      remainingStarsAmountInRupees: convertStarsToRupees(Swallet.companyRewardWallet?.remainingStars || 0),
    };

    const contestEntryWallet = {
      ...Swallet.contestEntryWallet?._doc,
      totalReceivedAmountInRupees: convertStarsToRupees(Swallet.contestEntryWallet?.totalReceived || 0),
      reservedForContestsAmountInRupees: convertStarsToRupees(Swallet.contestEntryWallet?.reservedForContests || 0),
    };

    return res.status(200).json({
      message: "Super-Admin wallet fetched successfully",
      totalStars: Swallet.totalStars,
      totalAmountInRupees: convertStarsToRupees(Swallet.totalStars),
      perUserWelcomeBonus: Swallet.perUserWelcomeBonus,

      // Totals with amounts
      ...totalsWithAmounts,

      // Raw + enriched wallets
      transactions: Swallet.transactions,
      adExtraDeductions: Swallet.adExtraDeductions,
      expiredCouponRefunds: Swallet.expiredCouponRefunds,
      deletedUserStars: Swallet.deletedUserStars,
      welcomeBonusWallet,
      companyRewardWallet,
      contestEntryWallet,
      userEntry: Swallet.userEntry,
      blacklistedUserStars: Swallet.blacklistedUserStars,
      subscriptionLogs: Swallet.subscriptionLogs,
      starDistributions: Swallet.starDistributions,
      couponGenerationLogs: Swallet.couponGenerationLogs,

      createdAt: Swallet.createdAt,
      updatedAt: Swallet.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching super-admin wallet:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getSuperAdminWelcomeBonusEarnings = async (req, res) => {
  try {
    const wallet = await SuperAdminWallet.findOne();

    if (!wallet || !wallet.welcomeBonusWallet) {
      return res.status(404).json({ message: "SuperAdmin wallet not found" });
    }

    const totalReceived = wallet.welcomeBonusWallet.totalReceived;
    const remainingStars = wallet.welcomeBonusWallet.remainingStars;

    return res.status(200).json({
      totalReceived,
      remainingStars,
      message: "Fetched welcome bonus earnings successfully",
    });
  } catch (error) {
    console.error("Error fetching welcome bonus earnings:", error);
    return res.status(500).json({
      message: "Error retrieving welcome bonus earnings",
      error: error.message,
    });
  }
};
const setWelcomeBonusAmount = async (req, res) => {
  const { amount, isEnabled } = req.body;

  if (amount < 0) {
    return res.status(400).json({ message: "Invalid welcome bonus amount" });
  }

  try {
    let setting = await WelcomeBonusSetting.findOne();

    if (!setting) {
      setting = new WelcomeBonusSetting({
        perUserBonus: amount,
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        updatedBy: req.superAdminId || null,
        companyImage: req.file
          ? `/Uploads/welcomeBonusImages/${req.file.filename}`
          : null,
      });
    } else {
      setting.perUserBonus = amount;
      if (isEnabled !== undefined) setting.isEnabled = isEnabled;
      setting.updatedBy = req.superAdminId || null;

      if (req.file) {
        setting.companyImage = `/Uploads/welcomeBonusImages/${req.file.filename}`;
      }
    }

    await setting.save();

    return res.status(200).json({
      message: "Welcome bonus setting updated",
      setting,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const distributeWelcomeBonus = async (newUserId) => {
  try {
    const setting = await WelcomeBonusSetting.findOne();

    if (!setting || !setting.isEnabled || setting.perUserBonus <= 0) {
      return {
        success: false,
        starsGiven: 0,
        message: "Welcome bonus is disabled or not set",
        imageUrl: null,
      };
    }

    const starsToGive = setting.perUserBonus;

    const wallet = await SuperAdminWallet.findOne();
    if (
      !wallet ||
      !wallet.welcomeBonusWallet ||
      wallet.welcomeBonusWallet.remainingStars < starsToGive
    ) {
      return {
        success: false,
        starsGiven: 0,
        message: "Not enough welcome bonus stars in SuperAdmin wallet",
        imageUrl: setting.companyImage || null,
      };
    }

    const alreadyGiven = wallet.welcomeBonusWallet.given.some(
      (entry) =>
        entry.userId && entry.userId.toString() === newUserId.toString()
    );

    if (alreadyGiven) {
      return {
        success: false,
        starsGiven: 0,
        message: "User has already received the welcome bonus",
        imageUrl: setting.companyImage || null,
      };
    }

    const user = await User.findById(newUserId).populate("userWalletDetails");
    if (!user || !user.userWalletDetails) {
      return {
        success: false,
        starsGiven: 0,
        message: "User or wallet not found",
        imageUrl: setting.companyImage || null,
      };
    }

    // ✅ Credit stars
    user.userWalletDetails.totalStars += starsToGive;
    user.userWalletDetails.welcomeBonus = starsToGive;

    await user.userWalletDetails.save();

    // ✅ Deduct from SuperAdmin wallet
    wallet.welcomeBonusWallet.remainingStars -= starsToGive;

    // ✅ Push log entry
    wallet.welcomeBonusWallet.logs.push({
      starsAdded: -starsToGive,
      source: "Welcome Bonus",
      addedAt: new Date(),
    });

    // ✅ Record in given list
    wallet.welcomeBonusWallet.given.push({
      userId: newUserId,
      starsGiven: starsToGive,
      givenAt: new Date(),
    });

    await wallet.save();

    return {
      success: true,
      starsGiven: starsToGive,
      imageUrl: setting.companyImage || null,
      message: "Welcome bonus applied successfully",
    };
  } catch (error) {
    console.error("Error distributing welcome bonus:", error);
    return {
      success: false,
      starsGiven: 0,
      imageUrl: null,
      message: "Internal server error",
    };
  }
};



const generateCoupons = async (req, res) => {
  const {
    couponCount,
    perStarCount,
    generationDate,
    expiryDate,
    requestNote,
  } = req.body;

  try {
    const totalStarsNeeded = couponCount * perStarCount;
    const perCouponAmount = getCouponAmount(perStarCount);
    const totalAmountInRupees = couponCount * perCouponAmount;

    // Check super admin wallet
    const superAdminWallet = await SuperAdminWallet.findOne();
    if (!superAdminWallet) {
      return res.status(404).json({ message: "Super Admin wallet not found" });
    }

    if (superAdminWallet.totalStars < totalStarsNeeded) {
      return res.status(400).json({
        message: `Insufficient stars in Super Admin wallet. Needed: ${totalStarsNeeded}, Available: ${superAdminWallet.totalStars}`,
      });
    }

    const generationDateObj = generationDate ? new Date(generationDate) : new Date();
    const expiryDateObj = expiryDate ? new Date(expiryDate) : null;

    // Step 1: Create the coupon batch (unassigned)
    const newBatch = new CouponBatch({
      coupons: [],
      couponCount,
      totalStarsSpent: totalStarsNeeded,
      amountInRupees: totalAmountInRupees,
      generationDate: generationDateObj,
      expiryDate: expiryDateObj,
      generatedBy: null,
      createdByRole: "superadmin",
      requestNote: requestNote || "",
      assignedTo: null,        // explicitly unassigned
      assignedAt: null,
    });

    await newBatch.save();

    // Step 2: Generate coupons
    const couponsToCreate = Array.from({ length: couponCount }).map(() => {
      const code = generateRandomCode(10);
      return {
        code,
        perStarCount,
        generationDate: generationDateObj,
        expiryDate: expiryDateObj,
        createdByRole: "superadmin",
        batchId: newBatch._id,
      };
    });

    const createdCoupons = await Coupon.insertMany(couponsToCreate);
    newBatch.coupons = createdCoupons.map(c => c._id);
    await newBatch.save();

    // Step 3: Deduct stars and log transaction
    superAdminWallet.totalStars -= totalStarsNeeded;
superAdminWallet.couponGenerationLogs.push({
  starsSpent: totalStarsNeeded,
  reason: `Generated ${couponCount} coupons (each ${perStarCount} stars)`,
  reference: {
    type: "CouponBatch",
    id: newBatch._id
  },
  createdAt: new Date()
});

    await superAdminWallet.save();

    return res.status(200).json({
      message: "Coupons generated successfully (unassigned batch)",
      batchId: newBatch._id,
      totalStarsSpent: totalStarsNeeded,
      totalAmountInRupees,
      remainingStars: superAdminWallet.totalStars,
      couponCodes: createdCoupons.map((c) => c.code),
    });
  } catch (error) {
    console.error("❌ Error generating coupons:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const getAllCoupons = async (req, res) => {
  try {
    const now = new Date();

    // Fetch all coupons with required fields + batchId
    const coupons = await Coupon.find(
      {},
      "code perStarCount expiryDate isClaimed generationDate batchId"
    ).sort({ generationDate: -1 });

    if (!coupons.length) {
      return res.status(200).json({
        message: "No coupons generated yet",
        coupons: [],
      });
    }

    // Add `isExpired` field
    const enrichedCoupons = coupons.map((coupon) => {
      const isExpired = coupon.expiryDate ? coupon.expiryDate < now : false;

      return {
        _id: coupon._id,
        code: coupon.code,
        perStarCount: coupon.perStarCount,
        expiryDate: coupon.expiryDate,
        isClaimed: coupon.isClaimed,
        generationDate: coupon.generationDate,
        isExpired,
        batchId: coupon.batchId,
      };
    });

    return res.status(200).json({
      message: "All generated coupons fetched successfully",
      count: enrichedCoupons.length,
      coupons: enrichedCoupons,
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const topUpWelcomeBonusStars = async (req, res) => {
  const { stars, source } = req.body;

  if (!stars || stars <= 0) {
    return res.status(400).json({ message: "Stars must be a positive number" });
  }

  try {
    const wallet = await SuperAdminWallet.findOne();

    if (!wallet) {
      return res.status(404).json({ message: "SuperAdmin wallet not found" });
    }

    // Initialize structure if missing
    if (!wallet.welcomeBonusWallet) {
      wallet.welcomeBonusWallet = {
        totalReceived: 0,
        remainingStars: 0,
        logs: [],
      };
    }

    // Update values
    wallet.welcomeBonusWallet.totalReceived += stars;
    wallet.welcomeBonusWallet.remainingStars += stars;
    wallet.welcomeBonusWallet.logs.push({
      starsAdded: stars,
      addedAt: new Date(),
      source: source || "Manual Top-up",
    });

    await wallet.save();

    return res.status(200).json({
      message: "Welcome bonus wallet topped up successfully",
      welcomeBonusWallet: wallet.welcomeBonusWallet,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
const topUpCompanyRewardStars = async (req, res) => {
  try {
    const { starsReceived, sourceCompany } = req.body;

    if (!starsReceived || !sourceCompany) {
      return res.status(400).json({
        message: "Both 'starsReceived' and 'sourceCompany' are required.",
      });
    }

    const wallet = await SuperAdminWallet.findOne();

    if (!wallet) {
      return res.status(404).json({ message: "SuperAdmin wallet not found" });
    }

    // ✅ Initialize companyRewardWallet if undefined
    if (!wallet.companyRewardWallet) {
      wallet.companyRewardWallet = {
        totalReceived: 0,
        remainingStars: 0,
        companyDeposits: [],
        givenToWinners: [],
      };
    }

    // ✅ Proceed to update
    wallet.companyRewardWallet.totalReceived += starsReceived;
    wallet.companyRewardWallet.remainingStars += starsReceived;

    wallet.companyRewardWallet.companyDeposits.push({
      starsReceived,
      sourceCompany,
    });

    await wallet.save();

    return res.status(200).json({
      message: "Company reward stars topped up successfully",
      remainingStars: wallet.companyRewardWallet.remainingStars,
    });
  } catch (error) {
    console.error("Top-up error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const patchSuperAdminWallet = async (req, res) => {
  try {
    const wallet = await SuperAdminWallet.findOne();

    if (!wallet) {
      return res.status(404).json({ message: "No SuperAdminWallet found" });
    }

    let updated = false;

    // Add companyRewardWallet if missing
    if (!wallet.companyRewardWallet) {
      wallet.companyRewardWallet = {
        totalReceived: 0,
        remainingStars: 0,
        companyDeposits: [],
        givenToWinners: [],
      };
      updated = true;
    }

    // Add contestEntryWallet if missing
    if (!wallet.contestEntryWallet) {
      wallet.contestEntryWallet = {
        totalReceived: 0,
        totalEntries: 0,
        collectedFromUsers: [],
      };
      updated = true;
    }

    // Add default welcomeBonusWallet if missing (just in case)
    if (!wallet.welcomeBonusWallet) {
      wallet.welcomeBonusWallet = {
        totalReceived: 0,
        remainingStars: 0,
        given: [],
        logs: [],
      };
      updated = true;
    }

    if (updated) {
      await wallet.save();
      return res.status(200).json({ message: "Wallet patched successfully" });
    } else {
      return res
        .status(200)
        .json({ message: "All required fields already exist" });
    }
  } catch (err) {
    console.error("Error patching wallet:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const registerUserToContest = async (req, res) => {
  const { userId, contestNumber } = req.body;

  try {
    if (!userId || !contestNumber) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const contest = await ContestEntry.findOne({ contestNumber });
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    if (contest.status !== "Active") {
      return res.status(400).json({ message: "Contest is not active" });
    }

    if (contest.currentParticipants >= contest.maxParticipants) {
      return res.status(400).json({ message: "Contest is full" });
    }

    const adminWallet = await SuperAdminWallet.findOne();
    if (!adminWallet) {
      return res.status(404).json({ message: "SuperAdmin wallet not found" });
    }

    const alreadyRegistered = adminWallet.contestEntryWallet.collectedFromUsers.find(
      entry =>
        entry.userId.toString() === userId.toString() &&
        entry.contestId.toString() === contest._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: "User already registered for this contest" });
    }

    const participantExists = await ContestParticipant.findOne({
      userId,
      contestId: contest._id,
    });

    if (participantExists) {
      return res.status(400).json({ message: "User already registered (participant exists)" });
    }

    const user = await User.findById(userId).populate("userWalletDetails");
    if (!user || !user.userWalletDetails) {
      return res.status(404).json({ message: "User or user wallet not found" });
    }

    if (user.userWalletDetails.totalStars < contest.entryStars) {
      return res.status(400).json({ message: "Not enough stars to enter the contest" });
    }

    // Deduct stars from user wallet
    user.userWalletDetails.totalStars -= contest.entryStars;
    await user.userWalletDetails.save();

    // Add to SuperAdmin wallet
    adminWallet.contestEntryWallet.collectedFromUsers.push({
      userId,
      contestId: contest._id,
      stars: contest.entryStars,
    });
    adminWallet.contestEntryWallet.totalReceived += contest.entryStars;
    adminWallet.contestEntryWallet.totalEntries += 1;
    adminWallet.totalStars += contest.entryStars;
    await adminWallet.save();

    // Update contest stats
    contest.currentParticipants += 1;
    contest.totalEntries += 1;
    await contest.save();

    // Log entries
    await ContestParticipant.create({ userId, contestId: contest._id });
    await UserContestEntry.create({
      userId,
      contestId: contest._id,
      entryStars: contest.entryStars,
    });

    // ✅ End contest only if automatic and full
    if (contest.currentParticipants >= contest.maxParticipants) {
      if (contest.winnerSelectionType === "Automatic") {
        console.log("🎯 Max participants reached. Triggering automatic winner selection...");
        await selectAutomaticWinnersInternal(contest._id);
      } else {
        console.log("📌 Manual contest full – waiting for SuperAdmin to assign winners.");
        // ❌ Do not mark manual contest as ended here
      }
    }

    const participants = await ContestParticipant.find({ contestId: contest._id })
      .populate("userId", "name email")
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      message: "User registered to contest successfully",
      participants,
    });

  } catch (error) {
    console.error("❌ Error registering to contest:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// const autoSelectWinners = async (req, res) => {
//   const { contestId } = req.params;
//   const numberOfWinners = parseInt(req.query.count) || 3; // Optional ?count=3

//   try {
//     if (!ObjectId.isValid(contestId)) {
//       return res.status(400).json({ message: "Invalid contest ID" });
//     }

//     const contest = await ContestEntry.findById(contestId);
//     if (!contest) {
//       return res.status(404).json({ message: "Contest not found" });
//     }

//     const participants = await ContestParticipant.find({ contestId });

//     if (participants.length < numberOfWinners) {
//       return res.status(400).json({ message: "Not enough participants to select winners" });
//     }

//     // Randomize and pick winners
//     const shuffled = participants.sort(() => 0.5 - Math.random());
//     const selected = shuffled.slice(0, numberOfWinners);

//     // Update each winner
//     const winnerEntries = [];

//     for (let i = 0; i < selected.length; i++) {
//       const winner = selected[i];

//       await ContestParticipant.findByIdAndUpdate(winner._id, {
//         isWinner: true,
//         position: i + 1,
//       });

//       winnerEntries.push({
//         userId: winner.userId,
//         position: i + 1
//       });
//     }

//     // Update contest
//     contest.winners = winnerEntries;
//     contest.status = "Ended";
//     contest.winnerSelectionType = "Automatic";
//     await contest.save();

//     res.status(200).json({
//       message: "Winners selected automatically",
//       winners: winnerEntries
//     });
//   } catch (err) {
//     console.error("Auto Winner Selection Error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
// to delete users

const deleteUser = async (req, res) => {
  const { id } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch user's wallet
    const userWallet = await UserWallet.findById(user.userWalletDetails);
    const userStars = userWallet?.totalStars || 0;

    // Find Super Admin Wallet (assuming only one exists)
    const superAdminWallet = await SuperAdminWallet.findOne();
    if (!superAdminWallet) {
      return res.status(500).json({ message: "Super Admin Wallet not found" });
    }

    // Create or push to deletedUserStars array
    if (!superAdminWallet.deletedUserStars) {
      superAdminWallet.deletedUserStars = [];
    }

    superAdminWallet.deletedUserStars.push({
      userId: user._id,
      starsTransferred: userStars,
      timestamp: new Date(),
    });

    // Transfer stars to SuperAdminWallet
    superAdminWallet.totalStars += userStars;
    await superAdminWallet.save();

    // Delete associated data
    if (user.kycDetails) {
      await kyc.findByIdAndDelete(user.kycDetails);
    }

    if (userWallet) {
      await UserWallet.findByIdAndDelete(user.userWalletDetails);
    }

    await User.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "User deleted and stars transferred successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// to blacklist user
const blacklistUser = async (req, res) => {
  const { userId } = req.body;
  const { io, connectedUsers } = req;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    // 🔍 Check if user already blacklisted
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existingUser.isBlacklisted) {
      return res.status(400).json({ message: "User is already blacklisted" });
    }

    // ✅ Blacklist the user
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlacklisted: true },
      { new: true }
    );

    // 🔄 Fetch wallet separately for accuracy
    const userWallet = await UserWallet.findById(user.userWalletDetails);
    let transferredStars = 0;

    if (userWallet && userWallet.totalStars > 0) {
      transferredStars = userWallet.totalStars;

      // Update super admin wallet
      await SuperAdminWallet.findOneAndUpdate(
        {},
        {
          $inc: { totalStars: transferredStars },
          $push: {
            blacklistedUserStars: {
              userId: user._id,
              starsTransferred: transferredStars,
            },
          },
        },
        { new: true }
      );

      // Reset user stars
      await UserWallet.findByIdAndUpdate(userWallet._id, {
        $set: { totalStars: 0 },
      });
    }

    // Notify user with correct star count
    const message = `Your account has been blacklisted by the admin. All your stars (${transferredStars}) have been transferred and you will be logged out shortly.`;
    await sendNotification(user._id, USER_ROLE, message, io, connectedUsers);

    // Emit logout
    const socketId = connectedUsers.get(userId);
    if (socketId) {
      setTimeout(() => {
        io.to(socketId).emit("forceLogout", {
          reason: "blacklisted",
          message: "You have been blacklisted. Logging out...",
        });
      }, 3000);
    }

    return res.status(200).json({
      message: `User blacklisted. Transferred ${transferredStars} stars to Super Admin.`,
      transferredStars,
    });
  } catch (error) {
    console.error("Error blacklisting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCouponBatches = async (req, res) => {
  try {
    const now = new Date();

    // Fetch all coupon batches and populate the coupons array
    const batches = await CouponBatch.find({})
      .sort({ generationDate: -1 }) // recent first
      .populate("coupons");

    if (!batches.length) {
      return res.status(200).json({
        message: "No coupon batches found",
        batches: [],
      });
    }

    // Enrich each coupon with isExpired
    const enrichedBatches = batches.map((batch) => {
      const enrichedCoupons = batch.coupons.map((coupon) => {
        const isExpired = coupon.expiryDate ? coupon.expiryDate < now : false;

        return {
          _id: coupon._id,
          code: coupon.code,
          perStarCount: coupon.perStarCount,
          expiryDate: coupon.expiryDate,
          isClaimed: coupon.isClaimed,
          generationDate: coupon.generationDate,
          isExpired,
          batchId: coupon.batchId,
        };
      });

      return {
        _id: batch._id,
        couponCount: batch.couponCount,
        totalStarsSpent: batch.totalStarsSpent,
        generationDate: batch.generationDate,
        expiryDate: batch.expiryDate,
        requestNote: batch.requestNote,
        createdByRole: batch.createdByRole,
        generatedBy: batch.generatedBy,
        assignedTo: batch.assignedTo,
        assignedAt: batch.assignedAt,
        coupons: enrichedCoupons,
      };
    });

    return res.status(200).json({
      message: "All coupon batches fetched successfully",
      count: enrichedBatches.length,
      batches: enrichedBatches,
    });
  } catch (error) {
    console.error("Error fetching coupon batches:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

  const couponDistribution = async (req, res) => {
    const { batchId, adminId, note } = req.body;
    const { io, connectedUsers } = req;

    try {
      // Find the admin
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Find the coupon batch
      const couponBatch = await couponBatchModel.findById(batchId);
      if (!couponBatch) {
        return res.status(404).json({ message: "Coupon batch not found" });
      }

      // Check if the batch is already assigned
      if (couponBatch.assignedTo) {
        return res.status(400).json({
          success: false,
          message: "Coupon batch is already assigned to another admin.",
          assignedTo: couponBatch.assignedTo
        });
      }

      // Assign the batch to the admin
      couponBatch.assignedTo = admin._id;
      couponBatch.assignedAt = new Date();
      await couponBatch.save();

      // Update the admin's assigned batch record
      admin.assignedCouponBatches.push({
        batchId: couponBatch._id,
        assignedAt: new Date(),
        note
      });
      await admin.save();

      // Send real-time notification
      await sendNotification(
        admin._id,
        process.env.ADMIN_ROLE,
        `A new coupon batch (ID: ${couponBatch._id}) has been assigned to you.${note ? " Note: " + note : ""}`,
        io,
        connectedUsers,
        `/admin/coupons/${couponBatch._id}`
      );

      // Respond
      res.status(200).json({
        success: true,
        message: "Coupon batch assigned successfully",
        data: {
          adminId: admin._id,
          batchId: couponBatch._id,
        },
      });
    } catch (error) {
      console.error("Error assigning coupon batch:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

const couponFetchById = async (req, res) => {
  const { id: batchId } = req.params;

  try {
    const batch = await couponBatchModel.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    const populatedBatch = await couponBatchModel.findById(batchId).populate("coupons");

    return res.status(200).json({
      message: "Coupons fetched successfully",
      data: populatedBatch,
    });
  } catch (error) {
    console.error("Error fetching coupon batch:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// password reset for superAdmin
const sendSuperAdminForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    await redis.set(`forgot_otp:${email.toLowerCase()}`, otp, "EX", 300);
    console.log(`Otp for ${email}:${otp}`);
    const msg = {
      to: email,
      from: config.SENDGRID_SENDER_EMAIL,
      subject: "Your SuperAdmin OTP Code",
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
const verifySuperAdminForgotPasswordOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }
  const emailKey = email.toLowerCase();
  const storedOtp = await redis.get(`forgot_otp:${emailKey}`);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  await redis.del(`forgot_otp:${emailKey}`);
  await redis.set(`reset_session:${emailKey}`, true, "EX", 600); // valid for 10 minutes

  return res
    .status(200)
    .json({ message: "OTP verified. You may now reset your password." });
};
const resetSuperAdminPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email and new password are required" });
  }

  const emailKey = email.toLowerCase();
  const sessionValid = await redis.get(`reset_session:${emailKey}`);
  if (!sessionValid) {
    return res
      .status(403)
      .json({ message: "Session expired or OTP not verified" });
  }

  try {
    const admin = await superAdmin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.password = newPassword; // hashed via pre-save
    await admin.save();
    await redis.del(`reset_session:${email}`);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Password Reset Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getAdminJobStats = async (req, res) => {
  const adminId = req.params.id;

  // Accept dates from either body or query
  const startDate = req.body?.startDate || req.query?.startDate;
  const endDate = req.body?.endDate || req.query?.endDate;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let verifiedAds = admin.verifiedAds || [];
    let rejectedAds = [];
    let approvedKycs = admin.kycsVerified || [];
    let rejectedKycs = [];

    const isFiltering = startDate && endDate;

    const start = isFiltering ? new Date(startDate) : null;
    const end = isFiltering ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : null;

    const filterByDate = (arr, dateField) => {
      return arr.filter(entry => {
        const date = new Date(entry[dateField]);
        return date >= start && date <= end;
      });
    };

    if (isFiltering) {
      verifiedAds = filterByDate(verifiedAds, "verifiedAt").filter(a => a.status === "verified");
      rejectedAds = filterByDate(admin.verifiedAds || [], "verifiedAt").filter(a => a.status === "rejected");

      approvedKycs = filterByDate(approvedKycs, "verifiedAt").filter(k => k.status === "approved");
      rejectedKycs = filterByDate(admin.kycsVerified || [], "verifiedAt").filter(k => k.status === "rejected");
    } else {
      // If no filter applied, just separate by status
      rejectedAds = verifiedAds.filter(a => a.status === "rejected");
      verifiedAds = verifiedAds.filter(a => a.status === "verified");

      rejectedKycs = approvedKycs.filter(k => k.status === "rejected");
      approvedKycs = approvedKycs.filter(k => k.status === "approved");
    }

    return res.status(200).json({
      message: isFiltering
        ? `Admin job stats filtered from ${startDate} to ${endDate}`
        : "All admin job logs (no date filter applied)",
      verifiedAds,
      rejectedAds,
      approvedKycs,
      rejectedKycs,
    });
  } catch (error) {
    console.error("Error fetching admin job stats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




const createContest = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      contestName,
      contestNumber,
      startDate,
      entryStars,
      maxParticipants,
      winnerSelectionType,
      rewardStructure
    } = req.body;

    if (
      !contestName ||
      !contestNumber ||
      !startDate ||
      !entryStars ||
      !maxParticipants
    ) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // ✅ Handle prize images
    let prizeImages = [];
    if (req.files && req.files.length > 0) {
      prizeImages = req.files.map(file => `/contestPrizeImages/${file.filename}`);
    }

    // ✅ Parse reward structure
    let parsedRewardStructure = [];
    let totalRewardStars = 0;

    if (rewardStructure) {
      try {
        parsedRewardStructure = JSON.parse(rewardStructure);
        if (!Array.isArray(parsedRewardStructure) || parsedRewardStructure.length === 0) {
          return res.status(400).json({ message: "Invalid reward structure format" });
        }

        // Sum total stars
        totalRewardStars = parsedRewardStructure.reduce(
          (sum, item) => sum + Number(item.stars || 0), 0
        );
      } catch (err) {
        return res.status(400).json({ message: "Failed to parse reward structure" });
      }
    }

    // ✅ Validate that at least reward or prize image exists
    if (parsedRewardStructure.length === 0 && prizeImages.length === 0) {
      return res.status(400).json({
        message: "Provide at least reward structure or prize images"
      });
    }

    // ✅ Check for contest number uniqueness
    const existing = await ContestEntry.findOne({ contestNumber });
    if (existing) {
      return res.status(400).json({ message: "Contest number already exists" });
    }

    // ✅ Deduct from SuperAdmin wallet if using stars
    if (parsedRewardStructure.length > 0) {
      const adminWallet = await SuperAdminWallet.findOne();
      if (!adminWallet || adminWallet.totalStars < totalRewardStars) {
        return res.status(400).json({ message: "Not enough stars in SuperAdmin wallet" });
      }

      adminWallet.totalStars -= totalRewardStars;
      adminWallet.contestEntryWallet.reservedForContests =
        (adminWallet.contestEntryWallet.reservedForContests || 0) + totalRewardStars;
      await adminWallet.save();
    }

    // ✅ Create contest entry
    const contest = new ContestEntry({
      contestName,
      contestNumber,
      startDate,
      entryStars,
      maxParticipants,
      currentParticipants: 0,
      totalEntries: 0,
      prizeImages,                     // ✅ used later for automatic prize assignment
      rewardStructure: parsedRewardStructure,
      contestEntryWallet: totalRewardStars,
      winnerSelectionType: winnerSelectionType || "Manual",
      status: "Active",
      manuallyStopped: false,
    });

    await contest.save();

    return res.status(201).json({
      message: "Contest created successfully",
      contest
    });

  } catch (error) {
    console.error("Error creating contest:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



const selectAutomaticWinnersInternal = async (contestId) => {
  const contest = await ContestEntry.findById(contestId);
  if (!contest || contest.status === "Ended") return;

  const adminWallet = await SuperAdminWallet.findOne();
  const allEntries = adminWallet.contestEntryWallet?.collectedFromUsers || [];

  const contestEntries = allEntries.filter(entry =>
    entry.contestId.toString() === contestId.toString()
  );

  const rewardStructure = contest.rewardStructure || [];

  if (contestEntries.length < rewardStructure.length) {
    console.log("Not enough participants to choose winners");
    contest.status = "Ended";
    contest.result = "Not Enough Participants";
    await contest.save();
    return;
  }

  const shuffled = contestEntries.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, rewardStructure.length);

  const winners = selected.map((entry, index) => {
    const rewardTier = rewardStructure.find(r => r.position === index + 1);
    return {
      userId: new mongoose.Types.ObjectId(entry.userId),
      position: index + 1,
      prize: {
        stars: rewardTier ? rewardTier.stars : 0,
        image: contest.prizeImages?.[index] || ""
      }
    };
  });

  const totalReward = winners.reduce((sum, w) => sum + (w.prize?.stars || 0), 0);

  if (adminWallet.contestEntryWallet.reservedForContests < totalReward) {
    console.log("Not enough reserved stars for reward distribution");
    return;
  }

  for (const winner of winners) {
    if (winner.prize.stars > 0) {
      const user = await User.findById(winner.userId).populate("userWalletDetails");
      if (user?.userWalletDetails) {
        user.userWalletDetails.totalStars += winner.prize.stars;
        await user.userWalletDetails.save();
      }
    }
  }

  adminWallet.contestEntryWallet.reservedForContests -= totalReward;
  adminWallet.totalStars -= totalReward;
  await adminWallet.save();

  contest.winners = winners;
  contest.status = "Ended";
  contest.result = "Completed";
  contest.contestEntryWallet -= totalReward;
  await contest.save();
};


const stopContestManually = async (req, res) => {
  const { id } = req.params;

  try {
    const contest = await ContestEntry.findById(id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    if (contest.status === "Ended") {
      return res.status(400).json({ message: "Contest already ended" });
    }

    contest.status = "Ended";
    contest.manuallyStopped = true;
    await contest.save();


    if (contest.winners && contest.winners.length > 0) {
      return res.status(200).json({
        message: "Contest manually stopped, but winners already selected. No refunds issued.",
        contest
      });
    }

    const adminWallet = await SuperAdminWallet.findOne();
    if (!adminWallet) {
      return res.status(404).json({ message: "SuperAdmin Wallet not found" });
    }

    const contestEntries = adminWallet.contestEntryWallet?.collectedFromUsers?.filter(
      (entry) => entry.contestId.toString() === contest._id.toString()
    ) || [];

    const starsToRefund = contest.entryStars;
    const refundedUsers = [];

    for (const entry of contestEntries) {
      const user = await User.findById(entry.userId).populate("userWalletDetails");
      if (!user || !user.userWalletDetails) continue;

      user.userWalletDetails.totalStars += starsToRefund;
      await user.userWalletDetails.save();

      refundedUsers.push(user._id.toString());
    }

    // Remove refunded entries from admin wallet
    adminWallet.contestEntryWallet.collectedFromUsers = adminWallet.contestEntryWallet.collectedFromUsers.filter(
      (entry) => entry.contestId.toString() !== contest._id.toString()
    );

    adminWallet.contestEntryWallet.totalReceived -= refundedUsers.length * starsToRefund;
    adminWallet.contestEntryWallet.totalEntries -= refundedUsers.length;
    adminWallet.totalStars -= refundedUsers.length * starsToRefund;

    await adminWallet.save();

    return res.status(200).json({
      message: "Contest manually stopped and stars refunded to users",
      refundedUsers,
      contest
    });

  } catch (err) {
    console.error("Manual Stop Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
//to fetch admin coupon requests
const fetchAdminCouponsRequests = async (req, res) => {
  try {
    const requests = await couponRequestModel.find({
      adminId: { $ne: null },// Ensure it's an admin request
      isApproved: false,               
      isProcessed: false,
      paymentStatus: "pending"
    }).populate({
      path: "adminId",
      select: "adminName adminEmail"   
    });

    if (!requests.length) {
      return res.status(404).json({ message: "No pending admin coupon requests found" });
    }

    // Format with admin name if needed
    const formatted = requests.map(req => {
      const adminName = req.adminId?.adminName || "Admin";
          const starCountPerCoupon = req.starCountPerCoupon || 0;
      const totalStars = req.totalStars || 0;
      const couponCount = starCountPerCoupon > 0 ? totalStars / starCountPerCoupon : 0;
      return {
        ...req._doc,
        adminName,
         starCountPerCoupon,
        totalStars,
        couponCount
      };
    });

    return res.status(200).json({
      success: true,
      message: "Fetched admin coupon requests",
      count: formatted.length,
      data: formatted
    });

  } catch (error) {
    console.error("Error fetching admin coupon requests:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
//to approve and distribute the coupons for admins
const approveAndDistributeCouponForAdminRequest = async (req, res) => {
  const { adminId, requestId } = req.body;
  const { io, connectedUsers } = req;

  try {
    // STEP 1: Validate Admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // STEP 2: Validate Request
    const request = await couponRequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Coupon request not found" });
    }

    if (request.adminId.toString() !== adminId) {
      return res.status(403).json({ message: "Request does not belong to this admin" });
    }

    if (request.isApproved || request.isProcessed) {
      return res.status(400).json({ message: "Request already approved or processed" });
    }

    const { starCountPerCoupon, totalStars } = request;
    const couponCount = totalStars / starCountPerCoupon;

    // STEP 3: Get superadmin coupons
    const batches = await couponBatchModel.find({ createdByRole: "superadmin" }).populate({
      path: "coupons",
      match: {
        isClaimed: false,
        isApproved: false,
        perStarCount: starCountPerCoupon
      }
    });

    const availableCoupons = [];
    const usedBatchIds = new Set();

    for (const batch of batches) {
      for (const coupon of batch.coupons) {
        availableCoupons.push(coupon);
        usedBatchIds.add(coupon.batchId.toString());
        if (availableCoupons.length === couponCount) break;
      }
      if (availableCoupons.length === couponCount) break;
    }

    if (availableCoupons.length < couponCount) {
      const message =
        availableCoupons.length === 0
          ? `No coupons available for ${starCountPerCoupon} stars per coupon.`
          : `Only ${availableCoupons.length} of ${couponCount} coupons available for ${starCountPerCoupon} stars per coupon.`;
      return res.status(400).json({ success: false, message });
    }

    const couponIds = availableCoupons.map(c => c._id);

    // STEP 4: Mark coupons as claimed and approved
    await Coupon.updateMany(
      { _id: { $in: couponIds } },
      {
        $set: {
          isClaimed: true,
          isApproved: true,
          requestedByUser: adminId,
          isUserRequestApproved: true,
          assignedToRequest: request._id,
          requestNote: request.note
        }
      }
    );

    // STEP 5: Update request
    request.assignedCoupons = couponIds;
    request.isApproved = true;
    request.approvedByAdmin = null;
    await request.save();

    // STEP 6: Push batch info to admin's assignedCouponBatches
    const batchLog = Array.from(usedBatchIds).map(batchId => ({
      batchId,
      assignedAt: new Date(),
      note: request.note || ""
    }));

    await Admin.findByIdAndUpdate(admin._id, {
      $push: {
        assignedCouponBatches: { $each: batchLog }
      }
    });

    // STEP 7: Notify admin
    await sendNotification(
      admin._id,
      400,
      `Your coupon request (${starCountPerCoupon} stars x ${couponCount}) has been approved.`,
      io,
      connectedUsers,
      // `/admin/my-coupons`
    );

    return res.status(200).json({
      success: true,
      message: "Admin coupon request approved and coupons distributed",
      approvedCouponCount: availableCoupons.length,
      requestId: request._id,
      assignedCoupons: availableCoupons
    });

  } catch (error) {
    console.error("Error in approveAndDistributeCouponForAdminRequest:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};
//to distribute stars to user 
const distributeStarsToUser = async (req, res) => {
  let { userId, starCount,} = req.body;

  if (!userId || starCount == null) {
    return res.status(400).json({ message: "User ID and star count are required." });
  }

  starCount = Number(starCount);
  if (isNaN(starCount) || starCount <= 0) {
    return res.status(400).json({ message: "Invalid star count" });
  }

  try {
    const user = await User.findById(userId).populate("userWalletDetails");
    if (!user) return res.status(404).json({ message: "User not found" });

    const wallet = user.userWalletDetails;
    if (!wallet) return res.status(404).json({ message: "User wallet not found" });

    const saWallet = await SuperAdminWallet.findOne();
    if (!saWallet) return res.status(500).json({ message: "Super admin wallet not found" });

    if (saWallet.totalStars < starCount) {
      return res.status(400).json({ message: "Insufficient stars in SuperAdmin wallet" });
    }
    saWallet.totalStars -= starCount;
    saWallet.starDistributions.push({
      userId,
      starsGiven: starCount,
      note,
      date: new Date(),
    });

    await saWallet.save();

    
    const logEntry = {
      starCount,
      note,
      givenAt: new Date(),
    };

    wallet.superadminGiven = wallet.superadminGiven || [];
    wallet.superadminGiven.push(logEntry);
    wallet.totalStars = (wallet.totalStars || 0) + starCount;
    await wallet.save();

    return res.status(200).json({
      success: true,
      message: `${starCount} stars successfully given to user`,
      userId: user._id,
      totalStars: wallet.totalStars,
      superAdminRemainingStars: saWallet.totalStars,
      log: logEntry,
    });

  } catch (error) {
    console.error("Error in distributeStarsToUser:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// GET all contests or by contestNumber
const getContests = async (req, res) => {
  try {
    const { contestNumber } = req.query;

    let query = { status: "Active" }; // 🔥 Only fetch contests with status Active

    if (contestNumber) {
      query.contestNumber = contestNumber;
    }

    const contests = await ContestEntry.find(query)
      .sort({ startDate: -1 })
      .lean();

    // ✅ Add slotsLeft to each contest
    const contestsWithSlots = contests.map((contest) => ({
      ...contest,
      slotsLeft: contest.maxParticipants - contest.currentParticipants
    }));

    return res.status(200).json({
      message: contestNumber ? "Contest fetched" : "Active contests fetched",
      contests: contestsWithSlots
    });
  } catch (error) {
    console.error("Error fetching contests:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
//to fetch admin wallet with full details (stars)
const getAdminAccountDetails = async (req, res) => {
  try {
    const adminWallet = await adminwalletModel.findOne().populate({
      path: "transactions.userId",
      select: "email firstName lastName"
    });

    if (!adminWallet) {
      return res.status(404).json({ message: "Admin wallet not found" });
    }

    return res.status(200).json({
      message: "Admin wallet fetched successfully",
      totalStars: adminWallet.totalStars,
      transactions: adminWallet.transactions,
    });
  } catch (error) {
    console.error("Error fetching admin wallet details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//to fetch subscription account details (stars)
const getSubscriptionAccountDetails = async (req, res) => {
  try {
    const superAdmin = await SuperAdminWallet.findOne();

    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "Super admin wallet not found",
      });
    }

    const subscriptionLogs = superAdmin.subscriptionLogs || [];

    return res.status(200).json({
      success: true,
      message: "Subscription account details fetched successfully",
      subscriptionLogs,
    });
  } catch (error) {
    console.error("Error fetching subscription account details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
//to fetch adAccounts(stars)
const getAllUserAdSummaries = async (req, res) => {
  try {
    
    const users = await User.find({ ads: { $exists: true, $not: { $size: 0 } } }).populate("ads");

 
    const videoAdIds = [];
    const imageAdIds = [];
    const surveyAdIds = [];

    for (const user of users) {
      for (const ad of user.ads) {
        if (ad.videoAdRef) videoAdIds.push(ad.videoAdRef);
        else if (ad.imgAdRef) imageAdIds.push(ad.imgAdRef);
        else if (ad.surveyAdRef) surveyAdIds.push(ad.surveyAdRef);
      }
    }

    const [videoAds, imageAds, surveyAds] = await Promise.all([
      VideoAd.find({ _id: { $in: videoAdIds } }).lean(),
      ImageAd.find({ _id: { $in: imageAdIds } }).lean(),
      SurveyAd.find({ _id: { $in: surveyAdIds } }).lean(),
    ]);

   
    const videoAdMap = new Map(videoAds.map(ad => [ad._id.toString(), ad]));
    const imageAdMap = new Map(imageAds.map(ad => [ad._id.toString(), ad]));
    const surveyAdMap = new Map(surveyAds.map(ad => [ad._id.toString(), ad]));

   
    const userSummaries = [];

    for (const user of users) {
      let totalStarsSpent = 0;
      let verifiedAdCount = 0;
      let rejectedAdCount = 0;
      const adDetailsList = [];

      for (const ad of user.ads) {
        let adDoc = null;
        let adType = null;

        if (ad.videoAdRef) {
          adDoc = videoAdMap.get(ad.videoAdRef.toString());
          adType = "Video";
        } else if (ad.imgAdRef) {
          adDoc = imageAdMap.get(ad.imgAdRef.toString());
          adType = "Image";
        } else if (ad.surveyAdRef) {
          adDoc = surveyAdMap.get(ad.surveyAdRef.toString());
          adType = "Survey";
        }

        if (!adDoc) continue;

        let starsSpent = 0;
        let status = "Pending";

        if (adDoc.isAdRejected) {
          status = "Rejected";
          starsSpent = adDoc.extraDeductedStars || 0;
          rejectedAdCount++;
        } else if (adDoc.isAdVerified) {
          status = "Verified";
          starsSpent = (adDoc.totalStarsAllocated || 0) + (adDoc.extraDeductedStars || 0);
          verifiedAdCount++;
        }

        if (status !== "Pending") {
          totalStarsSpent += starsSpent;
        }

        adDetailsList.push({
          adId: adDoc._id,
          title: adDoc.title,
          adType,
          starsSpent,
          status,
        });
      }

      userSummaries.push({
        userId: user._id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        totalAds: adDetailsList.length,
        totalStarsSpent,
        verifiedAdCount,
        rejectedAdCount,
        ads: adDetailsList,
      });
    }

    return res.status(200).json({
      message: "All user ad summaries fetched successfully",
      userCount: userSummaries.length,
      data: userSummaries,
    });
  } catch (err) {
    console.error("Error in getAllUserAdSummaries:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
const assignWinnerManually = async (req, res) => {
  const { contestId, userId, position } = req.body;

  if (!contestId || !userId || !position) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const contest = await ContestEntry.findById(contestId);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    // Ensure winners array exists
    if (!Array.isArray(contest.winners)) {
      contest.winners = [];
    }

    const alreadyAssigned = contest.winners.find(w => w?.userId?.toString() === userId);
    if (alreadyAssigned) {
      return res.status(400).json({ message: "User already assigned as a winner" });
    }

    // Determine prize for this position
    const prizeFromStructure = contest.rewardStructure?.find(r => r.position === position);
    const imageFromPrizeImages = contest.prizeImages?.[position - 1] || "";

    const stars = prizeFromStructure?.stars || 0;
    const image = imageFromPrizeImages;

    // Assign winner with prize
    contest.winners.push({
      userId,
      position,
      prize: {
        stars,
        image
      }
    });

    // Reward stars to user wallet
    if (stars > 0) {
      const wallet = await UserWallet.findOne({ userId });
      if (wallet) {
        wallet.totalStars += stars;
        await wallet.save();
      }
    }

    // ✅ End contest if all positions are filled
    const totalRewards = (contest.rewardStructure?.length || 0) + (contest.prizeImages?.length || 0);
    if (contest.winners.length >= totalRewards) {
      contest.status = "Ended";
      contest.result = "Completed";
    }

    await contest.save();

    res.status(200).json({
      message: "Winner assigned successfully",
      winners: contest.winners
    });
  } catch (err) {
    console.error("Manual winner assignment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




//to fetch total amount in superadmin wallet(rupees)
const getSuperAdminTotalAmount=async(req,res)=>{
  try {
  const superAdminWallet=await SuperAdminWallet.findOne();
    if(!superAdminWallet){
      return res.status(404).json({message:"SuperAdmin wallet not found "})
    }
    const superAdminTotalStars=superAdminWallet.totalStars;

    console.log(convertStarsToRupees(superAdminTotalStars));
    
  } catch (error) {
    
  }
}
//to fetch admin share in amount (rupees)
const getAdminWalletWithTransactionDetails = async (req, res) => {
  try {
    const adminWallet = await adminwalletModel.findOne();

    if (!adminWallet) {
      return res.status(404).json({ message: "Admin wallet not found" });
    }

    const totalStars = adminWallet.totalStars || 0;
    const totalAmountInRupees = convertStarsToRupees(totalStars);

    // Prepare enriched transactions
    const transactionsWithUserDetails = await Promise.all(
      adminWallet.transactions.map(async (txn) => {
        const user = await User.findById(txn.userId).select("firstName lastName email");
        return {
          userId: txn.userId,
          userName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
          userEmail: user?.email || "",
          starsReceived: txn.starsReceived,
          amountInRupees: convertStarsToRupees(txn.starsReceived),
          date: txn.date,
        };
      })
    );

    return res.status(200).json({
      message: "Admin wallet and transaction details fetched successfully",
      totalStars,
      totalAmountInRupees,
      transactionCount: transactionsWithUserDetails.length,
      transactions: transactionsWithUserDetails,
    });
  } catch (error) {
    console.error("Error in getAdminWalletWithTransactionDetails:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
//to fetch subscriptionAccount deatils in amount(rupees)
 const getSubscriptionAccountDetailsInAmount = async (req, res) => {
  try {
    const superAdmin = await SuperAdminWallet.findOne();

    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "Super admin wallet not found",
      });
    }

    const subscriptionLogs = superAdmin.subscriptionLogs || [];

    let totalStarsUsed = 0;

    const enrichedLogs = await Promise.all(
      subscriptionLogs.map(async (log) => {
        const user = await User.findById(log.userId).select("firstName lastName");
        const userName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
        const amountInRupees = convertStarsToRupees(log.starsUsed || 0);

        totalStarsUsed += log.starsUsed || 0;

        return {
          userId: log.userId,
          userName,
          starsUsed: log.starsUsed,
          amountInRupees,
          subscriptionStatus: log.subscriptionStatus,
          subscriptionStartDate: log.subscriptionStartDate,
          subscriptionEndDate: log.subscriptionEndDate,
          renewedAt: log.renewedAt,
          loggedAt: log.loggedAt,
        };
      })
    );

    const totalAmountInRupees = convertStarsToRupees(totalStarsUsed);

    return res.status(200).json({
      success: true,
      message: "Subscription account details fetched successfully",
      totalStarsUsed,
      totalAmountInRupees,
      subscriptionLogs: enrichedLogs,
    });
  } catch (error) {
    console.error("Error fetching subscription account details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
//to fetch user ads in amount(rupees)
const getAllUserAdSummariesInAmount = async (req, res) => {
  try {
    const users = await User.find({
      ads: { $exists: true, $not: { $size: 0 } }
    }).populate("ads");

    const videoAdIds = [];
    const imageAdIds = [];
    const surveyAdIds = [];

    for (const user of users) {
      for (const ad of user.ads) {
        if (ad.videoAdRef) videoAdIds.push(ad.videoAdRef);
        else if (ad.imgAdRef) imageAdIds.push(ad.imgAdRef);
        else if (ad.surveyAdRef) surveyAdIds.push(ad.surveyAdRef);
      }
    }

    const [videoAds, imageAds, surveyAds] = await Promise.all([
      VideoAd.find({ _id: { $in: videoAdIds } }).lean(),
      ImageAd.find({ _id: { $in: imageAdIds } }).lean(),
      SurveyAd.find({ _id: { $in: surveyAdIds } }).lean(),
    ]);

    const videoAdMap = new Map(videoAds.map(ad => [ad._id.toString(), ad]));
    const imageAdMap = new Map(imageAds.map(ad => [ad._id.toString(), ad]));
    const surveyAdMap = new Map(surveyAds.map(ad => [ad._id.toString(), ad]));

    const userSummaries = [];
    let grandTotalAmountInRupees = 0;

    for (const user of users) {
      let totalStarsSpent = 0;
      let verifiedAdCount = 0;
      let rejectedAdCount = 0;
      const adDetailsList = [];

      for (const ad of user.ads) {
        let adDoc = null;
        let adType = null;

        if (ad.videoAdRef) {
          adDoc = videoAdMap.get(ad.videoAdRef.toString());
          adType = "Video";
        } else if (ad.imgAdRef) {
          adDoc = imageAdMap.get(ad.imgAdRef.toString());
          adType = "Image";
        } else if (ad.surveyAdRef) {
          adDoc = surveyAdMap.get(ad.surveyAdRef.toString());
          adType = "Survey";
        }

        if (!adDoc) continue;

        let starsSpent = 0;
        let status = "Pending";

        if (adDoc.isAdRejected) {
          status = "Rejected";
          starsSpent = adDoc.extraDeductedStars || 0;
          rejectedAdCount++;
        } else if (adDoc.isAdVerified) {
          status = "Verified";
          starsSpent = (adDoc.totalStarsAllocated || 0) + (adDoc.extraDeductedStars || 0);
          verifiedAdCount++;
        }

        if (status !== "Pending") {
          totalStarsSpent += starsSpent;
        }

        adDetailsList.push({
          adId: adDoc._id,
          title: adDoc.title,
          adType,
          starsSpent,
          amountInRupees: convertStarsToRupees(starsSpent),
          status,
        });
      }

      const totalAmountInRupees = convertStarsToRupees(totalStarsSpent);
      grandTotalAmountInRupees += totalAmountInRupees;

      userSummaries.push({
        userId: user._id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        totalAds: adDetailsList.length,
        totalStarsSpent,
        totalAmountInRupees,
        verifiedAdCount,
        rejectedAdCount,
        ads: adDetailsList,
      });
    }

    return res.status(200).json({
      message: "All user ad summaries fetched successfully",
      userCount: userSummaries.length,
      grandTotalAmountInRupees,
      data: userSummaries,
    });
  } catch (err) {
    console.error("Error in getAllUserAdSummaries:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
 const getAllContestsForSuperAdmin = async (req, res) => {
  try {
    const contests = await ContestEntry.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "winners.userId",
        select: "firstName email"
      })
      .lean();

    const result = contests.map(contest => ({
      _id: contest._id,
      contestName: contest.contestName,
      contestNumber: contest.contestNumber,
      startDate: contest.startDate,
      entryStars: contest.entryStars,
      maxParticipants: contest.maxParticipants,
      currentParticipants: contest.currentParticipants,
      totalEntries: contest.totalEntries,
      status: contest.status,
      winnerSelectionType: contest.winnerSelectionType,
      prizeImages: contest.prizeImages,
      rewardStructure: contest.rewardStructure,
      numberOfWinners: contest.rewardStructure.length,
      totalRewardStars: contest.rewardStructure.reduce((sum, r) => sum + r.stars, 0),
      manuallyStopped: contest.manuallyStopped,
      createdAt: contest.createdAt,
      updatedAt: contest.updatedAt,
      result: contest.result || "Pending",

      // ✅ Include winners with user name/email and prize info
      winners: (contest.winners || []).map(w => ({
        position: w?.position,
        stars: w?.prize?.stars || 0,
        image: w?.prize?.image || "",
        user: {
          _id: w?.userId?._id,
          name: w?.userId?.firstName || "N/A",
          email: w?.userId?.email || "N/A"
        }
      }))
    }));

    res.status(200).json({
      message: "Contests fetched successfully",
      contests: result
    });
  } catch (err) {
    console.error("Error fetching contests:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//to fetch coupon batch details in both star and amount
const getAllCouponBatchSummaries = async (req, res) => {
  try {
    const batches = await CouponBatch.find({});

    if (!batches.length) {
      return res.status(200).json({
        message: "No coupon batches found",
        totalStarsSpent: 0,
        totalAmountInRupees: 0,
        count: 0,
        batches: [],
      });
    }

    let totalStarsSpent = 0;

    const summarizedBatches = batches.map((batch) => {
      totalStarsSpent += batch.totalStarsSpent || 0;

      return {
        _id: batch._id,
        couponCount: batch.couponCount,
        totalStarsSpent: batch.totalStarsSpent,
        totalAmountInRupees: convertStarsToRupees(batch.totalStarsSpent),
        generationDate: batch.generationDate,
        expiryDate: batch.expiryDate,
        requestNote: batch.requestNote,
        createdByRole: batch.createdByRole,
        generatedBy: batch.generatedBy,
        assignedTo: batch.assignedTo,
        assignedAt: batch.assignedAt,
      };
    });

    return res.status(200).json({
      message: "Coupon batch summaries fetched successfully",
      totalStarsSpent,
      totalAmountInRupees: convertStarsToRupees(totalStarsSpent),
      count: summarizedBatches.length,
      batches: summarizedBatches,
    });
  } catch (error) {
    console.error("Error fetching coupon batch summaries:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getActiveManualContests =async (req, res) => {
  try {
    const contests = await ContestEntry.find({
      status: "Active",
      winnerSelectionType: "Manual"
    })
      .lean();

    // Fetch participants for each contest
    const enrichedContests = await Promise.all(
      contests.map(async (contest) => {
        const participants = await ContestParticipant.find({ contestId: contest._id })
          .populate("userId", "firstName email")
          .sort({ createdAt: 1 })
          .lean();

        return {
          ...contest,
          participants
        };
      })
    );

    return res.status(200).json({
      message: "Active manual contests with participants",
      contests: enrichedContests
    });
  } catch (error) {
    console.error("Error fetching active manual contests:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getManualContestById = async (req, res) => {
  const { id } = req.params;

  try {
    const contest = await ContestEntry.findOne({
      _id: id,
      status: "Active",
      winnerSelectionType: "Manual"
    }).lean();

    if (!contest) {
      return res.status(404).json({ message: "Manual active contest not found" });
    }

    const participants = await ContestParticipant.find({ contestId: contest._id })
      .populate("userId", "firstName email")
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      message: "Manual contest fetched successfully",
      contest: {
        ...contest,
        participants
      }
    });
  } catch (error) {
    console.error("Error fetching manual contest:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export {
  registerSuperAdmin,
  superAdminLogin,
  getAllAdmins,
  toggleUserStatus,
  toggleAdminStatus,
  getSuperAdminWallet,
  setWelcomeBonusAmount,
  generateCoupons,
  distributeWelcomeBonus,
  topUpWelcomeBonusStars,
  createContest,
  topUpCompanyRewardStars,
  patchSuperAdminWallet,
  registerUserToContest,
  // autoSelectWinners,
  deleteUser,
  blacklistUser,
  getAllCoupons,
  getAllCouponBatches,
  couponDistribution,
  couponFetchById,
  sendSuperAdminForgotPasswordOtp,
  verifySuperAdminForgotPasswordOtp,
  resetSuperAdminPassword,
  getAdminJobStats,
  selectAutomaticWinnersInternal,
  stopContestManually,
  getSuperAdminWelcomeBonusEarnings,
  fetchAdminCouponsRequests,
  approveAndDistributeCouponForAdminRequest,
  distributeStarsToUser,
  getContests,
  getAdminAccountDetails,
  getSubscriptionAccountDetails,
  getAllUserAdSummaries,
  assignWinnerManually ,
  getSuperAdminTotalAmount,
  getAdminWalletWithTransactionDetails,
  getSubscriptionAccountDetailsInAmount,
  getAllUserAdSummariesInAmount,
  getAllContestsForSuperAdmin,
  getActiveManualContests ,
  getManualContestById,
  getAllCouponBatchSummaries
};
