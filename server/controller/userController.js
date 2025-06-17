import User from "../model/userModel.js";
import kyc from "../model/kycModel.js";
import jwt from "jsonwebtoken";
import path from "path";
import { passwordValidator } from "../utils/passwordValidator.js";
import { Admin } from "../model/adminModel.js";
import superAdminModel from "../model/superAdminModel.js"
import AdminWallet from "../model/adminwalletModel.js"
import {UserWallet} from "../model/userWallet.js"
import SuperAdminWallet from "../model/superAdminWallet.js";
import axios from "axios";
import mongoose from "mongoose";
import { Ad } from "../model/AdsModel.js";
import Coupon from "../model/couponModel.js"
import { distributeWelcomeBonus } from './superAdminController.js';
import  Notification  from "../model/notificationsModel.js";
import  {sendNotification } from "../utils/sendNotifications.js";
import Redis from "ioredis";
import crypto from "crypto";
import config from "../config.js";


// function to create referal code
const generateReferalCode = async (length = 6) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
  let code;
  let exists = true;
  while (exists) {
    code = "";
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const isExisting = await User.findOne({ myReferalCode: code });
    if (!isExisting) {
      exists = false;
    }
  }
  return code;
};
// function to generate unique user id
const generateUniqueUserId = async () => {
  let unique = false;
  let uniqueCode;

  while (!unique) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    uniqueCode = `#${randomNumber}`;

    const existingUser = await User.findOne({ uniqueUserId: uniqueCode });
    if (!existingUser) {
      unique = true;
    }
  }

  return uniqueCode;
};
// to format the time
const formatTo12HourTime = (date) => {
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const USER_ROLE=process.env.USER_ROLE;
const ADMIN_ROLE=process.env.ADMIN_ROLE;
const SUPER_ADMIN_ROLE=process.env.SUPER_ADMIN_ROLE;
// const redis = new Redis("redis-cli -u redis://default:NE9Iv5GnPdF1RH12Vg3bJoiZ77Cx7WrZ@redis-16497.c10.us-east-1-4.ec2.redns.redis-cloud.com:16497"); 
const redis = new Redis(config.REDIS_URL);





// register user with otp only
const registerUser = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    if (!phoneNumber)
      return res.status(400).json({ message: "Phone Number is required" });

    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid Phone Number format" });
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: "Phone Number already exists" });
    }

    const user = await User.create({ phoneNumber });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const myReferalCode = await generateReferalCode();
    user.myReferalCode = myReferalCode;

    const wallet = await UserWallet.create({ totalStars: 0 });
    user.userWalletDetails = wallet._id;

    const uniqueUserId = await generateUniqueUserId();
    user.uniqueUserId = uniqueUserId;

    await user.save();

    // ✅ Distribute welcome bonus
    let bonusResult = { success: false, starsGiven: 0, message: "Not applied" };
    try {
      bonusResult = await distributeWelcomeBonus(user._id);
    } catch (bonusErr) {
      console.error("Welcome bonus distribution failed:", bonusErr.message);
      bonusResult = { success: false, starsGiven: 0, message: bonusErr.message };
    }

    // ✅ Populate wallet with updated stars
    await user.populate('userWalletDetails');

    return res.status(200).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role,
        myReferalCode: user.myReferalCode,
        uniqueUserId: user.uniqueUserId,
        wallet: {
          totalStars: user.userWalletDetails.totalStars,
          walletId: user.userWalletDetails._id,
        },
      },
      token,
      bonus: bonusResult, // 👈 Bonus info with starsGiven
    });
  } catch (err) {
    console.error("Error during registration:", err);
    return res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
};

// dummy
const sendOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    if (!phoneNumber)
      return res.status(400).json({ message: "Phone Number is required" });

    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid Phone Number format" });
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: "Phone Number already registered" });
    }

    const otp =
      config.USE_OTP_TEST_MODE === 'true' && phoneNumber === config.OTP_TEST_NUMBER
        ? config.OTP_TEST_VALUE
        : crypto.randomInt(100000, 999999).toString();

    await redis.set(`otp:${phoneNumber}`, otp, "EX", 300);
    console.log(`✅ OTP ${otp} saved for ${phoneNumber}`);

    if (config.USE_OTP_TEST_MODE !== 'true') {
      await axios.get("https://api.msg91.com/api/v5/otp", {
        params: {
          authkey: config.MSG91_AUTH_KEY,
          mobile: phoneNumber,
          otp,
          template_id: config.MSG91_TEMPLATE_ID,
        },
      });
    }

    return res.status(200).json({
      message: "OTP sent successfully",
      ...(config.USE_OTP_TEST_MODE === 'true' ? { otp } : {}),
    });
  } catch (err) {
    console.error("❌ Error sending OTP:", err.response?.data || err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// helper function to create user
const createUserAndRespond = async (phoneNumber, res) => {
  try {
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ phoneNumber });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const myReferalCode = await generateReferalCode();
    user.myReferalCode = myReferalCode;

    const wallet = await UserWallet.create({ totalStars: 0 });
    user.userWalletDetails = wallet._id;

    const uniqueUserId = await generateUniqueUserId();
    user.uniqueUserId = uniqueUserId;

    await user.save();

    let bonusResult = { success: false, starsGiven: 0, message: "Not applied" };
    try {
      bonusResult = await distributeWelcomeBonus(user._id);
    } catch (bonusErr) {
      console.error("Bonus failed:", bonusErr.message);
    }

    await user.populate('userWalletDetails');

    return res.status(200).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role,
        myReferalCode: user.myReferalCode,
        uniqueUserId: user.uniqueUserId,
        wallet: {
          totalStars: user.userWalletDetails.totalStars,
          walletId: user.userWalletDetails._id,
        },
      },
      token,
      bonus: bonusResult,
    });
  } catch (err) {
    console.error("User creation error:", err);
    return res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
};

// verifyotp
const verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    // 🔁 Test mode OTP auto-pass
    if (
      config.USE_OTP_TEST_MODE === 'true' &&
      phoneNumber === config.OTP_TEST_NUMBER &&
      otp === config.OTP_TEST_VALUE
    ) {
      return await createUserAndRespond(phoneNumber, res);
    }

    const savedOtp = await redis.get(`otp:${phoneNumber}`);
    if (!savedOtp || savedOtp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await redis.del(`otp:${phoneNumber}`);
    return await createUserAndRespond(phoneNumber, res);
  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// edit user
const editUser = async (req, res) => {
  const { id } = req.params;
  const {
    email,
    password,
    referalCode,
    firstName,
    lastName,
    gender,
    state,
    district,
    location,
    pinCode,
    fieldOfIntrest,
    subcategory,  
    maritalStatus,
    highestEducation,
    profession,
    employedIn,
    city,        
  } = req.body;
  try {
    if (!id) {
      return res.status(400).json({ message: "Please provide the id" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found ,Please check the id" });
    }
    if (referalCode && !user.referedBy) {
      console.log("Referral code logic executing...");

      const referringUser = await User.findOne({ myReferalCode: referalCode });
      if (!referringUser) {
        return res.status(400).json({ message: "Invalid referral code" });
      }

      if (referringUser._id.toString() === id) {
        return res
          .status(400)
          .json({ message: "Cannot use your own referral code" });
      }

      const alreadyReferred = referringUser.referredUsers.some(
        (refId) => refId.toString() === user._id.toString()
      );

      if (alreadyReferred) {
        return res
          .status(400)
          .json({ message: "Already used the referral code" });
      }

      user.referedBy = referringUser._id;
      referringUser.referredUsers.push(user._id);
      await referringUser.save();
    }

    if (email) user.email = email;
    if (password) {
      const isValidPassword = passwordValidator(password);
      if (!isValidPassword) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character",
        });
      }
      user.password = password;
    }
    if (referalCode) user.referalCode = referalCode;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (gender) user.gender = gender;
    if (state) user.state = state;
    if (district) user.district = district;
    if (location) {
      user.location = location;
      try {
        const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: location,
            format: "json",
            limit: 1,
          },
          headers: {
            "User-Agent": "AdEarn", // Required
          },
        });

        if (geoRes.data && geoRes.data.length > 0) {
          const { lat, lon } = geoRes.data[0];
          user.locationCoordinates = {
            lat: parseFloat(lat),
            lng: parseFloat(lon),
          };
        }
      } catch (geoError) {
        console.error("Geocoding error:", geoError.message);
        // Optionally: you can continue without failing
      }
    };
    if (pinCode) user.pinCode = pinCode;
    if (fieldOfIntrest) user.fieldOfInterest = fieldOfIntrest;
    if (subcategory) user.subcategory = subcategory;  // Added subcategory update
    if (maritalStatus) user.maritalStatus = maritalStatus;
    if (highestEducation) user.highestEducation = highestEducation;
    if (profession) user.profession = profession;
    if (employedIn) user.employedIn = employedIn;
    if (city) user.city = city;  // Added city update

    await user.save();

    user.password = undefined;
    return res.status(200).json({ message: "User edited Successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};
// user login
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email doesn't exists" });
    }
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
     if (user.isBlacklisted) {
      return res
        .status(403)
        .json({ message: "You are blacklisted by the admin and cannot login." });
    }
    if (!user.isUserEnabled) {
      return res
        .status(400)
        .json({ message: "User login has been blocked by Admin" });
    }
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();
    const userObj = user.toObject();
    delete userObj.password;
    return res.status(200).json({
      message: "Login successful",
      user: userObj,
      accessToken,
      refreshToken,
      role: process.env.USER_ROLE,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};
// user logout
const userLogout = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.refreshToken = null;
    user.lastSeen = formatTo12HourTime(new Date());
    await user.save();

    res.clearCookie("refreshToken"); // if used in cookies

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// user profile picture upload
const uploadProfilePicture = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert filesystem path to web-accessible URL
    const relativePath = req.file.path
      .replace(/\\/g, "/")
      .split("userUploads")[1];
    const imageUrl = `/userUploads${relativePath}`;

    user.profileImg = imageUrl;
    await user.save();

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      profileImg: imageUrl, // Now returns a web-accessible URL
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// kyc details
const addKyc = async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    dateOfBirth,
    gender,
    nationality,
    guardianName,
    email,
    phoneNumber,
    permanentAddress,
    currentAddress,
    documentType,
    documentNumber,
    bankName,
    accountNumber,
    ifscCode,
    city,state
  } = req.body;

  const { io, connectedUsers } = req;

  // Validate required fields
  const requiredFields = {
    fullName,
    dateOfBirth,
    gender,
    nationality,
    guardianName,
    email,
    phoneNumber,
    permanentAddress,
    currentAddress,
    documentType,
    documentNumber,
    bankName,
    accountNumber,
    ifscCode,
    city,state
  };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value || value.trim() === "") {
      return res.status(400).json({ message: `${key} is required.` });
    }
  }

  if (!req.file) {
    return res.status(400).json({ message: "Document file is required." });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Normalize file path
    const fullPath = req.file.path.replace(/\\/g, "/");
    const documentFile = `/userKyc/${path.basename(fullPath)}`;

    // Prepare KYC data
    const kycData = {
      userId: user._id,
      fullName,
      dob: dateOfBirth,
      gender,
      nationality,
      guardianName,
      email,
      phoneNumber,
      permanentAddress,
      currentAddress,
      documentType,
      documentNumber,
      documentFile,
      bankName,
      accountNumber,
      ifscCode,
      city,state,
      kycStatus: "pending",
      kycSubmittedAt: new Date(),
    };

    let kycDetails;

    if (user.kycDetails) {
      // Update existing KYC
      kycDetails = await kyc.findByIdAndUpdate(
        user.kycDetails,
        { $set: kycData },
        { new: true }
      );

      if (!kycDetails) {
        // If reference exists but KYC document not found, create new one
        kycDetails = await kyc.create(kycData);
        user.kycDetails = kycDetails._id;
        await user.save();
      }
    } else {
      // Create new KYC
      kycDetails = await kyc.create(kycData);
      user.kycDetails = kycDetails._id;
      await user.save();
    }

    // Notify all admins
    const adminUsers = await Admin.find({ adminRole: ADMIN_ROLE });
    const message = `${user.firstName} ${user.lastName || ""} has submitted a KYC request.`;
    const link=`/VerifyKYC/${user._id}`
    // ✅ Only use sendNotification (do NOT insert manually)
    const notifyAdmins = adminUsers.map((admin) =>
      sendNotification(admin._id, ADMIN_ROLE, message, io, connectedUsers,link)
    );
    await Promise.all(notifyAdmins);

    return res.status(200).json({
      message: "KYC submitted successfully",
      kycDetails: kycDetails,
    });
  } catch (error) {
    console.error("Error submitting KYC:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserByUniqueId = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findOne({ uniqueUserId: id });
    if (!user) {
      return res
        .status(400)
        .json({ messsage: "No User Found ,Please check the ID" });
    }
    return res
      .status(200)
      .json({ message: "User fetched succesfully", data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// to buy stars
const starBuy = async (req, res) => {
  const { id } = req.params;
  const { starsNeeded } = req.body;
  const { io, connectedUsers } = req;

  if (!starsNeeded || starsNeeded <= 0) {
    return res.status(400).json({ message: "Invalid starsNeeded value" });
  }

  try {
    const conversionRate = 4;
    const percentageToUser = 60;

    const totalStarsGenerated = starsNeeded * (100 / percentageToUser);
    const rupeesToPay = totalStarsGenerated / conversionRate;
    const userShare = starsNeeded;
    const superAdminShare = totalStarsGenerated * 0.2;
    const adminShare = totalStarsGenerated * 0.1;
    const referredUserShare = totalStarsGenerated * 0.1;

    const user = await User.findById(id)
      .populate("userWalletDetails")
      .populate("referedBy");

    if (!user) return res.status(404).json({ message: "User not found" });

    const wallet = user.userWalletDetails;
    if (!wallet) return res.status(404).json({ message: "User wallet not found" });

    // Update user wallet
    wallet.totalStars += Math.floor(userShare);
    wallet.starBought.push({
      starsNeeded: Math.floor(userShare),
      paymentStatus: "completed",
    });
    await wallet.save();

    let referredUserNotification = null;

    // Referral logic
    if (user.referedBy) {
      const referredUser = await User.findById(user.referedBy).populate("userWalletDetails");

      if (referredUser?.userWalletDetails) {
        const referredWallet = referredUser.userWalletDetails;

        referredWallet.totalStars += Math.floor(referredUserShare);
        referredWallet.starBought.push({
          starsNeeded: Math.floor(referredUserShare),
          paymentStatus: "completed",
        });
        referredWallet.referralTransactions.push({
          fromUser: user._id,
          starsReceived: Math.floor(referredUserShare),
        });

        await referredWallet.save();

        referredUser.referalCredits += Math.floor(referredUserShare);
        await referredUser.save();

        // Create notification for referred user
        referredUserNotification = sendNotification(
          referredUser._id,
          USER_ROLE,
          `You received ${Math.floor(referredUserShare)} stars as referral bonus from ${user.firstName}'s purchase!`,
          io,
          connectedUsers
        );
      }
    } else {
      const firstUser = await User.findOne().sort({ createdAt: 1 }).populate("userWalletDetails");

      if (firstUser?.userWalletDetails) {
        const firstWallet = firstUser.userWalletDetails;

        firstWallet.totalStars += Math.floor(referredUserShare);
        firstWallet.starBought.push({
          starsNeeded: Math.floor(referredUserShare),
          paymentStatus: "completed",
        });
        firstWallet.referralTransactions.push({
          fromUser: user._id,
          starsReceived: Math.floor(referredUserShare),
        });

        await firstWallet.save();
      }
    }

    // Admin wallet
    let adminWallet = await AdminWallet.findOne();
    if (!adminWallet) {
      adminWallet = new AdminWallet({
        totalStars: Math.floor(adminShare),
        transactions: [{
          userId: user._id,
          starsReceived: Math.floor(adminShare),
        }],
      });
    } else {
      adminWallet.totalStars += Math.floor(adminShare);
      adminWallet.transactions.push({
        userId: user._id,
        starsReceived: Math.floor(adminShare),
      });
    }
    await adminWallet.save();

    // Super admin wallet
    let superAdminWallet = await SuperAdminWallet.findOne();
    if (!superAdminWallet) {
      superAdminWallet = new SuperAdminWallet({
        totalStars: Math.floor(superAdminShare),
        transactions: [{
          userId: user._id,
          starsReceived: Math.floor(superAdminShare),
        }],
      });
    } else {
      superAdminWallet.totalStars += Math.floor(superAdminShare);
      superAdminWallet.transactions.push({
        userId: user._id,
        starsReceived: Math.floor(superAdminShare),
      });
    }
    await superAdminWallet.save();

    // Get admins and super admin
    const adminUsers = await Admin.find({ adminRole: ADMIN_ROLE });
    const superAdminUser = await superAdminModel.findOne({ role: SUPER_ADMIN_ROLE });

    // Prepare all notifications
    const notificationsToSend = [
      sendNotification(
        user._id,
        USER_ROLE,
        `You successfully purchased ${Math.floor(userShare)} stars.`,
        io,
        connectedUsers
      ),
      ...adminUsers.map((admin) =>
        sendNotification(
          admin._id,
          ADMIN_ROLE,
          `You received ${Math.floor(adminShare)} stars from ${user.firstName} ${user.lastName}'s purchase. (UserId: ${user._id})`,
          io,
          connectedUsers
        )
      ),
      sendNotification(
        superAdminUser?._id,
        SUPER_ADMIN_ROLE,
        `You received ${Math.floor(superAdminShare)} stars from ${user.firstName} ${user.lastName}'s purchase. (UserId: ${user._id})`,
        io,
        connectedUsers
      ),
    ];

    // Add referred user notification if it exists
    if (referredUserNotification) {
      notificationsToSend.push(referredUserNotification);
    }

    await Promise.all(notificationsToSend);

    return res.status(200).json({
      message: "Star purchase successful",
      starsRequested: starsNeeded.toString(),
      totalStarsGenerated: Math.floor(totalStarsGenerated),
      userShare: Math.floor(userShare),
      adminShare: Math.floor(adminShare),
      superAdminShare: Math.floor(superAdminShare),
      referredUserShare: Math.floor(referredUserShare),
      amountToPay: rupeesToPay,
    });

  } catch (error) {
    console.error("Error in starBuy:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



// to post ads using stars or amount with automated views 
// const adPost=async(req,res)=>{
//   const{id}=req.params;
//   const{userViewsNeeded}=req.body;
//   if(!id || userViewsNeeded){
//     return res.status(400).json({message:"Id or Required views invalid"})

//   }
//   try {
//   let requiredViews=userViewsNeeded;
//   const starsDeductionRate=0.6
//   const starsToBeDeducted=(requiredViews*starsDeductionRate);
//   const user=await User.findById(id);
//   if(!user){
//     return res.status(400).json({message:"User not found"})
//   }
//   const userStars=user.populate("UserWallet");
//   const neededStars=starsToBeDeducted-userStars;

//   if(!userStars||userStars.totalStars<starsToBeDeducted){
//     return res.status(402).json({message:`Insuffient stars.You need ${neededStars} stars to proceed`});
//   }
//   const balanceStars=userStars-neededStars;
//   await user.save();
  
//   } catch (error) {
    
//   }


// }
// to fetch user viewed ads
const getViewedAds = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id).populate("viewedAds.adId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Now populate ad refs inside each ad
    const adIds = user.viewedAds.map((entry) => entry.adId._id);

    const ads = await Ad.find({ _id: { $in: adIds } })
      .populate("imgAdRef")
      .populate("videoAdRef")
      .populate("surveyAdRef");

    // Map ads into a lookup table for easier matching
    const adMap = new Map();
    for (const ad of ads) {
      adMap.set(ad._id.toString(), ad);
    }

    const viewedAds = user.viewedAds.map((entry) => {
      const ad = adMap.get(entry.adId._id.toString());

      const adType = ad?.imgAdRef
        ? "Image"
        : ad?.videoAdRef
        ? "Video"
        : ad?.surveyAdRef
        ? "Survey"
        : "Unknown";

      return {
        adId: ad?._id,
        type: adType,
        title: ad?.title || "",
        viewedAt: entry.viewedAt,
        fullAdData: ad || null,
      };
    });

    return res.status(200).json({ viewedAds });
  } catch (err) {
    console.error("Error fetching viewed ads:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
const redeemCoupon = async (req, res) => {
  const { couponCode } = req.body;
  const userId = req.params.id;

  try {
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (coupon.isClaimed) {
      return res.status(400).json({ message: "Coupon already claimed" });
    }

    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    // Find the user
    const user = await User.findById(userId).populate("userWalletDetails");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure wallet exists
    let wallet = user.userWalletDetails;
    if (!wallet) {
      wallet = new UserWallet();
      await wallet.save();
      user.userWalletDetails = wallet._id;
      await user.save();
    }

    // Update wallet stars
    wallet.totalStars += coupon.perStarCount;
    wallet.couponStars += coupon.perStarCount;
    await wallet.save();

    // Mark coupon as claimed
    coupon.isClaimed = true;
    await coupon.save();

    return res.status(200).json({
      message: "Coupon redeemed successfully",
      starsAdded: coupon.perStarCount,
      totalStars: wallet.totalStars,
      couponStars: wallet.couponStars,
    });
  } catch (error) {
    console.error("Error redeeming coupon:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// to fetch user wise wallet
const fetchUserWallet=async(req,res)=>{
const {id:userId}=req.params;
try {
  const user=await User.findById(userId).populate("userWalletDetails");
  if(!user){
return res.status(400).json({message:"User Not Found"})
  }
 if (!user.userWalletDetails) {
      return res.status(404).json({ message: "User wallet not found" });
    }
    const { userWalletDetails, ...userWithoutWallet } = user.toObject();
      return res.status(200).json({
      message: "User wallet fetched successfully",
      wallet: user.userWalletDetails,
       user: userWithoutWallet,
    });

} catch (error) {
   console.error("Error fetching user wallet:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
}
}
// to display the ads posted by the user...
const fetchAllMyAds = async (req, res) => {
  const { userId } = req.params;

  try {
  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Fetch all Ads that belong to the user and populate references
    const userAds = await Ad.find({ _id: { $in: user.ads } })
      .populate("imgAdRef")
      .populate("videoAdRef")
      .populate("surveyAdRef");

    return res.status(200).json({
      message: "Ads fetched successfully",
      data: {
        count: userAds.length,
        ads: userAds
      }
    });
  } catch (error) {
    console.error("Error fetching user ads:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// to display single ad posted by the user 
const fetchMySingleAd = async (req, res) => {
  const { userId, adId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if adId belongs to the user
    if (!user.ads.includes(adId)) {
      return res.status(403).json({ message: "Unauthorized to view this ad" });
    }

    const ad = await Ad.findById(adId)
      .populate("imgAdRef")
      .populate("videoAdRef")
      .populate("surveyAdRef");

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    return res.status(200).json({
      message: "Ad fetched successfully",
      ad
    });
  } catch (error) {
    console.error("Error fetching single ad:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export {
  registerUser,
  editUser,
  userLogin,
  userLogout,
  uploadProfilePicture,
  addKyc,
  getUserByUniqueId,
  starBuy,
  getViewedAds,
  redeemCoupon,
  fetchUserWallet,
  fetchAllMyAds,
  fetchMySingleAd,
  sendOTP,
  verifyOTP
};
