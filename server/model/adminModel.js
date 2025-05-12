import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminRole = process.env.ADMIN_ROLE;

const adminSchema = new Schema(
  {
    phoneNumber:{
        type: Number,
      
    },
    adminEmail: {
      type: String,
    
    },
    password: {
      type: String,
     
    },
    adminRole: {
      type: Number,
      default: adminRole,
    },
        otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },

  },
  { timestamps: true }
);
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } catch (error) {
      return next(error);
    }
  });

adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
      {
        id: this._id,
        firstName: this.firstName,
        userEmail: this.userEmail,
        role: this.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  };
  adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  
  export const Admin = mongoose.model("Admin", adminSchema);
