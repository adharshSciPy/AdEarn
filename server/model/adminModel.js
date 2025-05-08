import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const defaultRole = process.env.ADMIN_ROLE;

const adminSchema = new Schema(
  {
    adminEmail: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: adminRole,
    },
  },
  { timestamps: true }
);
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
