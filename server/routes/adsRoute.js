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
import adImageUpload from "../multer/adImageMulter.js"; 
import adVideoUpload from "../multer/adVideoMulter.js"

const adsRouter = Router();


adsRouter.post("/image-ad/:id", adImageUpload, createImageAd);
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
