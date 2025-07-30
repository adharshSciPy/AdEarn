import { Router } from "express";
import authMiddleware from "../auth/authMiddleware.js";
import { createPayoutRequest, getAllCompletedPayouts, getAllUnVerifiedPayoutRequest, getAllVerifiedPayoutRequests, getSingleVerifiedPayoutRequest, markPayoutAsCompleted, myPayoutRequests, myRejectedPayouts, myVerifiedPayouts, rejectPayoutRequest, singleUnverifiedPayoutRequest, verifyPayoutRequest } from "../controller/payoutController.js";
import checkSubscription from "../utils/checkSubscription.js";

const payoutRoute=Router();
payoutRoute.route('/request').post (authMiddleware,checkSubscription,createPayoutRequest)// to send payout request from user
payoutRoute.route('/all-unverified/requests').get(getAllUnVerifiedPayoutRequest)//to fetch the unverifed requests on the superAdmin side
payoutRoute.route('/single-unverified/request/:id').get(singleUnverifiedPayoutRequest)// to fetch single unverified request on superAdmin side
payoutRoute.route('/verify/request/:id').patch(verifyPayoutRequest)// to verify payout request on superAdmin side
payoutRoute.route('/reject/request/:id').patch(rejectPayoutRequest)// to reject payout request on superAdmin side
payoutRoute.route('/all-verified/requests').get(getAllVerifiedPayoutRequests)// to  fetch all verified payout requests on superAdmin side
payoutRoute.route('/single-verified/request/:id').get(getSingleVerifiedPayoutRequest)// to  fetch single verified payout requests on superAdmin side
payoutRoute.route('/complete-payout/:id').patch(markPayoutAsCompleted)// to  verify complete payout by superAdmin.
payoutRoute.route('/completed-payouts').get(getAllCompletedPayouts)// to  fetch all completed payouts on superAdmin side.
payoutRoute.route('/my-payouts/:userId').get(myPayoutRequests)// to fetch user total payouts on user side 
payoutRoute.route('/my-payouts/verified/:userId').get(myVerifiedPayouts)//completed payouts
payoutRoute.route('/my-payouts/rejected/:userId').get(myRejectedPayouts)//rejected payouys








export default payoutRoute