import { Router } from "express";
import {
  createImageAd,
  createVideoAd,
  createSurveyAd,
  fetchAdsForVerification,
  fetchVerifiedAds,
  fetchSingleVerifiedAd,
  fetchVerifiedImgAd,
  fetchVerifiedVideoAd,
  viewAd,
  fetchSingleUnverifiedAd,
  fetchVerifiedSurveyAd,
  toggleAds,
  editImageAd,
  editVideoAd,
  editSurveyAd,
  submitSurveyResponse,
  getSurveyAdStats,
  createImageAdDraft,
  confirmAdPayment,
  createVideoAdDraft,
  createSurveyAdDraft
} from "../controller/adsController.js";
import adMediaUpload from "../multer/adImageMulter.js";
import adVideoUpload from "../multer/adVideoMulter.js";
import surveyAdUpload from "../multer/surveyAdMulter.js";
import authMiddleware from "../auth/authMiddleware.js";
import checkSubscription from "../utils/checkSubscription.js";
import { wrapMulter } from "../utils/wrapMulter.js";

const adsRouter = Router();

adsRouter.post("/image-ad/:id",authMiddleware,checkSubscription, wrapMulter(adMediaUpload), createImageAd);
adsRouter.post("/video-ad/:id", authMiddleware,checkSubscription,wrapMulter(adVideoUpload) ,createVideoAd);
adsRouter.post("/survey-ad/:id", authMiddleware,checkSubscription,wrapMulter(surveyAdUpload), createSurveyAd);
adsRouter.post("/survey-response/submit", authMiddleware,checkSubscription,submitSurveyResponse);
adsRouter.get("/survey-stats/:surveyAdId", getSurveyAdStats);
adsRouter.get("/ads-to-verify", fetchAdsForVerification);
adsRouter.get("/verified-ads", fetchVerifiedAds);
adsRouter.get("/unverified-ads/:id", fetchSingleUnverifiedAd);
adsRouter.get("/single-verified/:adId", fetchSingleVerifiedAd);
adsRouter.get("/image-ads/:userId",authMiddleware,checkSubscription, fetchVerifiedImgAd);
adsRouter.get("/video-ads/:userId", authMiddleware,checkSubscription,fetchVerifiedVideoAd);
adsRouter.get("/survey-ads/:userId",authMiddleware,checkSubscription, fetchVerifiedSurveyAd);
adsRouter.post("/view-ads/:id/:adId",authMiddleware, checkSubscription,viewAd);
adsRouter.post("/toggle-ad", toggleAds);
adsRouter.patch("/edit-image-ad/:adId",authMiddleware,checkSubscription, wrapMulter(adMediaUpload),editImageAd);
adsRouter.patch("/edit-video-ad/:adId",authMiddleware,checkSubscription, wrapMulter(adVideoUpload), editVideoAd);
adsRouter.patch("/edit-survey-ad/:adId", authMiddleware,checkSubscription,wrapMulter(surveyAdUpload), editSurveyAd);
adsRouter.post("/image-ad/draft/:id", authMiddleware,checkSubscription,wrapMulter(adMediaUpload), createImageAdDraft);
adsRouter.post("/video-ad/draft/:id",authMiddleware,checkSubscription, wrapMulter(adVideoUpload),createVideoAdDraft);
adsRouter.post("/survey-ad/draft/:id",authMiddleware,checkSubscription, wrapMulter(surveyAdUpload),createSurveyAdDraft);
adsRouter.post("/payment-verification/:adId", confirmAdPayment);



export default adsRouter;
