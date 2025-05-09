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
  
     
      const role = Number(process.env.ADMIN_ROLE) || 1;
  
     
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
  export {registerAdmin}