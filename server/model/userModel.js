import mongoose, { Schema } from "mongoose";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const userRole = process.env.USER_ROLE;
const userSchema = new Schema(
  {
    role: {
      type: Number,
      default: userRole,
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
    myReferalCode: {
      type: String,
      unique: true,
    },
    referalCode:{
type:String
    },
    referedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    referredUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    referalCredits:{
        type:Number,
        default:0
    }
  },
  { timestamps: true }
);
// password hashing
userSchema.pre("save", async function (next) {
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

export default mongoose.model("User", userSchema);
