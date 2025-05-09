import { Router } from "express";
import{ registerAdmin} from "../controller/adminController.js";
const adminRouter = Router()

adminRouter.route('/admin-register').post(registerAdmin)

export default adminRouter

