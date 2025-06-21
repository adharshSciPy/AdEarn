import { Router } from "express";
import { getNotifications } from "../controller/NotificationController.js";
import authMiddleware from "../auth/authMiddleware.js";
const notificationRouter = Router();
notificationRouter.route('/get-notifications').get(authMiddleware,getNotifications)

export default notificationRouter
