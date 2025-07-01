import { Router } from "express";
import {
getSubscriptionSettings,
updateSubscriptionSettings
} from "../controller/subscriptionController.js";
const subscriptionRouter=Router();
subscriptionRouter.route('/get-subscriptions').get(getSubscriptionSettings);
subscriptionRouter.route('/edit-subscriptions').put(updateSubscriptionSettings);

export default subscriptionRouter;