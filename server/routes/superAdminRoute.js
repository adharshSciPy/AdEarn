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
  getSuperAdminWelcomeBonusEarnings,
  fetchAdminCouponsRequests,
  approveAndDistributeCouponForAdminRequest,
  distributeStarsToUser,
  getContests,
  getAdminAccountDetails,
  getSubscriptionAccountDetails,
  getAllUserAdSummaries,
  getSuperAdminTotalAmount,
  getAdminWalletWithTransactionDetails,
  getSubscriptionAccountDetailsInAmount,
  getAllUserAdSummariesInAmount,
  getAllContestsForSuperAdmin, 
  assignWinnerManually ,
  getActiveManualContests,
  getManualContestById, 
  getAllCouponBatchSummaries,
  generateStars,
  resetContestEntryWallet,
  getContestEntryWallet,
  getWelcomeBonusLogs,
  fetchTotalReceivedStars,
  fetchTotalGivenStars,
  superAdminPayout
  // selectAutomaticWinners
} from "../controller/superAdminController.js";
import { wrapMulter } from "../utils/wrapMulter.js";
import welcomeBonusUpload from "../multer/welBonusMulter.js";
import contestPrizeUpload from "../multer/contestRewardMulter.js";
import { assignAndApproveCouponRequest } from "../controller/adminController.js";

const superAdminRouter = Router();
superAdminRouter.route("/register").post(registerSuperAdmin);
superAdminRouter.route("/login").post(superAdminLogin);
superAdminRouter.route("/all-admins").get(getAllAdmins);
superAdminRouter.route("/toggle-user-status").post(toggleUserStatus);
superAdminRouter.route("/toggle-admin-status").post(toggleAdminStatus);
superAdminRouter.route("/superadmin-wallet").get(getSuperAdminWallet);
superAdminRouter.route("/welcome-bonus-earnings").get(getSuperAdminWelcomeBonusEarnings);
// superAdminRouter.route("/set-welcome-bonus").post(setWelcomeBonusAmount);
superAdminRouter.route("/topup-welcome-stars").post(topUpWelcomeBonusStars);
superAdminRouter.route("/create-contest").post(
  wrapMulter(
    contestPrizeUpload.fields([
      { name: "prizeImage_1", maxCount: 1 },
      { name: "prizeImage_2", maxCount: 1 },
      { name: "prizeImage_3", maxCount: 1 },
      { name: "prizeImage_4", maxCount: 1 },
      { name: "prizeImage_5", maxCount: 1 }
    ])
  ),
  createContest
);
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
// superAdminRouter.route("/select-automatic-winners").post(selectAutomaticWinners);
superAdminRouter.route("/coupon-requests").get(fetchAdminCouponsRequests);//to fetch coupon requests from admins
superAdminRouter.route("/approve-assign-coupon").post(approveAndDistributeCouponForAdminRequest)
superAdminRouter.route("/user/distribute-stars").post(distributeStarsToUser)
superAdminRouter.route("/contests").get(getContests);
superAdminRouter.route("/admin-account/details").get(getAdminAccountDetails);
superAdminRouter.route("/subscription-log/details").get(getSubscriptionAccountDetails);
superAdminRouter.route("/all-user/ad-details").get(getAllUserAdSummaries);
superAdminRouter.route("/amount/total-amount").get(getSuperAdminTotalAmount);
superAdminRouter.route("/amount/admin/total-amount").get(getAdminWalletWithTransactionDetails);
superAdminRouter.route("/amount/subscription-details").get(getSubscriptionAccountDetailsInAmount);
superAdminRouter.route("/amount/all-user/ad-details").get(getAllUserAdSummariesInAmount);
superAdminRouter.route("/all-contests").get(getAllContestsForSuperAdmin);
superAdminRouter.route("/assign-winner").post(assignWinnerManually);
superAdminRouter.route("/coupon-batch-details").get(getAllCouponBatchSummaries);
superAdminRouter.route("/reset-contest-wallet").post(resetContestEntryWallet);
superAdminRouter.route("/manual-contests/active").get(getActiveManualContests );
superAdminRouter.route("/manual/:id").get(getManualContestById );
superAdminRouter.route("/generate-stars").post(generateStars );
superAdminRouter.route("/contest-entry-wallet").get(getContestEntryWallet ); //fetch total stars superadmin got from the contest
superAdminRouter.route("/welcome-bonus/logs").get(getWelcomeBonusLogs ); // includes the stars got from the company , given stars ,logs of users who got the stars and the date he got the star
superAdminRouter.route("/total-stars/received").get(fetchTotalReceivedStars);
superAdminRouter.route("/total-stars/given").get(fetchTotalGivenStars);
superAdminRouter.route("/payout").post(superAdminPayout);

export default superAdminRouter;
