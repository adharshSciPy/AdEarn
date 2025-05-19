import { Router } from "express";
import {
  createImageAd,
  createVideoAd,
  createSurveyAd,
} from "../controller/adsController.js";
import adImageUpload from "../multer/adImageMulter.js"; 
import adVideoUpload from "../multer/adVideoMulter.js"

const adsRouter = Router();


adsRouter.post("/image-ad/:id", adImageUpload, createImageAd);
adsRouter.post("/video-ad/:id", adVideoUpload, createVideoAd);
adsRouter.post("/survey-ad", createSurveyAd);

export default adsRouter;
