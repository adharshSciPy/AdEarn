import Router from "express";
import {
  getAllAdmins,
  registerSuperAdmin,
  superAdminLogin,
  toggleAdminStatus,
  toggleUserStatus,
  getSuperAdminWallet,
  generateCoupons,
  setWelcomeBonusAmount,
  createContest,
  topUpWelcomeBonusStars,
  topUpCompanyRewardStars,
  patchSuperAdminWallet,
  deleteUser,
  blacklistUser,
  getAllCoupons,
  couponDistribution,
  getAllCouponBatches,
  sendSuperAdminForgotPasswordOtp,
  verifySuperAdminForgotPasswordOtp,
  resetSuperAdminPassword,
  // autoSelectWinners,
  getAdminJobStats,
  couponFetchById,
  stopContestManually,
  selectAutomaticWinners
} from "../controller/superAdminController.js";
import { wrapMulter } from "../utils/wrapMulter.js";
import welcomeBonusUpload from "../multer/welBonusMulter.js";
import contestPrizeUpload from "../multer/contestRewardMulter.js";

const superAdminRouter = Router();
superAdminRouter.route("/register").post(registerSuperAdmin);
superAdminRouter.route("/login").post(superAdminLogin);
superAdminRouter.route("/all-admins").get(getAllAdmins);
superAdminRouter.route("/toggle-user-status").post(toggleUserStatus);
superAdminRouter.route("/toggle-admin-status").post(toggleAdminStatus);
superAdminRouter.route("/superadmin-wallet").get(getSuperAdminWallet);
// superAdminRouter.route("/set-welcome-bonus").post(setWelcomeBonusAmount);
superAdminRouter.route("/topup-welcome-stars").post(topUpWelcomeBonusStars);
superAdminRouter.route("/create-contest").post(wrapMulter(contestPrizeUpload.array("prizeImages", 5)), createContest);
superAdminRouter.route("/topup-company-stars").post(topUpCompanyRewardStars);
superAdminRouter.route("/patch-wallet").patch(patchSuperAdminWallet);
superAdminRouter.route("/delete-user").delete(deleteUser);
superAdminRouter.route("/blacklist-user").patch(blacklistUser);
superAdminRouter.route("/set-welcome-bonus").post(wrapMulter(welcomeBonusUpload), setWelcomeBonusAmount);
superAdminRouter.route("/all-coupons").get(getAllCoupons);
// superAdminRouter.route("/contest/auto-select/:contestId").get(autoSelectWinners);
superAdminRouter.route("/forgot-password/send-otp").post(sendSuperAdminForgotPasswordOtp);
superAdminRouter.route("/forgot-password/verify-otp").post(verifySuperAdminForgotPasswordOtp);
superAdminRouter.route("/forgot-password/reset-password").post(resetSuperAdminPassword);
superAdminRouter.route("/admin-job-status/:id").get(getAdminJobStats);
// superAdminRouter.route('/admin-job-status/:id').get(getAdminJobStats)
superAdminRouter.route("/generate-coupons").post(generateCoupons);//to generate coupons for superadmin
superAdminRouter.route("/all-coupon-batch").get(getAllCouponBatches);//to get all  coupon batches to dispaly over superadmin as table 
superAdminRouter.route("/distribute-coupon").post(couponDistribution);// to distribute coupon batches to admin by superadmin
superAdminRouter.route("/coupon-batch/:id").get(couponFetchById);//to view coupons inside a batch on admin side
superAdminRouter.route("/stop/:id").post(stopContestManually);
superAdminRouter.route("/select-automatic-winners").post(selectAutomaticWinners);




export default superAdminRouter;
