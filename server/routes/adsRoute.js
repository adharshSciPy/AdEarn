import { Router } from "express";
import {
  createImageAd,
  createVideoAd,
  createSurveyAd,
  fetchAdsForVerification,
  fetchVerifiedAds,
} from "../controller/adsController.js";
import adImageUpload from "../multer/adImageMulter.js"; 
import adVideoUpload from "../multer/adVideoMulter.js"

const adsRouter = Router();


adsRouter.post("/image-ad/:id", adImageUpload, createImageAd);
adsRouter.post("/video-ad/:id", adVideoUpload, createVideoAd);
adsRouter.post("/survey-ad", createSurveyAd);
adsRouter.get("/ads-to-verify", fetchAdsForVerification);
adsRouter.get("/verified-ads", fetchVerifiedAds);




export default adsRouter;
