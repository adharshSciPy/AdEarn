import { ImageAd } from "../model/imageadModel.js";
import { VideoAd } from "../model/videoadModel.js";
import { SurveyAd } from "../model/surveyadModel.js";
import User from "../model/userModel.js";
import { Ad } from "../model/AdsModel.js";
function generateStarPayoutPlan(views, totalStars) {
  const payout = Array(views).fill(0);
  const weights = [5, 4, 3, 2, 1];
  const counts = { 5: 1, 4: 1, 3: 2, 2: 4, 1: 46 };

  // Flatten the weights array according to counts
  let distributedStars = [];
  for (let star of weights) {
    for (let i = 0; i < counts[star]; i++) {
      distributedStars.push(star);
    }
  }

  // Fill the rest with 0s if totalStars allows
  while (distributedStars.length < views && distributedStars.reduce((a, b) => a + b, 0) < totalStars) {
    distributedStars.push(0);
  }

  // Adjust if totalStars doesn't match
  let currentSum = distributedStars.reduce((a, b) => a + b, 0);
  while (currentSum > totalStars) {
    for (let i = 0; i < distributedStars.length && currentSum > totalStars; i++) {
      if (distributedStars[i] > 0) {
        distributedStars[i]--;
        currentSum--;
      }
    }
  }

  // Randomly shuffle the array
  for (let i = distributedStars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [distributedStars[i], distributedStars[j]] = [distributedStars[j], distributedStars[i]];
  }

  return distributedStars;
}

// ------------------- IMAGE AD -------------------
const createImageAd = async (req, res) => {
  const { title, description, userViewsNeeded } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  if (!title || !description || !userViewsNeeded) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findById(id).populate("userWalletDetails");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userWallet = user.userWalletDetails;
    if (!userWallet) {
      return res.status(400).json({ message: "User wallet not found" });
    }

    // Calculate required stars
    const starsDeductionRate = 0.6;
    const starsToBeDeducted = userViewsNeeded * starsDeductionRate;

    if (userWallet.totalStars < starsToBeDeducted) {
      const starsShort = starsToBeDeducted - userWallet.totalStars;
      return res.status(401).json({
        message: `Insufficient stars. You need ${starsShort} more stars to post this ad.`,
      });
    }

    // Deduct stars and save wallet
    userWallet.totalStars -= starsToBeDeducted;
    await userWallet.save();

    // Create Image Ad
    const imageUrl = `/imgAdUploads/${req.file.filename}`;
    const imageAd = await ImageAd.create({
      title,
      description,
      imageUrl,
      createdBy: user._id,
      userViewsNeeded,
      totalStarsAllocated:starsToBeDeducted,
  //  starPayoutPlan: [starsToBeDeducted], 
    });

    const ad = await Ad.create({
      imgAdRef: imageAd._id,
    });

    // Link ad to user
    user.ads.push(ad._id);
    await user.save();

    return res.status(200).json({
      message: "Image Ad created successfully and stars deducted",
      imageAd,
      ad,
      remainingStars: userWallet.totalStars,
    });
  } catch (error) {
    console.error("Error creating image ad:", error);
    return res.status(500).json({
      message: "Failed to create ad",
      error: error.message,
    });
  }
};

// ------------------- VIDEO AD -------------------

const createVideoAd = async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  if (!req.file) {
    return res.status(400).json({ message: "Video file required" });
  }
  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "All fields are required for Video Ad" });
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
    const ad = await Ad.create({
      videoAdRef: videoAd._id,
    });
    user.ads.push(ad._id);
    await user.save();
    return res.status(200).json({
      message: "Video Ad created and linked successfully",
      videoAd,
      ad,
      user,
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
// fetching all the ads with isVerified:false for verification
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
// fetching all the ads with isVerified:true to display to users (ads that have been verified by Admin)
const fetchVerifiedAds = async (req, res) => {
  try {
    const allAds = await Ad.find()
      .populate("imgAdRef")
      .populate("videoAdRef")
      .populate("surveyAdRef");

    if (!allAds || allAds.length === 0) {
      return res.status(400).json({ message: "No Ads found" });
    }

    // Filter ads where any of the refs are verified
    const verifiedAds = allAds.filter((ad) => {
      return (
        (ad.imgAdRef && ad.imgAdRef.isAdVerified) ||
        (ad.videoAdRef && ad.videoAdRef.isAdVerified) ||
        (ad.surveyAdRef && ad.surveyAdRef.isAdVerified)
      );
    });

    if (verifiedAds.length === 0) {
      return res.status(404).json({ message: "No verified ads found" });
    }

    // Format ads with verification status
    const adsWithStatus = verifiedAds.map((ad) => ({
      _id: ad._id,
      imageAd: ad.imgAdRef && ad.imgAdRef.isAdVerified
        ? {
            ...ad.imgAdRef.toObject(),
            isVerified: ad.imgAdRef.isAdVerified,
          }
        : null,
      videoAd: ad.videoAdRef && ad.videoAdRef.isAdVerified
        ? {
            ...ad.videoAdRef.toObject(),
            isVerified: ad.videoAdRef.isAdVerified,
          }
        : null,
      surveyAd: ad.surveyAdRef && ad.surveyAdRef.isAdVerified
        ? {
            ...ad.surveyAdRef.toObject(),
            isVerified: ad.surveyAdRef.isAdVerified,
          }
        : null,
    }));

    return res.status(200).json({
      message: "Verified ads fetched successfully",
      ads: adsWithStatus,
    });
  } catch (error) {
    console.error("Error fetching verified ads:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export {
  createImageAd,
  createVideoAd,
  createSurveyAd,
  fetchAdsForVerification,
  fetchVerifiedAds
};
