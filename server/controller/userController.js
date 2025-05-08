import User from "../model/userModel.js";
import jwt from "jsonwebtoken";

// register user with otp only
const registerUser=async(req,res)=>{
    const{phoneNumber}=req.body;
    try {
        if(!phoneNumber)
            return res.status(400).json({message:"Phone Number is required"})
        const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        if(!phoneRegex.test(phoneNumber)){
            return res.status(400).json({message:"Invalid Phone Number format"})
        }
      const existingUser=await User.findOne({phoneNumber});
      if(existingUser){
        return res.status(400).json({message:"Phone Number already exists"})
      }
      const user=await User.create({
        phoneNumber
      });
      const token=jwt.sign(
        {id:user._id,role:user.role},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"7d"}
      )
      return res.status(200).json({message:"User registered succesfully",
        user:{
            id:user._id,
            phoneNumber:user.phoneNumber,
            userRole:user.role
        },
        token
      })
    }  catch (err) {
        console.error("Error during registration:", err);
        return res
          .status(500)
          .json({ message: `Internal Server Error: ${err.message}` });
      }
}
// edit user
// const editUser=async(req,res)=>{
//     const{id}=req.params;
//     const{email,password,referalCode}
// }
export {registerUser}