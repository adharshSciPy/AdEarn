import {Admin} from "../model/adminModel.js"
import jwt from "jsonwebtoken"
import { passwordValidator } from "../utils/passwordValidator.js";

const registerAdmin = async (req, res) => {
    const { phoneNumber, password } = req.body;
  
    try {
      // Validate inputs
      if (!phoneNumber || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      if (!passwordValidator(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.",
        });
      }
  
      
      const existingAdmin = await Admin.findOne({ phoneNumber });
      if (existingAdmin) {
        return res.status(409).json({ message: "Phone number already in use" });
      }
  
     
      const role = Number(process.env.ADMIN_ROLE) || 400;
  
     
      const admin = await Admin.create({ phoneNumber, password, role });
  
      // Return admin without password
      const createdAdmin = await Admin.findById(admin._id).select("-password");
      if (!createdAdmin) {
        return res.status(500).json({ message: "Admin registration failed" });
      }
  
      res.status(201).json({
        message: "Admin registered successfully",
        data: createdAdmin,
      });
    } catch (error) {
      console.error("Admin Registration Error:", error);
      return res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  };
  const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { adminEmail, password } = req.body;

  try {
 
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update email if provided
    if (adminEmail) {
      admin.adminEmail = adminEmail;
    }

    if (password) {
      if (!passwordValidator(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character.",
        });
      }
    }

    await admin.save();

    // Return updated admin without password
    const updatedAdmin = await Admin.findById(id).select("-password");

    res.status(200).json({
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error("Admin update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const adminLogin = async (req, res) => {
  const { adminEmail, password } = req.body;

  try {
    const admin = await Admin.findOne({ adminEmail });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await admin.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.adminRole },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      adminId: admin._id,
      adminEmail: admin.adminEmail,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export {registerAdmin,updateAdmin,adminLogin}