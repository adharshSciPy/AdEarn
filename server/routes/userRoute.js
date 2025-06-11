import  Router  from "express";
import { addKyc, editUser, fetchAllMyAds, fetchUserWallet, getUserByUniqueId, getViewedAds, redeemCoupon, registerUser, starBuy, uploadProfilePicture, userLogin, userLogout, } from "../controller/userController.js";
import uploadUserImg from "../multer/userImgMulter.js";
import userKyc from "../multer/kycVerificationMulter.js";
import authMiddleware from "../auth/authMiddleware.js";
import checkSubscription from "../utils/checkSubscription.js";
import {registerUserToContest} from "../controller/superAdminController.js"

const userRouter = Router()
userRouter.route('/register').post(registerUser);
userRouter.route('/update/:id').patch(editUser);
userRouter.route('/login').post(userLogin);
userRouter.route('/logout/:id').post(userLogout);
userRouter.route('/profile-upload/:id').post(uploadUserImg, uploadProfilePicture);
userRouter.route('/kyc-verification/:id').post(userKyc, addKyc);
userRouter.route('/by-uniqueid').get(getUserByUniqueId);
userRouter.route('/buy-stars/:id').post(starBuy);
userRouter.route('/viewed-ads/:id').get(getViewedAds);
userRouter.route('/redeem-coupon/:id').post(redeemCoupon);
userRouter.route('/user-wallet/:id').get(fetchUserWallet);
userRouter.route('/contest/register').post(registerUserToContest);
userRouter.route('/my-all-ads/:userId').get(fetchAllMyAds)









export default userRouter