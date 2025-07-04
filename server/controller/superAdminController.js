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
function getCouponAmount(starCount) {
  switch (starCount) {
    case 5: return 5.00;
    case 10: return 7.50;
    case 25: return 12.50;
    case 50: return 20.00;
    case 100: return 40.00;
    case 250: return 100.00;
    default: return starCount; // fallback logic (₹1 per star)
  }
}


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
    const Swallet = await SuperAdminWallet.findOne().populate(
      "transactions.userId",
      "email"
    );

    if (!Swallet) {
      return res.status(404).json({ message: "Admin wallet not found" });
    }

    return res.status(200).json({
      message: "Super-Admin wallet fetched successfully",
      totalStars: Swallet.totalStars,
      transactions: Swallet.transactions,
    });
  } catch (error) {
    console.error("Error fetching super-admin wallet:", error);
    return res.status(500).json({ message: "Internal server error" });
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
      };
    }

    const user = await User.findById(newUserId).populate("userWalletDetails");
    if (!user || !user.userWalletDetails) {
      return {
        success: false,
        starsGiven: 0,
        message: "User or wallet not found",
      };
    }

    // ✅ Credit stars
    user.userWalletDetails.totalStars += starsToGive;

    // ✅ Store welcome bonus info inside user's wallet
    user.userWalletDetails.welcomeBonus = starsToGive;

    await user.userWalletDetails.save();

    // ✅ Deduct from SuperAdmin wallet
    wallet.welcomeBonusWallet.remainingStars -= starsToGive;

    // ✅ Push log entry
    wallet.welcomeBonusWallet.logs.push({
      reason: "Welcome Bonus",
      starsAdded: -starsToGive,
      date: new Date(),
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
      message: "Welcome bonus applied successfully",
    };
  } catch (error) {
    console.error("Error distributing welcome bonus:", error);
    return {
      success: false,
      starsGiven: 0,
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
    assignedToAdminId
  } = req.body;

  try {
    const totalStarsNeeded = couponCount * perStarCount;
    const perCouponAmount = getCouponAmount(perStarCount);
    const totalAmountInRupees = couponCount * perCouponAmount;

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

    // Create the batch
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
      assignedTo: assignedToAdminId,
      assignedAt: new Date(),
    });

    await newBatch.save();

    // Generate coupons
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

    // Deduct stars and log transaction
    superAdminWallet.totalStars -= totalStarsNeeded;
    superAdminWallet.transactions.push({
      starsReceived: -totalStarsNeeded,
      reason: `Generated ${couponCount} coupons (each ${perStarCount} stars)`,
      addedBy: null,
      type: "deduct",
      reference: {
        type: "CouponBatch",
        id: newBatch._id,
      },
      createdAt: new Date(),
    });

    await superAdminWallet.save();

    return res.status(200).json({
      message: "✅ Coupons generated successfully",
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

    const now = new Date();

    // Fetch contest
    const contest = await ContestEntry.findOne({ contestNumber });
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    const starsUsed = contest.entryStars;

    // Check if user already registered
    const existingEntry = await SuperAdminWallet.findOne({
      "contestEntryWallet.collectedFromUsers": {
        $elemMatch: {
          userId: new ObjectId(userId),
          contestId: contest._id,
        },
      },
    });

    if (existingEntry) {
      return res
        .status(400)
        .json({ message: "User already registered for this contest" });
    }

    // Check if contest expired or full
    if (contest.status === "Ended" || now > contest.endDate) {
      contest.status = "Ended";
      await contest.save();
      return res.status(400).json({ message: "Contest has expired" });
    }

    if (
      contest.maxParticipants &&
      contest.currentParticipants >= contest.maxParticipants
    ) {
      contest.status = "Ended";
      await contest.save();
      return res.status(400).json({ message: "Contest is full" });
    }

    // Get user and wallet (populate wallet reference)
    const user = await User.findById(userId).populate("userWalletDetails");
    if (!user || !user.userWalletDetails) {
      return res.status(404).json({ message: "User or user wallet not found" });
    }

    const userWallet = user.userWalletDetails;

    if (
      typeof userWallet.totalStars !== "number" ||
      userWallet.totalStars < starsUsed
    ) {
      return res
        .status(400)
        .json({ message: "Insufficient stars in user's wallet" });
    }

    // Deduct stars from user's wallet
    userWallet.totalStars -= starsUsed;
    await userWallet.save();

    // Update contest participation
    contest.currentParticipants += 1;
    contest.totalEntries += 1;

    if (
      contest.maxParticipants &&
      contest.currentParticipants >= contest.maxParticipants
    ) {
      contest.status = "Ended";
    }

    await contest.save();

    // Update SuperAdmin wallet
    const adminWallet = await SuperAdminWallet.findOne();
    if (!adminWallet) {
      return res.status(404).json({ message: "SuperAdmin wallet not found" });
    }

    if (!adminWallet.contestEntryWallet) {
      adminWallet.contestEntryWallet = {
        totalReceived: 0,
        totalEntries: 0,
        collectedFromUsers: [],
      };
    }

    adminWallet.contestEntryWallet.collectedFromUsers.push({
      userId: new ObjectId(userId),
      starsUsed,
      contestId: contest._id,
    });

    adminWallet.contestEntryWallet.totalReceived += starsUsed;
    adminWallet.contestEntryWallet.totalEntries += 1;
    adminWallet.totalStars += starsUsed;

    await adminWallet.save();

    return res.status(200).json({
      message: "User registered successfully",
      contestStatus: contest.status,
    });
  } catch (error) {
    console.error("Contest Registration Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
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
      result,
      winnerSelectionType
    } = req.body;

    // Required field validation
    if (
      !contestName ||
      !contestNumber ||
      !startDate ||
      !entryStars ||
      !maxParticipants
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // Validate winnerSelectionType if provided
    const validTypes = ["Manual", "Automatic"];
    if (winnerSelectionType && !validTypes.includes(winnerSelectionType)) {
      return res.status(400).json({ message: "Invalid winnerSelectionType" });
    }

    // Check for duplicate contest number
    const existing = await ContestEntry.findOne({ contestNumber });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Contest number already exists" });
    }

    // Handle prize images (optional)
    let prizeImages = [];
    if (req.files && req.files.length > 0) {
      prizeImages = req.files.map(
        (file) => `/contestPrizeImages/${file.filename}`
      );
    }

    // Create new contest
    const contest = new ContestEntry({
      contestName,
      contestNumber,
      startDate,
      entryStars,
      maxParticipants,
      currentParticipants: 0,
      totalEntries: 0,
      result: result || "Pending",
      prizeImages,
      winnerSelectionType: winnerSelectionType || "Manual",
      status: "Active",
      manuallyStopped: false
    });

    await contest.save();

    return res
      .status(201)
      .json({ message: "Contest created successfully", contest });

  } catch (error) {
    console.error("Error creating contest:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const selectAutomaticWinners = async (req, res) => {
  const { contestId, numberOfWinners } = req.body;

  try {
    if (!contestId || !numberOfWinners) {
      return res.status(400).json({ message: "Missing contestId or numberOfWinners" });
    }

    const contest = await ContestEntry.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

   if (contest.status === "Ended" && contest.winners.length > 0) {
  return res.status(400).json({ message: "Winners already selected for this contest" });
}
    if (contest.winnerSelectionType !== "Automatic") {
      return res.status(400).json({ message: "This contest is not set for automatic selection" });
    }

    // Get all entries from SuperAdminWallet
    const adminWallet = await SuperAdminWallet.findOne();
    const allEntries = adminWallet.contestEntryWallet?.collectedFromUsers || [];

    // Filter entries specific to this contest
    const contestEntries = allEntries.filter(entry =>
      entry.contestId.toString() === contestId.toString()
    );

    if (contestEntries.length < numberOfWinners) {
      return res.status(400).json({ message: "Not enough participants to choose winners" });
    }

    // Shuffle entries randomly
    const shuffled = contestEntries.sort(() => 0.5 - Math.random());

    // Pick top N winners
    const selected = shuffled.slice(0, numberOfWinners);

    // Save to contest.winners
    contest.winners = selected.map((entry, index) => ({
      userId: entry.userId,
      position: index + 1,
    }));

    contest.status = "Ended";
    await contest.save();

    return res.status(200).json({
      message: "Winners selected successfully",
      winners: contest.winners,
    });

  } catch (error) {
    console.error("Automatic Winner Selection Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
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

    // ✅ Skip refund if winners already selected
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
  selectAutomaticWinners,
  stopContestManually
};
