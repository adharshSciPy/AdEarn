import  Router  from "express";
import { editUser, registerUser, uploadProfilePicture, userLogin, userLogout, } from "../controller/userController.js";
import uploadUserImg from "../multer/userImgMulter.js";
const userRouter = Router()
userRouter.route('/user-register').post(registerUser);
userRouter.route('/user-update/:id').patch(editUser);
userRouter.route('/user-login').post(userLogin);
userRouter.route('/user-logout/:id').post(userLogout);
userRouter.route('/user-profile-upload/:id')
  .post(uploadUserImg, uploadProfilePicture);




export default userRouter