import mongoose,{Schema} from "mongoose";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const userRole=process.env.USER_ROLE;
const userSchema=new Schema({
    role:{
        type:Number,
        default:userRole
    },
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
    gender:{
        type:String
    },
    state:{
        type:String
    },
    district:{
        type:String
    },
    location:{
        type:String
    },
    pinCode:{
        type:String
    },
    fieldOfInterest:{
        type:Array
    },
    maritalStatus:{
        type:String
    },
    highestEducation:{
        type:String
    },
    profession:{
        type:String
    },
    employedIn:{
        type:String
    }

},{timestamps:true})
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next()
        console.log("Password before hashing",this.password);
     try {
        this.password=await bcrypt.hash(this.password,10);
        console.log("Password after hashing:", this.password);
        next();
     } catch (error) {
        console.error("Error hashing password:", error);
        next(error);
     }
    
});
userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
    
}