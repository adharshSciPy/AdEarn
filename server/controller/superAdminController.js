import superAdmin from "../model/superAdminModel.js";
import jwt from "jsonwebtoken";
import path from "path";
import { Admin } from "../model/adminModel.js";
import User from "../model/userModel.js";
import SuperAdminWallet from "../model/superAdminWallet.js";
import Coupon from "../model/couponModel.js"
import WelcomeBonusSetting from '../model/WelcomeBonusSetting.js';

import { passwordValidator } from "../utils/passwordValidator.js";

// to generate coupons randomly and store

function generateRandomCode(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
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
    let setting = await WelcomeBonusSetting.findOne();

    if (!setting) {
      setting = new WelcomeBonusSetting({
        perUserBonus: amount,
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        updatedBy: req.superAdminId || null
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
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
 const getBonusHistory = async (req, res) => {
  try {
    const wallet = await SuperAdminWallet.findOne().populate([
      {
        path: "transactions.userId",
        select: "name email",
      },
      {
        path: "transactions.addedBy",
        select: "name email",
      },
    ]);

    if (!wallet) {
      return res.status(404).json({ message: "SuperAdmin wallet not found" });
    }

    return res.status(200).json({
      message: "Bonus history retrieved successfully",
      bonusHistory: wallet.transactions,
    });
  } catch (error) {
    console.error("Error retrieving bonus history:", error);
    return res.status(500).json({ message: "Failed to retrieve bonus history", error: error.message });
  }
};

const distributeWelcomeBonus = async (newUserId) => {
  try {
    const wallet = await SuperAdminWallet.findOne();
    if (!wallet || wallet.perUserWelcomeBonus <= 0) {
      return { success: false, starsGiven: 0, message: "Welcome bonus not set or is 0" };
    }

    const starsToGive = wallet.perUserWelcomeBonus;

    if (wallet.totalStars < starsToGive) {
      return {
        success: false,
        starsGiven: 0,
        message: "Not enough stars in SuperAdmin wallet",
      };
    }

    // Check if user already received the welcome bonus
    const alreadyGiven = wallet.welcomeBonuses.some(
      (entry) => entry.userId.toString() === newUserId.toString()
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
      return { success: false, starsGiven: 0, message: "User or wallet not found" };
    }

    // Credit stars to user's wallet
    user.userWalletDetails.totalStars += starsToGive;
    await user.userWalletDetails.save();

    // Deduct stars from superadmin wallet
    wallet.totalStars -= starsToGive;

    // Add to welcomeBonuses instead of transactions
    wallet.welcomeBonuses.push({
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

const generateCoupons=async(req,res)=>{
  const{couponCount,perStarCount,generationDate,expiryDate}=req.body;
  try {
   const couponsToCreate=[];
   for (let i=0;i<couponCount;i++){
     const code = generateRandomCode(10);
     couponsToCreate.push({
      code,
      perStarCount,
         generationDate: new Date(generationDate),
        expiryDate: expiryDate ? new Date(expiryDate) : undefined
     })
   } 

   
    const createdCoupons = await Coupon.insertMany(couponsToCreate);
     return res.status(201).json({
      message: "Coupons generated successfully",
      count: createdCoupons.length,
      coupons: createdCoupons.map(c => c.code),
    });
  } catch (error) {
        console.error("Error generating coupons:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}



export { registerSuperAdmin, superAdminLogin, getAllAdmins, toggleUserStatus,toggleAdminStatus,getSuperAdminWallet,setWelcomeBonusAmount,getBonusHistory ,generateCoupons,distributeWelcomeBonus};
