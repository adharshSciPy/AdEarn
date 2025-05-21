import { Router } from "express";
import{ registerAdmin,updateAdmin,adminLogin, getAllUsers, fetchKycUploadedUsers, fetchSingleKycUploadUser, getSingleUser, verifyKyc, rejectKyc,fetchVerifiedAds} from "../controller/adminController.js";
const adminRouter = Router()

adminRouter.route('/admin-register').post(registerAdmin)
adminRouter.route('/admin-edit/:id').patch(updateAdmin)
adminRouter.route('/admin-login').post(adminLogin)
adminRouter.route('/all-users').get(getAllUsers)
adminRouter.route('/single-user').get(getSingleUser)
adminRouter.route('/kyc-requested-users').get(fetchKycUploadedUsers)
adminRouter.route('/kyc-requested-single-user').get(fetchSingleKycUploadUser)
adminRouter.route('/kyc-approval').post(verifyKyc)
adminRouter.route('/kyc-rejection').post(rejectKyc)
adminRouter.route('/verify-ad').post(fetchVerifiedAds);




export default adminRouter

