import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const superAdminRole=process.env.SUPER_ADMIN_ROLE;
 
const superAdminSchema=new Schema({
    role:{
        type:Number,
        default:superAdminRole
    },
    email:{
        type:String
    },
    password:{
        type:String
    }
},{timestamps:true})

superAdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } catch (error) {
      return next(error);
    }
  });

superAdminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
      {
        id: this._id,
        email: this.email,
        role: this.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  };
  superAdminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  export default mongoose.model("SuperAdmin", superAdminSchema);