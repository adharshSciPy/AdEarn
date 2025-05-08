import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const defaultRole=process.env.USER_ROLE;
const userSchema=new Schema({
    phoneNumber:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    
})