import { Router } from "express";
import {
    registerAdmin, adminLogin, getAllUsers, fetchKycUploadedUsers, fetchSingleKycUploadUser, getSingleUser, verifyKyc, rejectKyc, verifyAdById, getAdminWallet, rejectAdById, kycVerifiedUsers, fetchUserKycStatus, sendOtpToAdmin, verifyOtpAndRegisterAdmin, sendAdminForgotPasswordOtp, resetAdminPassword, verifyAdminForgotPasswordOtp,
    getAllAdmins, deleteAdmins,
    assignKycToAdmin,
    assignAdToAdmin,
    fetchKycsAssignedToAdmin,
    fetchAdsAssignedToAdmin,
    getAdsVerifiedByAdmin,
    getAdsRejectedByAdmin,
    getKycsVerifiedByAdmin,
    getKycsRejectedByAdmin
} from "../controller/adminController.js";

const adminRouter = Router()

adminRouter.route('/admin-register').post(registerAdmin)
// adminRouter.route('/admin-edit/:id').patch(updateAdmin)
adminRouter.route('/admin-login').post(adminLogin)
adminRouter.route('/all-users').get(getAllUsers)
adminRouter.route('/single-user').get(getSingleUser)
adminRouter.route('/kyc-requested-users').get(fetchKycUploadedUsers)
adminRouter.route('/kyc-requested-single-user').get(fetchSingleKycUploadUser)
adminRouter.route('/kyc-approval/:id').post(verifyKyc)
adminRouter.route('/kyc-rejection/:id').post(rejectKyc)
adminRouter.route('/kyc-verified-users').get(kycVerifiedUsers)
adminRouter.route('/user-kyc-status').get(fetchUserKycStatus)
adminRouter.route('/verify-ad/:id').post(verifyAdById)
adminRouter.route('/admin-wallet').get(getAdminWallet)
adminRouter.route('/reject-ad/:id').post(rejectAdById)
adminRouter.route('/send-otp').post(sendOtpToAdmin)
adminRouter.route('/verify-otp').post(verifyOtpAndRegisterAdmin)
adminRouter.route('/forgot-password/send-otp').post(sendAdminForgotPasswordOtp);
adminRouter.route('/forgot-password/verify-otp').post(verifyAdminForgotPasswordOtp);
adminRouter.route('/forgot-password/reset-password').post(resetAdminPassword);
adminRouter.route('/getallAdmins').get(getAllAdmins);
adminRouter.route('/deleteAdmin/:id').delete(deleteAdmins);
adminRouter.route('/assign-kyc-admin/:id').post(assignKycToAdmin);//admin can mannually select kyc to verify ;
adminRouter.route('/assign-ads-admin/:id').post(assignAdToAdmin);//admin can mannually select ads to verify ;
adminRouter.route('/assigned-kyc/:id').get(fetchKycsAssignedToAdmin);//fetch assigned kycs
adminRouter.route('/assigned-ads/:id').get(fetchAdsAssignedToAdmin);//fetch assigned ads
adminRouter.route('/ads-verified/:id').get(getAdsVerifiedByAdmin);//fetch verified ads;
adminRouter.route('/ads-rejected/:id').get(getAdsRejectedByAdmin);//fetch rejected ads;
adminRouter.route('/kycs-verified/:id').get(getKycsVerifiedByAdmin);//fetch verified kyc;
adminRouter.route('/kycs-rejected/:id').get(getKycsRejectedByAdmin);//fetch rejected kyc;


















export default adminRouter

