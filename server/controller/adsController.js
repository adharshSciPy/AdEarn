import { ImageAd } from "../model/imageadModel.js";
import { VideoAd } from "../model/videoadModel.js";
import { SurveyAd } from "../model/surveyadModel.js";
import User from "../model/userModel.js";
import { Ad } from "../model/AdsModel.js";

// ------------------- IMAGE AD -------------------
const createImageAd = async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // Check if the file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  // Validate title and description
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  
   const imageUrl = `/imgAdUploads/${req.file.filename}`;
    const imageAd = await ImageAd.create({
      title,
      description,
      imageUrl,
      createdBy: user._id,
    });

    
    const ad = await Ad.create({
      imgAdRef: imageAd._id,
    });

   
    user.ads.push(ad._id);
    await user.save();

    return res.status(200).json({
      message: "Image Ad created and linked successfully",
      imageAd,
      ad,
      user
    });

  } catch (error) {
    console.error("Error creating Image Ad:", error);
    return res.status(500).json({
      message: "Image Ad creation failed",
      error: error.message,
    });
  }
};

// ------------------- VIDEO AD -------------------

const createVideoAd = async (req, res) => {
  const { title, description } = req.body;
  const{id}=req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  if(!req.file){
      return res.status(400).json({ message: "Video file required" });
  }
  if (!title || !description ) {
    return res.status(400).json({ message: "All fields are required for Video Ad" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const videoUrl = `/videoAdUploads/${req.file.filename}`;
    const videoAd = await VideoAd.create({
      title,
      description,
      videoUrl,
      createdBy: user._id,

    });
    const ad=await Ad.create({
      videoAdRef:videoAd._id
    })
    user.ads.push(ad._id);
    await user.save();
     return res.status(200).json({
      message: "Video Ad created and linked successfully",
      videoAd,
      ad,
      user
    });
  } catch (error) {
    console.error("Error creating video Ad:", error);
    return res.status(500).json({
      message: "Video Ad creation failed",
      error: error.message,
    });
  }
};

// ------------------- SURVEY AD -------------------

const createSurveyAd = async (req, res) => {
  const { title, questions, id } = req.body;

  // Input validations
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({
      message: "Survey Ad must have a title and at least one question",
    });
  }

  for (const q of questions) {
    if (!q.questionText || !Array.isArray(q.options) || q.options.length < 2) {
      return res.status(400).json({
        message: "Each question must have questionText and at least 2 options",
      });
    }
  }

  try {
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create SurveyAd
    const surveyAd = await SurveyAd.create({
      title,
      questions,
      createdBy: user._id,

    });

    // Create Ad and link SurveyAd
    const ad = await Ad.create({
      surveyAdRef: surveyAd._id,
    });

    // Push new ad to user's ads array
    user.ads.push(ad._id);
    await user.save();

    return res.status(200).json({
      message: "Survey Ad created and linked successfully",
      surveyAd,
      ad,
      user,
    });
  } catch (err) {
    console.error("Error creating Survey Ad:", err);
    return res.status(500).json({
      message: "Survey Ad creation failed",
      error: err.message,
    });
  }
};
// fetching all the ads verification
const fetchAdsForVerification = async (req, res) => {
  try {
    const allAds = await Ad.find()
      .populate("imgAdRef")
      .populate("videoAdRef")
      .populate("surveyAdRef");

    if (!allAds || allAds.length === 0) {
      return res.status(400).json({ message: "No Ads found" });
    }

    // Filter only ads where any one of the refs is not verified
    const unverifiedAds = allAds.filter((ad) => {
      return (
        (ad.imgAdRef && !ad.imgAdRef.isAdVerified) ||
        (ad.videoAdRef && !ad.videoAdRef.isAdVerified) ||
        (ad.surveyAdRef && !ad.surveyAdRef.isAdVerified)
      );
    });

    if (unverifiedAds.length === 0) {
      return res.status(404).json({ message: "No unverified ads found" });
    }

    const adsWithVerificationStatus = unverifiedAds.map((ad) => {
      return {
        _id: ad._id,
        imageAd: ad.imgAdRef
          ? {
              ...ad.imgAdRef.toObject(),
              isVerified: ad.imgAdRef.isAdVerified,
            }
          : null,
        videoAd: ad.videoAdRef
          ? {
              ...ad.videoAdRef.toObject(),
              isVerified: ad.videoAdRef.isAdVerified,
            }
          : null,
        surveyAd: ad.surveyAdRef
          ? {
              ...ad.surveyAdRef.toObject(),
              isVerified: ad.surveyAdRef.isAdVerified,
            }
          : null,
      };
    });

    res.status(200).json({ ads: adsWithVerificationStatus });
  } catch (error) {
    console.error("Error fetching ads for verification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export { createImageAd,createVideoAd,createSurveyAd,fetchAdsForVerification};
