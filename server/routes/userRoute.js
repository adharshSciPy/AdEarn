import  Router  from "express";
import { editUser, registerUser } from "../controller/userController.js";
const userRouter = Router()
userRouter.route('/user-register').post(registerUser);
userRouter.route('/user-update/:id').patch(editUser);

export default userRouter