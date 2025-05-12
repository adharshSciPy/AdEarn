import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import { passwordValidator } from "../utils/passwordValidator.js";
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
    const user = await User.create({
      phoneNumber,
    });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    const myReferalCode = await generateReferalCode();
    user.myReferalCode = myReferalCode;
    await user.save();

    return res.status(200).json({
      message: "User registered succesfully",
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        role:user.role,
        myReferalCode: user.myReferalCode,
      },
      token,
    });
  } catch (err) {
    console.error("Error during registration:", err);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${err.message}` });
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
    maritalStatus,
    highestEducation,
    profession,
    employedIn,
  } = req.body;
  try {
    if(!id){
        return res.status(400).json({message:"Please provide the id"})
    }
    const user=await User.findById(id);
    if(!user){
        return res.status(400).json({message:"User not found ,Please check the id"});

    }
    if (referalCode && !user.referedBy) {
        console.log("Referral code logic executing...");
      
        const referringUser = await User.findOne({ myReferalCode: referalCode });
        if (!referringUser) {
          return res.status(400).json({ message: "Invalid referral code" });
        }
      
        if (referringUser._id.toString() === id) {
          return res.status(400).json({ message: "Cannot use your own referral code" });
        }
      
        const alreadyReferred = referringUser.referredUsers.some(
          (refId) => refId.toString() === user._id.toString()
        );
      
        if (alreadyReferred) {
          return res.status(400).json({ message: "Already used the referral code" });
        }
      
        user.referedBy = referringUser._id;
        referringUser.referredUsers.push(user._id);
        await referringUser.save();
      }
      
    if (email) user.email = email;
    if (password){
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
    if (location) user.location = location;
    if (pinCode) user.pinCode = pinCode;
    if (fieldOfIntrest) user.fieldOfInterest = fieldOfIntrest;
    if (maritalStatus) user.maritalStatus = maritalStatus;
    if (highestEducation) user.highestEducation = highestEducation;
    if (profession) user.profession = profession;
    if (employedIn) user.employedIn = employedIn;

    await user.save();
    
    user.password = undefined;
      return res.status(200).json({message:"User edited Succefully",
        user
      })

  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ 
      message: "Error updating user",
      error: error.message 
    });
  }
};
// user login
const userLogin=async(req,res)=>{
    const{email,password}=req.body;
    try {
       if(!email?.trim() ||!password?.trim()){
        return res.status(400).json({message:"All fields are required"});

       } 
       const user=await User.findOne({email});
       if(!user){
        return res.status(404).json({ message: "Email doesn't exists" });
       }
       const isMatch = await user.isPasswordCorrect(password);
       if (!isMatch) {
         return res.status(401).json({ message: "Invalid credentials" });
       }
       const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();
    const userObj=user.toObject();
    delete userObj.password
    return res.status(200).json({
        message: "Login successful",
        user:userObj,
        accessToken,
        refreshToken,
        role:process.env.USER_ROLE
      });
    }catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
          message: "Login failed",
          error: error.message,
    })
}
}
// user logout
const userLogout=async(req,res)=>{
    const{id}=req.params;
    try {
        const user=await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.refreshToken = null;
        await user.save();
    
        res.clearCookie("refreshToken"); // if used in cookies
    
        return res.status(200).json({ message: "User logged out successfully" });
      } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

}
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
        const relativePath = req.file.path.replace(/\\/g, '/').split('userUploads')[1];
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
export { registerUser,editUser,userLogin ,userLogout,uploadProfilePicture};
