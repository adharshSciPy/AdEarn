import mongoose, { Schema } from "mongoose";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { type } from "os";
dotenv.config();

const userRole = process.env.USER_ROLE;
// console.log("user role",process.env.USER_ROLE)
const userSchema = new Schema(
  {
    role: {
      type: Number,
      default: userRole,
    },
    uniqueUserId: {
      type: String,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },

    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
    },
    state: {
      type: String,
    },
    district: {
      type: String,
    },
    location: {
      type: String,
    },
    locationCoordinates: {
      type: {
        lat: { type: Number },
        lng: { type: Number },
      },
      default: null,
    },
    pinCode: {
      type: Number,
    },
    fieldOfInterest: {
      type: Array,
    },
    maritalStatus: {
      type: String,
    },
    highestEducation: {
      type: String,
    },
    profession: {
      type: String,
    },
    employedIn: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    isUserEnabled: {
      type: Boolean,
      default: true,
    },
    lastSeen: {
      type: String,
      default: null,
    },
    ads: [
      {
        type: Schema.Types.ObjectId,
        ref: "Ad",
      },
    ],
    myReferalCode: {
      type: String,
      unique: true,
    },
    referalCode: {
      type: String,
    },
    referedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    referredUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    referalCredits: {
      type: Number,
      default: 0,
    },
    kycDetails: {
      type: Schema.Types.ObjectId,
      ref: "kyc",
    },
    userWalletDetails: {
      type: Schema.Types.ObjectId,
      ref: "UserWallet",
    },
    viewedAds: [
      {
        adId: { type: Schema.Types.ObjectId, ref: "Ad" },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
    isSubscribed: {
       type: Boolean,
        default: true
       },
    
  subscriptionStartDate: {
     type: Date,
      default: Date.now 
    },
    subscriptionEndDate: {
       type: Date
       },
  },
  { timestamps: true }
);
// password hashing
userSchema.pre("save", async function (next) {
   if (this.isNew) {
    this.subscriptionEndDate = new Date(this.subscriptionStartDate.getTime() + 365 * 24 * 60 * 60 * 1000); // +1 year
  }
  if (!this.isModified("password")) return next();
  console.log("Password before hashing", this.password);
  try {
    this.password = await bcrypt.hash(this.password, 10);
    console.log("Password after hashing:", this.password);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});
// password comparing
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
// generating token
userSchema.methods.generateAcessToken = function () {
  const payload = { id: this._id, email: this.email };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return accessToken;
};
// refreshing token
userSchema.methods.generateRefreshToken = function () {
  const payload = { id: this._id };
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  }); 
  return refreshToken;
};
// subscription checking
userSchema.methods.hasActiveSubscription = function () {
  const now = new Date();
  return this.isSubscribed && this.subscriptionEndDate && now <= this.subscriptionEndDate;
};



export default mongoose.model("User", userSchema);
