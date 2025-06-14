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
  topUpWelcomeBonusStars ,
  topUpCompanyRewardStars,
  patchSuperAdminWallet,
  deleteUser,
  blacklistUser
} from "../controller/superAdminController.js";
const superAdminRouter = Router();
superAdminRouter.route("/register").post(registerSuperAdmin);
superAdminRouter.route("/login").post(superAdminLogin);
superAdminRouter.route("/all-admins").get(getAllAdmins);
superAdminRouter.route("/toggle-user-status").post(toggleUserStatus);
superAdminRouter.route("/toggle-admin-status").post(toggleAdminStatus);
superAdminRouter.route("/superadmin-wallet").get(getSuperAdminWallet);
superAdminRouter.route("/generate-coupons").post(generateCoupons);
superAdminRouter.route('/set-welcome-bonus').post(setWelcomeBonusAmount);
superAdminRouter.route('/topup-welcome-stars').post(topUpWelcomeBonusStars);
superAdminRouter.route('/create-contest').post(createContest);
superAdminRouter.route('/topup-company-stars').post(topUpCompanyRewardStars);
superAdminRouter.route('/patch-wallet').patch(patchSuperAdminWallet);
superAdminRouter.route('/delete-user').delete(deleteUser);
superAdminRouter.route('/blacklist-user').patch(blacklistUser)


export default superAdminRouter;
