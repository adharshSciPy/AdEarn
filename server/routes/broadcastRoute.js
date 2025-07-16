import { Router } from "express";
import { createBroadcast } from "../controller/broadcastController.js";
const broadcastRouter=Router();
broadcastRouter.route("/create-broadcast").post(createBroadcast)
export default broadcastRouter