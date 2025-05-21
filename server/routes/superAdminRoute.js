import  Router  from "express";
import { getAllAdmins, registerSuperAdmin, superAdminLogin, toggleAdminStatus, toggleUserStatus } from "../controller/superAdminController.js";
const superAdminRouter=Router();
superAdminRouter.route('/register').post(registerSuperAdmin);
superAdminRouter.route('/login').post(superAdminLogin);
superAdminRouter.route('/all-admins').get(getAllAdmins);
superAdminRouter.route('/toggle-user-status').post(toggleUserStatus);
superAdminRouter.route('/toggle-admin-status').post(toggleAdminStatus   );




export default superAdminRouter