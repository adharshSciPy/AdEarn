import { Router } from "express";
import{ registerAdmin,updateAdmin} from "../controller/adminController.js";
const adminRouter = Router()

adminRouter.route('/admin-register').post(registerAdmin)
adminRouter.route('/admin-edit/:id').patch(updateAdmin)

export default adminRouter

