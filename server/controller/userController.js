import User from "../model/userModel.js";
import jwt from "jsonwebtoken";

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
        userRole: user.role,
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
    emplpoyedIn,
  } = req.body;
  try {
    if(!id){
        return res.status(400).json({message:"Please provide the id"})
    }
    const user=await User.findById(id);
    if(!user){
        return res.status(400).json({message:"User not found ,Please check the id"});

    }
    const updateFields = {};
    if (email) updateFields.email = email;
    if (password) updateFields.password = password; 
    if (referalCode) updateFields.myReferalCode = referalCode;
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (gender) updateFields.gender = gender;
    if (state) updateFields.state = state;
    if (district) updateFields.district = district;
    if (location) updateFields.location = location;
    if (pinCode) updateFields.pinCode = pinCode;
    if (fieldOfIntrest) updateFields.fieldOfInterest = fieldOfIntrest;
    if (maritalStatus) updateFields.maritalStatus = maritalStatus;
    if (highestEducation) updateFields.highestEducation = highestEducation;
    if (profession) updateFields.profession = profession;
    if (emplpoyedIn) updateFields.employedIn = emplpoyedIn;
    const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true,runValidators:true }
      );
      updatedUser.password = undefined;
      return res.status(200).json({message:"User edited Succefully",
        user:updatedUser
      })

  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ 
      message: "Error updating user",
      error: error.message 
    });
  }
};

export { registerUser,editUser };
