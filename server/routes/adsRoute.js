import { Router } from "express";
import {
  createImageAd,
  createVideoAd,
  createSurveyAd,
} from "../controller/adsController.js";



const adsRouter = Router();

adsRouter.post("/image-ad",  createImageAd);
adsRouter.post("/image-ad", adImageUpload, createImageAd);
// adsRouter.post("/video-ad", uploadVideo.single("video"), createVideoAd);     
adsRouter.post("/survey-ad",  createSurveyAd);

export default adsRouter;
 