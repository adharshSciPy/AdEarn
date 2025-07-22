import { PayoutRequest } from "../model/payoutRequestsModel.js";
import superAdminModel from "../model/superAdminModel.js";
import User from "../model/userModel.js";
import { convertStarsToRupees } from "../utils/convertStarsToRupees.js";
import { sendNotification } from "../utils/sendNotifications.js";
import mongoose from "mongoose";
import  sgMail from "@sendgrid/mail";
import config from "../config.js";
import SuperAdminWallet from "../model/superAdminWallet.js";
const SUPER_ADMIN_ROLE = process.env.SUPER_ADMIN_ROLE;
const USER_ROLE = process.env.USER_ROLE;
sgMail.setApiKey(config.SEND_GRID_API_KEY);

// to create a payout request
const createPayoutRequest = async (req, res) => {
  const userId = req.user.id;
  const { starCount } = req.body;
  const { io, connectedUsers } = req;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Validate User and Wallet
    const user = await User.findById(userId)
      .populate("userWalletDetails")
      .populate("kycDetails")
      .session(session);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.isBlacklisted) {
      throw new Error("User is blacklisted from making payout requests.");
    }

    if (!user.kycDetails || user.kycDetails.kycStatus !== "approved") {
      throw new Error("KYC must be approved to request a payout.");
    }

    if (!user.hasActiveSubscription()) {
      throw new Error("No active subscription.");
    }

    const wallet = user.userWalletDetails;
    if (!wallet) {
      throw new Error("User wallet not found");
    }

    // 2. Validate Star Count
    const minStars = 1000;
    if (!starCount || starCount < minStars) {
      throw new Error(`Minimum ${minStars} stars required`);
    }

    if (wallet.totalStars < starCount) {
      throw new Error("Insufficient stars in wallet.");
    }

    // 3. Create Payout Request
    const amount = convertStarsToRupees(starCount);
    const payout = await PayoutRequest.create(
      [{
        starCount,
        amount,
        requestedBy: user._id,
      }],
      { session }
    );

    // 4. Update SuperAdmin Wallet
    let superAdminWallet = await SuperAdminWallet.findOne().session(session);
    if (!superAdminWallet) {
      superAdminWallet = new SuperAdminWallet({
        totalStars: 0,
        userPayoutTransactions: []
      });
    }

    // Ensure array exists
    if (!superAdminWallet.userPayoutTransactions) {
      superAdminWallet.userPayoutTransactions = [];
    }

    // Add transaction record
    superAdminWallet.userPayoutTransactions.push({
      userId: user._id,
      starsTransferred: starCount,  // Using correct field name from schema
      amount,
      payoutId: payout[0]._id,
      timestamp: new Date()
    });

    // Update totals
    superAdminWallet.totalStars += starCount;

    // 5. Update User Wallet
    wallet.totalStars -= starCount;
    user.payoutRequests.push(payout[0]._id);

    // 6. Save All Changes
    await Promise.all([
      superAdminWallet.save({ session }),
      wallet.save({ session }),
      user.save({ session })
    ]);

    // 7. Commit Transaction
    await session.commitTransaction();

    // 8. Notify SuperAdmin
    const superAdmin = await superAdminModel.findOne({ role: SUPER_ADMIN_ROLE });
    if (superAdmin) {
      await sendNotification(
        superAdmin._id,
        SUPER_ADMIN_ROLE,
        `${user.firstName} ${user.lastName} requested a payout of ${starCount} stars (₹${amount}).`,
        io,
        connectedUsers
      );
    }

    // 9. Return Success Response
    return res.status(201).json({
      success: true,
      message: "Payout request created successfully",
      data: {
        payout: payout[0],
        newBalance: wallet.totalStars
      }
    });

  } catch (error) {
    // Handle Errors
    await session.abortTransaction();
    
    console.error("Payout Request Error:", {
      error: error.message,
      userId,
      starCount,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    return res.status(500).json({ 
      success: false,
      message: error.message || "Failed to create payout request",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    // Cleanup
    session.endSession();
  }
};
// to fetch payout unverified requests on the super admin side
const getAllUnVerifiedPayoutRequest = async (req, res) => {
  try {
    const allRequests = await PayoutRequest.find({
      isVerified: false,
    }).populate({
      path: "requestedBy",
      select: "firstName lastName email",
    });

    if (!allRequests || allRequests.length === 0) {
      return res.status(200).json({
        message: "No unverified payout requests found.",
        requests: [],
      });
    }

    const formattedRequests = allRequests
      .filter((req) => req.requestedBy) // Ensure requestedBy is populated
      .map((req) => ({
        userName: `${req.requestedBy.firstName || ""} ${
          req.requestedBy.lastName || ""
        }`.trim(),
        email: req.requestedBy.email,
        starCount: req.starCount,
        amount: req.amount,
        requestedAt: req.requestedAt,
        id: req._id,
      }));

    return res.status(200).json({
      message: "Fetched all unverified payout requests",
      requests: formattedRequests,
    });
  } catch (error) {
    console.error("Error fetching payout requests:", error.message);
    return res.status(500).json({
      message: "An error occurred while fetching payout requests",
      error: error.message,
    });
  }
};
//to view single unVerified payout request
const singleUnverifiedPayoutRequest = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Payout request ID is required" });
    }

    const payout = await PayoutRequest.findOne({ _id: id, isVerified: false })
      .populate({
        path: "requestedBy",
        select: "-password",
        populate: [{ path: "userWalletDetails" }, { path: "kycDetails" }],
      })
      .lean();

    if (!payout) {
      return res
        .status(404)
        .json({ message: "Unverified payout request not found" });
    }

    if (!payout.requestedBy) {
      return res
        .status(404)
        .json({ message: "User details not found for this request" });
    }

    return res.status(200).json({
      message:
        "Fetched unverified payout request and user details successfully",
      payoutRequestId: payout._id,
      starCount: payout.starCount,
      amount: payout.amount,
      requestedAt: payout.requestedAt,
      user: payout.requestedBy,
    });
  } catch (error) {
    console.error("Error fetching single payout request:", error.message);
    return res.status(500).json({
      message: "An error occurred while fetching the payout request",
      error: error.message,
    });
  }
};
// to verify the payout request(incomplete add the ststus on superadmin wallet)
const verifyPayoutRequest = async (req, res) => {
  const { id } = req.params;
  const { io, connectedUsers } = req;

  try {
    if (!id) {
      return res.status(400).json({ message: "Payout request ID is required" });
    }

    const updatedPayout = await PayoutRequest.findOneAndUpdate(
      { _id: id, isVerified: false },
      {
        isVerified: true,
        verifiedAt: new Date(),
          
      },
      { new: true }
    )
      .populate({
        path: "requestedBy",
        select: "-password -ads -userWalletDetails",
        populate: [{ path: "kycDetails" }],
      })
      .lean();

    if (!updatedPayout) {
      return res
        .status(404)
        .json({ message: "Payout request not found or already verified" });
    }

    const user = updatedPayout.requestedBy;

    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }

    await sendNotification(
      user._id,
      USER_ROLE,
      `Your payout request of ${updatedPayout.starCount} stars (₹${updatedPayout.amount}) has been verified.`,
      io,
      connectedUsers
    );

    if (user.email) {
      try {

await sgMail.send({
  to: user.email,
  from: config.SENDGRID_SENDER_EMAIL,
  subject: "🎉 Your Payout Request Has Been Verified!",
  text: `Hi ${user.firstName},

Your payout request for ${updatedPayout.starCount} stars (₹${updatedPayout.amount}) has been verified on ${new Date(updatedPayout.verifiedAt).toLocaleString()}.

Payout ID: ${updatedPayout._id}

Thank you for using our service!`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .email-container {
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          background: linear-gradient(135deg, #f9f9ff 0%, #f0f4ff 100%);
        }
        .header {
          background: linear-gradient(135deg, #6e8efb 0%, #4a6cf7 100%);
          color: white;
          padding: 25px;
          text-align: center;
        }
        .logo {
          max-width: 150px;
          margin-bottom: 15px;
        }
        .content {
          padding: 25px;
          background-color: white;
        }
        .payout-card {
          background: #f8f9fa;
          border-left: 4px solid #4a6cf7;
          padding: 15px;
          margin: 20px 0;
          border-radius: 0 5px 5px 0;
        }
        .payout-detail {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .payout-label {
          font-weight: 600;
          color: #555;
        }
        .payout-value {
          font-weight: 700;
          color: #222;
        }
        .button {
          display: inline-block;
          padding: 12px 25px;
          background: #4a6cf7;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          margin: 10px 5px;
          transition: all 0.3s ease;
        }
        .button:hover {
          background: #3a5ce4;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .footer {
          text-align: center;
          padding: 15px;
          font-size: 12px;
          color: #777;
          background-color: #f5f5f5;
        }
        .action-buttons {
          text-align: center;
          margin: 25px 0;
        }
        .print-only {
          display: none;
        }
        @media print {
          .no-print {
            display: none;
          }
          .print-only {
            display: block;
            text-align: center;
            margin-bottom: 20px;
            font-size: 12px;
            color: #777;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <!-- Replace with your actual logo URL -->
          <img src="https://example.com/your-logo.png" alt="Company Logo" class="logo">
          <h1>Payout Verified!</h1>
          <p>Your request has been successfully processed</p>
        </div>
        
        <div class="content">
          <p>Hi ${user.firstName},</p>
          <p>We're pleased to inform you that your payout request has been <strong>verified</strong> and will be processed shortly.</p>
          
          <div class="payout-card">
            <div class="payout-detail">
              <span class="payout-label">Stars:</span>
              <span class="payout-value">${updatedPayout.starCount}</span>
            </div>
            <div class="payout-detail">
              <span class="payout-label">Amount:</span>
              <span class="payout-value">₹${updatedPayout.amount}</span>
            </div>
            <div class="payout-detail">
              <span class="payout-label">Verified At:</span>
              <span class="payout-value">${new Date(updatedPayout.verifiedAt).toLocaleString()}</span>
            </div>
            <div class="payout-detail">
              <span class="payout-label">Payout ID:</span>
              <span class="payout-value">${updatedPayout._id}</span>
            </div>
          </div>
          
          // <div class="action-buttons">
          //   <a href="#" class="button no-print" onclick="window.print()">Print Receipt</a>
          //   <a href="${config.APP_URL}/dashboard/payouts" class="button">View in Dashboard</a>
          // </div>
          
          <div class="print-only">
            Payout receipt - Generated on ${new Date().toLocaleString()}
          </div>
          
          <p>If you have any questions about this payout, please contact our support team.</p>
          <p>Thank you for using our service!</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} AdEarn. All rights reserved.</p>
          <p>
            <a href="${config.APP_URL}/privacy" style="color: #4a6cf7; text-decoration: none;">Privacy Policy</a> | 
            <a href="${config.APP_URL}/terms" style="color: #4a6cf7; text-decoration: none;">Terms of Service</a>
          </p>
        </div>
      </div>
      
      <script>
        // This script won't work in email clients but will work if opened in browser
        document.addEventListener('DOMContentLoaded', function() {
          // Add any interactive functionality here
          console.log('Email loaded in browser');
        });
      </script>
    </body>
    </html>
  `,
});


      } catch (emailErr) {
        console.error("SendGrid Email Error:", emailErr.message);
      }
    }

    return res.status(200).json({
      message: "Payout request verified successfully",
      payoutRequest: {
        id: updatedPayout._id,
        starCount: updatedPayout.starCount,
        amount: updatedPayout.amount,
        requestedAt: updatedPayout.requestedAt,
        isVerified: updatedPayout.isVerified,
        verifiedAt: updatedPayout.verifiedAt,
        isPayoutCompleted: updatedPayout.isPayoutCompleted,
      },
      user: user,
    });
  } catch (error) {
    console.error("Error verifying payout request:", error.message);
    return res.status(500).json({
      message: "An error occurred while verifying payout request",
      error: error.message,
    });
  }
};
// to reject payout request
const rejectPayoutRequest = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const { io, connectedUsers } = req;

  if (!id || !reason) {
    return res.status(400).json({ message: "Payout ID and reason are required." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payout = await PayoutRequest.findById(id).session(session);
    if (!payout) {
      throw new Error("Payout request not found.");
    }

    if (payout.isVerified) {
      throw new Error("Cannot reject a verified payout.");
    }

    const user = await User.findById(payout.requestedBy)
      .populate("userWalletDetails")
      .session(session);
    if (!user) {
      throw new Error("Associated user not found.");
    }

    const wallet = user.userWalletDetails;
    if (!wallet) {
      throw new Error("User wallet not found.");
    }

    // Refund stars
    wallet.totalStars += payout.starCount;

    // Remove payout from user's payoutRequests safely
    if (Array.isArray(user.payoutRequests)) {
      user.payoutRequests = user.payoutRequests.filter(reqId => {
        return reqId?.toString() !== payout._id.toString();
      });
    }

    // Update super admin wallet
    const superAdminWallet = await SuperAdminWallet.findOne().session(session);
    if (superAdminWallet) {
      superAdminWallet.totalStars -= payout.starCount;

      if (Array.isArray(superAdminWallet.userPayoutTransactions)) {
        superAdminWallet.userPayoutTransactions = superAdminWallet.userPayoutTransactions.filter(tx => {
          return tx?.payoutId?.toString() !== payout._id.toString();
        });
      }

      await superAdminWallet.save({ session });
    }

    // Save all changes
    await Promise.all([
      wallet.save({ session }),
      user.save({ session }),
      PayoutRequest.findByIdAndDelete(id).session(session)
    ]);

    await session.commitTransaction();

    // Send real-time notification
    await sendNotification(
      user._id,
      USER_ROLE,
      `Your payout request of ${payout.starCount} stars (₹${payout.amount}) was rejected. Reason: ${reason}`,
      io,
      connectedUsers
    );

    // Send email notification
    if (user.email) {
      await sgMail.send({
        to: user.email,
        from: config.SENDGRID_SENDER_EMAIL,
        subject: "❌ Payout Request Rejected",
        text: `Hi ${user.firstName},\n\nYour payout request for ${payout.starCount} stars (₹${payout.amount}) has been rejected.\nReason: ${reason}\n\nThe stars have been returned to your wallet.`,
        html: `
          <p>Hi ${user.firstName},</p>
          <p>Your payout request for <strong>${payout.starCount} stars (₹${payout.amount})</strong> has been <span style="color:red;"><strong>rejected</strong></span>.</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p>The stars have been returned to your wallet.</p>
          <p>For any questions, contact support.</p>
          <p>– AdEarn Team</p>
        `
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payout request rejected and stars refunded.",
      refundStars: payout.starCount,
      reason
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Reject Payout Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to reject payout request."
    });
  } finally {
    session.endSession();
  }
};

// to get all verified payment requests
const getAllVerifiedPayoutRequests = async (req, res) => {
  try {
    const verifiedPayouts = await PayoutRequest.find({ isVerified: true })
      .populate({
        path: "requestedBy",
        select: "firstName lastName email phoneNumber kycDetails",
        populate: {
          path: "kycDetails",
        },
      })
      .lean();

    if (!verifiedPayouts.length) {
      return res
        .status(200)
        .json({ message: "No verified payout requests found", data: [] });
    }

    const responseData = verifiedPayouts.map((payout) => ({
      payoutRequestId: payout._id,
      starCount: payout.starCount,
      amount: payout.amount,
      requestedAt: payout.requestedAt,
      isVerified: payout.isVerified,
      isPayoutCompleted: payout.isPayoutCompleted,
      user: {
        _id: payout.requestedBy._id,
        firstName: payout.requestedBy.firstName,
        lastName: payout.requestedBy.lastName,
        email: payout.requestedBy.email,
        phoneNumber: payout.requestedBy.phoneNumber,
        kycDetails: payout.requestedBy.kycDetails || null,
      },
    }));

    return res.status(200).json({
      message: "Verified payout requests fetched successfully",
      count: responseData.length,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching verified payout requests:", error.message);
    return res.status(500).json({
      message: "An error occurred while fetching verified payout requests",
      error: error.message,
    });
  }
};
//to fetch single verified payout request
const getSingleVerifiedPayoutRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    const payout = await PayoutRequest.findOne({ _id: id, isVerified: true })
      .populate({
        path: "requestedBy",
        select: "firstName lastName email phoneNumber kycDetails",
        populate: {
          path: "kycDetails",
        },
      })
      .lean();

    if (!payout) {
      return res
        .status(404)
        .json({ message: "Verified payout request not found" });
    }

    const response = {
      payoutRequestId: payout._id,
      starCount: payout.starCount,
      amount: payout.amount,
      requestedAt: payout.requestedAt,
      isVerified: payout.isVerified,
      isPayoutCompleted: payout.isPayoutCompleted,
      user: {
        _id: payout.requestedBy._id,
        firstName: payout.requestedBy.firstName,
        lastName: payout.requestedBy.lastName,
        email: payout.requestedBy.email,
        phoneNumber: payout.requestedBy.phoneNumber,
        kycDetails: payout.requestedBy.kycDetails || null,
      },
    };

    return res.status(200).json({
      message: "Verified payout request fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching payout request:", error.message);
    return res.status(500).json({
      message: "Server error while fetching the verified payout request",
      error: error.message,
    });
  }
};
// to make the payout complete(warning:notify super admin before calling the api that he should transfer the amount via bank ).(incomplete add the ststus on superadmin wallet)
const markPayoutAsCompleted = async (req, res) => {
  const { id } = req.params;
  const { io, connectedUsers } = req;

  try {
    if (!id) {
      return res.status(400).json({ message: "Payout request ID is required" });
    }

    const completedAt = new Date();

    const payout = await PayoutRequest.findOneAndUpdate(
      { _id: id, isVerified: true, isPayoutCompleted: false },
      {
        isPayoutCompleted: true,
        payoutCompletedAt: completedAt,
      },
      { new: true }
    ).populate({
      path: "requestedBy",
      select: "firstName lastName email phoneNumber",
    });

    if (!payout) {
      return res
        .status(404)
        .json({ message: "Verified & pending payout request not found" });
    }

    const user = payout.requestedBy;

    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }

    await sendNotification(
      user._id,
      USER_ROLE,
      `Your payout of ₹${payout.amount} (${payout.starCount} stars) has been completed successfully.`,
      io,
      connectedUsers
    );

    if (user.email) {
      try {
         await sgMail.send({
          to: user.email,
          from: config.SENDGRID_SENDER_EMAIL,
          subject: "🎉 Payout Completed Successfully!",
          text: `Hi ${user.firstName},

Your payout of ₹${payout.amount} (${payout.starCount} stars) has been successfully processed on ${new Date(payout.payoutCompletedAt).toLocaleString()}.

Payout ID: ${payout._id}

Thank you for using our platform.`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .email-container {
                  border-radius: 10px;
                  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
                  background: linear-gradient(135deg, #f9f9ff 0%, #f0f4ff 100%);
                }
                .header {
                  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
                  color: white;
                  padding: 25px;
                  text-align: center;
                }
                .logo {
                  max-width: 150px;
                  margin-bottom: 15px;
                }
                .content {
                  padding: 25px;
                  background-color: white;
                }
                .payout-card {
                  background: #f8f9fa;
                  border-left: 4px solid #4CAF50;
                  padding: 15px;
                  margin: 20px 0;
                  border-radius: 0 5px 5px 0;
                }
                .payout-detail {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 8px;
                }
                .payout-label {
                  font-weight: 600;
                  color: #555;
                }
                .payout-value {
                  font-weight: 700;
                  color: #222;
                }
                .button {
                  display: inline-block;
                  padding: 12px 25px;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: 600;
                  margin: 10px 5px;
                  transition: all 0.3s ease;
                }
                .button-primary {
                  background: #4CAF50;
                }
                .button-secondary {
                  background: #2196F3;
                }
                .button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .footer {
                  text-align: center;
                  padding: 15px;
                  font-size: 12px;
                  color: #777;
                  background-color: #f5f5f5;
                }
                .action-buttons {
                  text-align: center;
                  margin: 25px 0;
                }
                .print-only {
                  display: none;
                }
                @media print {
                  .no-print {
                    display: none;
                  }
                  .print-only {
                    display: block;
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 12px;
                    color: #777;
                  }
                  .email-container {
                    box-shadow: none;
                  }
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="header">
                  <!-- Replace with your actual logo URL -->
                  <img src="https://example.com/your-logo.png" alt="Company Logo" class="logo">
                  <h1>Payout Completed!</h1>
                  <p>Your funds have been successfully transferred</p>
                </div>
                
                <div class="content">
                  <p>Hi ${user.firstName},</p>
                  <p>We're happy to inform you that your payout has been <strong>successfully processed</strong> and the funds should reflect in your account shortly.</p>
                  
                  <div class="payout-card">
                    <div class="payout-detail">
                      <span class="payout-label">Amount:</span>
                      <span class="payout-value">₹${payout.amount}</span>
                    </div>
                    <div class="payout-detail">
                      <span class="payout-label">Stars:</span>
                      <span class="payout-value">${payout.starCount}</span>
                    </div>
                    <div class="payout-detail">
                      <span class="payout-label">Completed At:</span>
                      <span class="payout-value">${new Date(payout.payoutCompletedAt).toLocaleString()}</span>
                    </div>
                    <div class="payout-detail">
                      <span class="payout-label">Transaction ID:</span>
                      <span class="payout-value">${payout._id}</span>
                    </div>
                  </div>
                  
                  // <div class="action-buttons">
                  //   <a href="#" class="button button-primary no-print" onclick="window.print()">Print Receipt</a>
                  //   <a href="#" class="button button-secondary no-print" onclick="generatePDF()">Save as PDF</a>
                  //   <a href="${config.APP_URL}/dashboard/payouts" class="button button-secondary">View in Dashboard</a>
                  // </div>
                  
                  <div class="print-only">
                    Payout receipt - Generated on ${new Date().toLocaleString()}
                  </div>
                  
                  <p>If you don't see the funds in your account within 24 hours, please contact our support team.</p>
                  <p>Thank you for being a valued member of our platform!</p>
                </div>
                
                <div class="footer">
                  <p>© ${new Date().getFullYear()} AdEarn. All rights reserved.</p>
                  <p>
                    <a href="${config.APP_URL}/privacy" style="color: #4CAF50; text-decoration: none;">Privacy Policy</a> | 
                    <a href="${config.APP_URL}/terms" style="color: #4CAF50; text-decoration: none;">Terms of Service</a>
                  </p>
                </div>
              </div>
              
              <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
              <script>
                // This script won't work in email clients but will work if opened in browser
                document.addEventListener('DOMContentLoaded', function() {
                  console.log('Email loaded in browser');
                });
                
                function generatePDF() {
                  const { jsPDF } = window.jspdf;
                  
                  // Get the email container element
                  const element = document.querySelector('.email-container');
                  
                  // Use html2canvas to capture the element as an image
                  html2canvas(element).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const imgProps = pdf.getImageProperties(imgData);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                    
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save('payout-receipt-${payout._id}.pdf');
                  });
                }
              </script>
            </body>
            </html>
          `,
        })
      } catch (emailErr) {
        console.error("SendGrid Email Error:", emailErr.message);
      }
    }

    return res.status(200).json({
      message: "Payout marked as completed",
      data: {
        payoutRequestId: payout._id,
        starCount: payout.starCount,
        amount: payout.amount,
        completedAt: payout.payoutCompletedAt,
        user,
      },
    });
  } catch (error) {
    console.error("Error completing payout:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
// to fetch completed payout details on the superadmin side
const getAllCompletedPayouts = async (req, res) => {
  try {
    const payouts = await PayoutRequest.find({
      isVerified: true,
      isPayoutCompleted: true,
    })

      .populate({
        path: "requestedBy",
        select: "firstName lastName email phoneNumber",
      })
      .lean();

    const formatted = payouts.map((p) => ({
      payoutRequestId: p._id,
      starCount: p.starCount,
      amount: p.amount,
      requestedAt: p.requestedAt,
      user: {
        _id: p.requestedBy?._id,
        fullName: `${p.requestedBy?.firstName || ""} ${
          p.requestedBy?.lastName || ""
        }`.trim(),
        email: p.requestedBy?.email,
        phoneNumber: p.requestedBy?.phoneNumber,
      },
    }));

    return res.status(200).json({
      message: "Fetched all completed and verified payout requests",
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching completed payouts:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export {
  createPayoutRequest,
  getAllUnVerifiedPayoutRequest,
  singleUnverifiedPayoutRequest,
  verifyPayoutRequest,
  getAllVerifiedPayoutRequests,
  getSingleVerifiedPayoutRequest,
  markPayoutAsCompleted,
  getAllCompletedPayouts,
  rejectPayoutRequest
};
