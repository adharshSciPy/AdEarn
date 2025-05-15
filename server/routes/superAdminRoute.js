import  Router  from "express";
import { getAllAdmins, registerSuperAdmin, superAdminLogin } from "../controller/superAdminController.js";
const superAdminRouter=Router();
superAdminRouter.route('/register').post(registerSuperAdmin);
superAdminRouter.route('/login').post(superAdminLogin);
superAdminRouter.route('/all-admins').get(getAllAdmins);


export default superAdminRouter