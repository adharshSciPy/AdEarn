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
} from "../controller/adsController.js";
import adMediaUpload from "../multer/adImageMulter.js";
import adVideoUpload from "../multer/adVideoMulter.js";
import surveyAdUpload from "../multer/surveyAdMulter.js";
import authMiddleware from "../auth/authMiddleware.js";
import checkSubscription from "../utils/checkSubscription.js";
import { wrapMulter } from "../utils/wrapMulter.js";

const adsRouter = Router();

adsRouter.post("/image-ad/:id", wrapMulter(adMediaUpload), createImageAd);
adsRouter.post("/video-ad/:id", wrapMulter(adVideoUpload), createVideoAd);
adsRouter.post("/survey-ad/:id", wrapMulter(surveyAdUpload), createSurveyAd);
adsRouter.get("/ads-to-verify", fetchAdsForVerification);
adsRouter.get("/verified-ads", fetchVerifiedAds);
adsRouter.get("/unverified-ads/:id", fetchSingleUnverifiedAd);
adsRouter.get("/single-verified/:adId", fetchSingleVerifiedAd);
adsRouter.get("/image-ads/:userId", fetchVerifiedImgAd);
adsRouter.get("/video-ads/:userId", fetchVerifiedVideoAd);
adsRouter.get("/survey-ads/:userId", fetchVerifiedSurveyAd);
adsRouter.post("/view-ads/:id/:adId", viewAd);
adsRouter.post("/toggle-ad", toggleAds);
adsRouter.patch("/edit-image-ad/:adId", wrapMulter(adMediaUpload), editImageAd);
adsRouter.patch("/edit-video-ad/:adId", wrapMulter(adVideoUpload), editVideoAd);

export default adsRouter;
