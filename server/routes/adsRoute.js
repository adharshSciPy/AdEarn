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
  viewAd
} from "../controller/adsController.js";
import adImageUpload from "../multer/adImageMulter.js"; 
import adVideoUpload from "../multer/adVideoMulter.js"

const adsRouter = Router();


adsRouter.post("/image-ad/:id", adImageUpload, createImageAd);
adsRouter.post("/video-ad/:id", adVideoUpload, createVideoAd);
adsRouter.post("/survey-ad/:id", createSurveyAd);
adsRouter.get("/ads-to-verify", fetchAdsForVerification);
adsRouter.get("/verified-ads", fetchVerifiedAds);
adsRouter.get('/single-verified/:adId', fetchSingleVerifiedAd);
adsRouter.get('/image-ads/:userId', fetchVerifiedImgAd);
adsRouter.get('/video-ads', fetchVerifiedVideoAd);
adsRouter.post('/view-ads/:userId', viewAd);







export default adsRouter;
