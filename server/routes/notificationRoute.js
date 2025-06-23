import { Router } from "express";
import { getNotifications, markNotificationsAsRead } from "../controller/NotificationController.js";
import authMiddleware from "../auth/authMiddleware.js";
const notificationRouter = Router();
notificationRouter.use(authMiddleware); //every route on this router is token authenticated
notificationRouter.route('/get-notifications').get(getNotifications);
notificationRouter.route('/read-notification').post(markNotificationsAsRead);

export default notificationRouter
