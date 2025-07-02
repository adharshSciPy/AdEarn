import  Router  from "express";
import { activateSubscription, addKyc, editUser, fetchAllMyAds, fetchMySingleAd, fetchUserWallet, getUserByUniqueId, getViewedAds, redeemCoupon, registerUser, resetPassword, sendOTP, sendPasswordResetOTP, starBuy, uploadProfilePicture, userLogin, userLogout, verifyOTP, verifyPasswordResetOTP, } from "../controller/userController.js";
import uploadUserImg from "../multer/userImgMulter.js";
import userKyc from "../multer/kycVerificationMulter.js";
import authMiddleware from "../auth/authMiddleware.js";
import checkSubscription from "../utils/checkSubscription.js";
import {registerUserToContest} from "../controller/superAdminController.js";
import { wrapMulter } from "../utils/wrapMulter.js";

const userRouter = Router()
userRouter.route('/register').post(registerUser);//not use this instead go down
userRouter.route('/update/:id').patch(editUser);
userRouter.route('/login').post(userLogin);
userRouter.route('/logout/:id').post(userLogout);
userRouter.route('/profile-upload/:id').post(wrapMulter(uploadUserImg), uploadProfilePicture);
userRouter.route('/kyc-verification/:id').post(wrapMulter(userKyc), addKyc);
userRouter.route('/by-uniqueid').get(getUserByUniqueId);
userRouter.route('/buy-stars/:id').post(starBuy);
userRouter.route('/viewed-ads/:id').get(getViewedAds);
userRouter.route('/redeem-coupon/:id').post(redeemCoupon);
userRouter.route('/user-wallet/:id').get(fetchUserWallet);
userRouter.route('/contest/register').post(registerUserToContest);
userRouter.route('/my-all-ads/:userId').get(fetchAllMyAds);
userRouter.route('/my-single-ad/:userId/:adId').get(fetchMySingleAd)
userRouter.route('/send-otp').post(sendOTP);//user registration to send otp
userRouter.route('/verify-otp').post(verifyOTP);//to verify otp (body:phoneNumber &otp...phoneNumber should be stored in state and send into the backend);
userRouter.route('/forgot-password/send-otp').post(sendPasswordResetOTP);
userRouter.route('/forgot-password/verify-otp').post(verifyPasswordResetOTP);
userRouter.route('/forgot-password/reset-password').post(resetPassword);
userRouter.route('/activate-subscription').post(authMiddleware,activateSubscription);










export default userRouter