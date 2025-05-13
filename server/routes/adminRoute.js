import { Router } from "express";
import{ registerAdmin,updateAdmin,adminLogin} from "../controller/adminController.js";
const adminRouter = Router()

adminRouter.route('/admin-register').post(registerAdmin)
adminRouter.route('/admin-edit/:id').patch(updateAdmin)
adminRouter.route('/admin-login').post(adminLogin)
export default adminRouter

