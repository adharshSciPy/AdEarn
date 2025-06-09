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
  fetchVerifiedSurveyAd
} from "../controller/adsController.js";
import adMediaUpload from "../multer/adImageMulter.js"
import adVideoUpload from "../multer/adVideoMulter.js"
import authMiddleware from "../auth/authMiddleware.js";
import checkSubscription from "../utils/checkSubscription.js";

const adsRouter = Router();


adsRouter.post("/image-ad/:id",authMiddleware,checkSubscription, adMediaUpload, createImageAd);
adsRouter.post("/video-ad/:id", adVideoUpload, createVideoAd);
adsRouter.post("/survey-ad/:id", createSurveyAd);
adsRouter.get("/ads-to-verify", fetchAdsForVerification);
adsRouter.get("/verified-ads", fetchVerifiedAds);
adsRouter.get("/unverified-ads/:id", fetchSingleUnverifiedAd);

adsRouter.get('/single-verified/:adId', fetchSingleVerifiedAd);
adsRouter.get('/image-ads/:userId', fetchVerifiedImgAd);
adsRouter.get('/video-ads/:userId', fetchVerifiedVideoAd);
adsRouter.get('/survey-ads/:userId', fetchVerifiedSurveyAd);


adsRouter.post('/view-ads/:userId/:adId', viewAd);







export default adsRouter;
