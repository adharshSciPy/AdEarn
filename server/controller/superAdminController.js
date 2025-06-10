import superAdmin from "../model/superAdminModel.js";
import jwt from "jsonwebtoken";
import path from "path";
import { Admin } from "../model/adminModel.js";
import User from "../model/userModel.js";
import SuperAdminWallet from "../model/superAdminWallet.js";
import Coupon from "../model/couponModel.js";
import WelcomeBonusSetting from "../model/WelcomeBonusSetting.js";
import ContestEntry from "../model/contestEntrySchema.js";
// import userEntrySchema from "../model/superAdminWallet.js"
import { UserWallet } from "../model/userWallet.js";
import kyc from "../model/kycModel.js";
import { passwordValidator } from "../utils/passwordValidator.js";

// to generate coupons randomly and store

function generateRandomCode(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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
    let setting = await WelcomeBonusSet;
    ting.findOne();

    if (!setting) {
      setting = new WelcomeBonusSetting({
        perUserBonus: amount,
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        updatedBy: req.superAdminId || null,
      });
    } else {
      setting.perUserBonus = amount;
      if (isEnabled !== undefined) setting.isEnabled = isEnabled;
      setting.updatedBy = req.superAdminId || null;
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

const createContest = async (req, res) => {
  try {
    const {
      contestName,
      contestNumber,
      startDate,
      endDate,
      entryStars,
      maxParticipants, // ✅ Add this
      result
    } = req.body;

    if (!contestName || !contestNumber || !startDate || !endDate || !entryStars) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existing = await ContestEntry.findOne({ contestNumber });
    if (existing) {
      return res.status(400).json({ message: "Contest number already exists" });
    }

    const contest = new ContestEntry({
      contestName,
      contestNumber,
      startDate,
      endDate,
      entryStars,
      maxParticipants,                 // ✅ Store it in DB
      currentParticipants: 0,         // ✅ Important for tracking
      totalEntries: 0,
      result: result || "Pending"
    });

    await contest.save();
    return res.status(201).json({ message: "Contest created successfully", contest });

  } catch (error) {
    console.error("Error creating contest:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const generateCoupons = async (req, res) => {
  const { couponCount, perStarCount, generationDate, expiryDate } = req.body;
  try {
    const couponsToCreate = [];
    for (let i = 0; i < couponCount; i++) {
      const code = generateRandomCode(10);
      couponsToCreate.push({
        code,
        perStarCount,
        generationDate: new Date(generationDate),
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      });
    }

    const createdCoupons = await Coupon.insertMany(couponsToCreate);
    return res.status(201).json({
      message: "Coupons generated successfully",
      count: createdCoupons.length,
      coupons: createdCoupons.map((c) => c.code),
    });
  } catch (error) {
    console.error("Error generating coupons:", error);
    return res.status(500).json({ message: "Internal server error" });
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
  const { userId, contestNumber, starsUsed } = req.body;

  try {
    if (!userId || !contestNumber || !starsUsed) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const now = new Date();

    // Fetch contest
    const contest = await ContestEntry.findOne({ contestNumber });
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    // Check if user is already registered
    const wallet = await SuperAdminWallet.findOne({
      "contestEntryWallet.collectedFromUsers.userId": userId,
      "contestEntryWallet.collectedFromUsers.contestId": contest._id
    });
    
    if (wallet) {
      return res.status(400).json({ message: "User already registered for this contest" });
    }

    // If contest already ended
    if (contest.status === "Ended") {
      return res.status(400).json({ message: "Contest has ended" });
    }

    // If current date > endDate, auto-end contest
    if (now > contest.endDate) {
      contest.status = "Ended";
      await contest.save();
      return res.status(400).json({ message: "Contest has expired" });
    }

    // If max participants reached, auto-end contest
    if (
      contest.maxParticipants &&
      contest.currentParticipants >= contest.maxParticipants
    ) {
      contest.status = "Ended";
      await contest.save();
      return res.status(400).json({ message: "Contest is full" });
    }

    // Proceed with registration
    contest.currentParticipants += 1;
    contest.totalEntries += 1;

    // End contest if after this addition it reaches limit
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
      userId,
      starsUsed,
      contestId: contest._id,
    });

    adminWallet.contestEntryWallet.totalReceived += starsUsed;
    adminWallet.contestEntryWallet.totalEntries += 1;

    // Optional: Deduct from global stars
    adminWallet.totalStars -= starsUsed;

    await adminWallet.save();

    return res.status(200).json({
      message: "User registered successfully",
      contestStatus: contest.status,
      contestEntryWallet: adminWallet.contestEntryWallet,
    });
  } catch (error) {
    console.error("Contest Registration Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
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

    return res.status(200).json({ message: "User deleted and stars transferred successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
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
  deleteUser
};
