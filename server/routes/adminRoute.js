import { Router } from "express";
import {
    registerAdmin, adminLogin, getAllUsers, fetchKycUploadedUsers, fetchSingleKycUploadUser, getSingleUser, verifyKyc, rejectKyc, verifyAdById, getAdminWallet, rejectAdById, kycVerifiedUsers, fetchUserKycStatus, sendOtpToAdmin, verifyOtpAndRegisterAdmin, sendAdminForgotPasswordOtp, resetAdminPassword, verifyAdminForgotPasswordOtp,
    getAllAdmins, deleteAdmins,
    assignKycToAdmin
} from "../controller/adminController.js";
const adminRouter = Router()

adminRouter.route('/admin-register').post(registerAdmin)
// adminRouter.route('/admin-edit/:id').patch(updateAdmin)
adminRouter.route('/admin-login').post(adminLogin)
adminRouter.route('/all-users').get(getAllUsers)
adminRouter.route('/single-user').get(getSingleUser)
adminRouter.route('/kyc-requested-users').get(fetchKycUploadedUsers)
adminRouter.route('/kyc-requested-single-user').get(fetchSingleKycUploadUser)
adminRouter.route('/kyc-approval').post(verifyKyc)
adminRouter.route('/kyc-rejection').post(rejectKyc)
adminRouter.route('/kyc-verified-users').get(kycVerifiedUsers)
adminRouter.route('/user-kyc-status').get(fetchUserKycStatus)
adminRouter.route('/verify-ad').post(verifyAdById)
adminRouter.route('/admin-wallet').get(getAdminWallet)
adminRouter.route('/reject-ad').post(rejectAdById)
adminRouter.route('/send-otp').post(sendOtpToAdmin)
adminRouter.route('/verify-otp').post(verifyOtpAndRegisterAdmin)
adminRouter.route('/forgot-password/send-otp').post(sendAdminForgotPasswordOtp);
adminRouter.route('/forgot-password/verify-otp').post(verifyAdminForgotPasswordOtp);
adminRouter.route('/forgot-password/reset-password').post(resetAdminPassword);
adminRouter.route('/getallAdmins').get(getAllAdmins);
adminRouter.route('/deleteAdmin/:id').delete(deleteAdmins);
adminRouter.route('/assign-kyc-admin/:id').post(assignKycToAdmin);//admin can mannually select kyc to verify ;













export default adminRouter

