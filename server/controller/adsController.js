import { ImageAd } from "../model/imageadModel.js";
import { VideoAd } from "../model/videoadModel.js";
import { SurveyAd } from "../model/surveyadModel.js";
import User from "../model/userModel.js";
import { Ad } from "../model/AdsModel.js";
import mongoose from "mongoose";
import { UserWallet } from "../model/userWallet.js";

// function generateStarPayoutPlan(views, totalStars) {
//   const payout = Array(views).fill(0);
//   const weights = [5, 4, 3, 2, 1];
//   const counts = { 5: 1, 4: 1, 3: 2, 2: 4, 1: 46 };

//   // Flatten the weights array according to counts
//   let distributedStars = [];
//   for (let star of weights) {
//     for (let i = 0; i < counts[star]; i++) {
//       distributedStars.push(star);
//     }
//   }

//   // Fill the rest with 0s if totalStars allows
//   while (
//     distributedStars.length < views &&
//     distributedStars.reduce((a, b) => a + b, 0) < totalStars
//   ) {
//     distributedStars.push(0);
//   }

//   // Adjust if totalStars doesn't match
//   let currentSum = distributedStars.reduce((a, b) => a + b, 0);
//   while (currentSum > totalStars) {
//     for (
//       let i = 0;
//       i < distributedStars.length && currentSum > totalStars;
//       i++
//     ) {
//       if (distributedStars[i] > 0) {
//         distributedStars[i]--;
//         currentSum--;
//       }
//     }
//   }

//   // Randomly shuffle the array
//   for (let i = distributedStars.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [distributedStars[i], distributedStars[j]] = [
//       distributedStars[j],
//       distributedStars[i],
//     ];
//   }

//   return distributedStars;
// }
// function to calculate the region (radius)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ------------------- IMAGE AD -------------------
const createImageAd = async (req, res) => {
  const {
    title,
    description,
    userViewsNeeded,
    adPeriod,
    locations,
    states,
    districts,
    clickUrl, 
  } = req.body;

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (!title || !description || !userViewsNeeded) {
    return res.status(400).json({ message: "Missing required fields" });
  }


  const imageFile = req.files?.imageAd?.[0];
  const audioFile = req.files?.audioAd?.[0];

  if (!imageFile) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const parsedAdPeriod = parseFloat(adPeriod);
  const adRepetition = !isNaN(parsedAdPeriod) && parsedAdPeriod > 0;

  // Parse and validate locations
  let targetRegions = [];
  let targetStates = [];
  let targetDistricts = [];

  try {
    const parsedLocations =
      typeof locations === "string" ? JSON.parse(locations) : locations;

    if (Array.isArray(parsedLocations)) {
      for (const loc of parsedLocations) {
        if (!loc.coords || !loc.radius) continue;

        const [latStr, lngStr] = loc.coords.split(",");
        const latitude = parseFloat(latStr);
        const longitude = parseFloat(lngStr);
        const radius = parseFloat(loc.radius);

        if (isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
          return res.status(400).json({ message: "Invalid location format" });
        }

        targetRegions.push({
          location: {
            type: "Point",
            coordinates: [latitude, longitude],
          },
          radius,
        });
      }
    }

    targetStates = typeof states === "string" ? JSON.parse(states) : states;
    if (!Array.isArray(targetStates)) targetStates = [];

    targetDistricts =
      typeof districts === "string" ? JSON.parse(districts) : districts;
    if (!Array.isArray(targetDistricts)) targetDistricts = [];

    if (
      targetRegions.length === 0 &&
      targetStates.length === 0 &&
      targetDistricts.length === 0
    ) {
      return res.status(400).json({
        message:
          "At least one target location (geo, state, or district) is required",
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Invalid location format", error: err.message });
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

    const starsDeductionRate = 0.6;
    const starsToBeDeducted = userViewsNeeded * starsDeductionRate;

    if (userWallet.totalStars < starsToBeDeducted) {
      const starsShort = starsToBeDeducted - userWallet.totalStars;
      return res.status(401).json({
        message: `Insufficient stars. You need ${starsShort} more stars to post this ad.`,
      });
    }

    // Generate star payout plan
    const highvalueArray = [5, 4, 3, 2];
    const highValueRepetitions = Math.floor(userViewsNeeded / 100);
    let highValueStars = [];
    for (const value of highvalueArray) {
      const repeatedStars = Array(highValueRepetitions).fill(value);
      highValueStars.push(...repeatedStars);
    }

    const highValueTotal = highValueStars.reduce((acc, val) => acc + val, 0);
    const singleStarsCount = Math.floor(starsToBeDeducted - highValueTotal);
    const singleStars = Array(singleStarsCount).fill(1);
    const totalGiven = highValueStars.length + singleStars.length;
    const nullStarsCount = userViewsNeeded - totalGiven;
    const nullStars = Array(nullStarsCount).fill(0);
    const starPayoutPlan = [...highValueStars, ...singleStars, ...nullStars];

    // Deduct stars
    userWallet.totalStars -= starsToBeDeducted;
    await userWallet.save();

    // Save Ad URLs
    const imageUrl = `/imgAdUploads/${imageFile.filename}`;
    const audioUrl = audioFile ? `/imgAdUploads/${audioFile.filename}` : null;

    // ✅ Save image ad with clickUrl
    const imageAd = await ImageAd.create({
      title,
      description,
      imageUrl,
      audioUrl,
      clickUrl: clickUrl?.trim() || null, // Add to DB
      adPeriod: adRepetition ? parsedAdPeriod : 0,
      adRepetition,
      createdBy: user._id,
      userViewsNeeded,
      totalStarsAllocated: starsToBeDeducted,
      starPayoutPlan,
      targetRegions,
      targetStates,
      targetDistricts,
    });

    const ad = await Ad.create({ imgAdRef: imageAd._id });

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
  const {
    title,
    description,
    userViewsNeeded,
    adPeriod,
    locations,
    states,
    districts,
  } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Video file is required" });
  }

  if (!title || !description || !userViewsNeeded) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const parsedAdPeriod = parseFloat(adPeriod);
  const adRepetition = !isNaN(parsedAdPeriod) && parsedAdPeriod > 0;

  let targetRegions = [];
  let targetStates = [];
  let targetDistricts = [];

  try {
    // Parse locations
    const parsedLocations =
      typeof locations === "string" ? JSON.parse(locations) : locations;

    if (Array.isArray(parsedLocations)) {
      for (const loc of parsedLocations) {
        if (!loc.coords || !loc.radius) continue;

        const [latStr, lngStr] = loc.coords.split(",");
        const latitude = parseFloat(latStr);
        const longitude = parseFloat(lngStr);
        const radius = parseFloat(loc.radius);

        if (isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
          return res.status(400).json({ message: "Invalid location format" });
        }

        targetRegions.push({
          location: {
            type: "Point",
            coordinates: [latitude, longitude],
          },
          radius,
        });
      }
    }

    // Parse states
    targetStates = typeof states === "string" ? JSON.parse(states) : states;
    if (!Array.isArray(targetStates)) targetStates = [];

    // Parse districts
    targetDistricts =
      typeof districts === "string" ? JSON.parse(districts) : districts;
    if (!Array.isArray(targetDistricts)) targetDistricts = [];

    if (
      targetRegions.length === 0 &&
      targetStates.length === 0 &&
      targetDistricts.length === 0
    ) {
      return res.status(400).json({
        message:
          "At least one target location (geo, state, or district) is required",
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Invalid location format", error: err.message });
  }

  try {
    const user = await User.findById(id).populate("userWalletDetails");
    if (!user) return res.status(404).json({ message: "User not found" });

    const userWallet = user.userWalletDetails;
    if (!userWallet)
      return res.status(400).json({ message: "User wallet not found" });

    const viewsNeeded = parseInt(userViewsNeeded);
    if (isNaN(viewsNeeded) || viewsNeeded <= 0) {
      return res.status(400).json({ message: "Invalid userViewsNeeded value" });
    }

    const starsDeductionRate = 2.4;
    const starsToBeDeducted = viewsNeeded * starsDeductionRate;

    if (userWallet.totalStars < starsToBeDeducted) {
      const starsShort = starsToBeDeducted - userWallet.totalStars;
      return res.status(401).json({
        message: `Insufficient stars. You need ${starsShort} more stars to post this ad.`,
      });
    }

    // Star split logic: 40% 3-star, 60% 2-star
    const total3Stars = Math.floor((starsToBeDeducted * 0.4) / 3);
    const total2Stars = Math.floor((starsToBeDeducted * 0.6) / 2);
    const usedStars = total3Stars * 3 + total2Stars * 2;
    let remainingStars = Math.floor(starsToBeDeducted - usedStars);
    if (remainingStars < 0) remainingStars = 0;

    const highValueStars = [
      ...Array(total3Stars).fill(3),
      ...Array(total2Stars).fill(2),
      ...Array(remainingStars).fill(1),
    ];

    const totalGiven = highValueStars.length;
    let nullStarsCount = viewsNeeded - totalGiven;
    if (nullStarsCount < 0) nullStarsCount = 0;

    const nullStars = Array(nullStarsCount).fill(0);

    const starPayoutPlan = [...highValueStars, ...nullStars];

    // Deduct stars from wallet
    userWallet.totalStars -= starsToBeDeducted;
    await userWallet.save();

    const videoUrl = `/videoAdUploads/${req.file.filename}`;
    const videoAd = await VideoAd.create({
      title,
      description,
      videoUrl,
      adPeriod: adRepetition ? parsedAdPeriod : 0,
      adRepetition,
      createdBy: user._id,
      userViewsNeeded: viewsNeeded,
      totalStarsAllocated: starsToBeDeducted,
      starPayoutPlan,
      targetRegions,
      targetStates,
      targetDistricts,
    });

    const ad = await Ad.create({ videoAdRef: videoAd._id });

    user.ads.push(ad._id);
    await user.save();

    return res.status(200).json({
      message: "Video Ad created successfully and stars deducted",
      videoAd,
      ad,
      remainingStars: userWallet.totalStars,
    });
  } catch (error) {
    console.error("Error creating video ad:", error);
    return res.status(500).json({
      message: "Failed to create ad",
      error: error.message,
    });
  }
};

// ------------------- SURVEY AD -------------------


const createSurveyAd = async (req, res) => {
  const {
    title,
    description,
    userViewsNeeded,
    adPeriod,
    questions,
    states,
    districts,
    locations,
  } = req.body;
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "User ID is required" });
  if (!title || !description || !questions || !userViewsNeeded)
    return res.status(400).json({ message: "Missing required fields" });

  // Parse JSON fields sent as strings
  let parsedQuestions, parsedStates, parsedDistricts, parsedLocations;

  try {
    parsedQuestions = typeof questions === "string" ? JSON.parse(questions) : questions;
    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      return res.status(400).json({ message: "At least one question is required" });
    }

    parsedStates = typeof states === "string" ? JSON.parse(states) : states || [];
    parsedDistricts = typeof districts === "string" ? JSON.parse(districts) : districts || [];
    parsedLocations = typeof locations === "string" ? JSON.parse(locations) : locations || [];

    // Validate each question
    for (const [index, q] of parsedQuestions.entries()) {
      const { questionText, questionType, options } = q;

      if (!questionText || !questionType || !options) {
        return res.status(400).json({ message: `Missing fields in question ${index + 1}` });
      }

      if (!["yesno", "multiple"].includes(questionType)) {
        return res.status(400).json({ message: `Invalid questionType in question ${index + 1}` });
      }

      if (questionType === "yesno") {
        if (!Array.isArray(options) || options.length !== 2 || !options.includes("Yes") || !options.includes("No")) {
          return res.status(400).json({
            message: `Yes/No question ${index + 1} must have exactly ['Yes', 'No'] as options`,
          });
        }
      }

      if (questionType === "multiple" && (!Array.isArray(options) || options.length < 2)) {
        return res.status(400).json({
          message: `Multiple choice question ${index + 1} must have at least 2 options`,
        });
      }
    }
  } catch (err) {
    return res.status(400).json({ message: "Invalid JSON format", error: err.message });
  }

  // Validate at least one target location
  let targetRegions = [];
  try {
    for (const loc of parsedLocations) {
      if (!loc.coords || !loc.radius) continue;

      const [latStr, lngStr] = loc.coords.split(",");
      const latitude = parseFloat(latStr);
      const longitude = parseFloat(lngStr);
      const radius = parseFloat(loc.radius);

      if (isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
        return res.status(400).json({ message: "Invalid location format" });
      }

      targetRegions.push({
        location: {
          type: "Point",
          coordinates: [latitude, longitude],
        },
        radius,
      });
    }
  } catch (err) {
    return res.status(400).json({ message: "Error parsing locations", error: err.message });
  }

  if (
    targetRegions.length === 0 &&
    (!parsedStates || parsedStates.length === 0) &&
    (!parsedDistricts || parsedDistricts.length === 0)
  ) {
    return res.status(400).json({
      message: "At least one target location (geo, state, or district) is required",
    });
  }

  try {
    const user = await User.findById(id).populate("userWalletDetails");
    if (!user) return res.status(404).json({ message: "User not found" });

    const userWallet = user.userWalletDetails;
    if (!userWallet) return res.status(400).json({ message: "User wallet not found" });

    const viewsNeeded = parseInt(userViewsNeeded);
    if (isNaN(viewsNeeded) || viewsNeeded <= 0) {
      return res.status(400).json({ message: "Invalid userViewsNeeded value" });
    }

    // Star payout plan: 60% 2-star, 40% 3-star
    const percent2Star = 0.6;
    const percent3Star = 0.4;

    const total2Stars = Math.floor(viewsNeeded * percent2Star);
    const total3Stars = viewsNeeded - total2Stars;

    const starPayoutPlan = [
      ...Array(total3Stars).fill(3),
      ...Array(total2Stars).fill(2),
    ];

    const starsToBeDeducted = (total3Stars * 3) + (total2Stars * 2);

    if (userWallet.totalStars < starsToBeDeducted) {
      const starsShort = starsToBeDeducted - userWallet.totalStars;
      return res.status(401).json({
        message: `Insufficient stars. You need ${starsShort} more stars to post this ad.`,
      });
    }

    // Deduct stars
    userWallet.totalStars -= starsToBeDeducted;
    await userWallet.save();

    const imageUrl = req.file ? `/surveyAdUploads/${req.file.filename}` : "";

    const parsedAdPeriod = parseFloat(adPeriod);
    const adRepetition = !isNaN(parsedAdPeriod) && parsedAdPeriod > 0;

    const surveyAd = await SurveyAd.create({
      title,
      description,
      questions: parsedQuestions,
      createdBy: user._id,
      userViewsNeeded: viewsNeeded,
      totalStarsAllocated: starsToBeDeducted,
      starPayoutPlan,
      adPeriod: adRepetition ? parsedAdPeriod : 0,
      adRepetition,
      targetRegions,
      targetStates: parsedStates,
      targetDistricts: parsedDistricts,
      imageUrl: imageUrl,
    });

    const ad = await Ad.create({ surveyAdRef: surveyAd._id });

    user.ads.push(ad._id);
    await user.save();

    return res.status(200).json({
      message: "Survey Ad created successfully and stars deducted",
      surveyAd,
      ad,
      remainingStars: userWallet.totalStars,
    });
  } catch (error) {
    console.error("Error creating survey ad:", error);
    return res.status(500).json({
      message: "Failed to create survey ad",
      error: error.message,
    });
  }
};

// fetch single unVerifiedAds
const fetchSingleUnverifiedAd = async (req, res) => {
  const { id } = req.params;

  try {
    const ad = await Ad.findById(id)
      .populate("imgAdRef")
      .populate("videoAdRef")
      .populate("surveyAdRef");

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    const isImageAdUnverified = ad.imgAdRef && !ad.imgAdRef.isAdVerified;
    const isVideoAdUnverified = ad.videoAdRef && !ad.videoAdRef.isAdVerified;
    const isSurveyAdUnverified = ad.surveyAdRef && !ad.surveyAdRef.isAdVerified;

    // Return 403 if all types are either missing or verified
    if (!isImageAdUnverified && !isVideoAdUnverified && !isSurveyAdUnverified) {
      return res.status(403).json({ message: "Ad is already verified" });
    }

    const formattedAd = {
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

    return res.status(200).json({
      message: "Unverified ad fetched successfully",
      ad: formattedAd,
    });
  } catch (error) {
    console.error("Error fetching single unverified ad:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// fetching all the ads with isVerified:false for verification
const fetchAdsForVerification = async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const allAds = await Ad.find()
      .populate({
        path: "imgAdRef",
        match: {
          isAdVerified: false,
          isAdRejected: false,
          $or: [
            { assignedAdminId: null },
            { assignmentTime: { $lt: fiveMinutesAgo } }
          ]
        },
      })
      .populate({
        path: "videoAdRef",
        match: {
          isAdVerified: false,
          isAdRejected: false,
          $or: [
            { assignedAdminId: null },
            { assignmentTime: { $lt: fiveMinutesAgo } }
          ]
        },
      })
      .populate({
        path: "surveyAdRef",
        match: {
          isAdVerified: false,
          isAdRejected: false,
          $or: [
            { assignedAdminId: null },
            { assignmentTime: { $lt: fiveMinutesAgo } }
          ]
        },
      });

    const validAds = allAds.filter(
      (ad) => ad.imgAdRef || ad.videoAdRef || ad.surveyAdRef
    );

    if (!validAds.length) {
      return res.status(404).json({ message: "No ads available for verification" });
    }

    const adsWithVerificationStatus = validAds.map((ad) => ({
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
    }));

    return res.status(200).json({ ads: adsWithVerificationStatus });

  } catch (error) {
    console.error("Error fetching ads for verification:", error);
    return res.status(500).json({ message: "Internal server error" });
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
      imageAd:
        ad.imgAdRef && ad.imgAdRef.isAdVerified
          ? {
              ...ad.imgAdRef.toObject(),
              isVerified: ad.imgAdRef.isAdVerified,
            }
          : null,
      videoAd:
        ad.videoAdRef && ad.videoAdRef.isAdVerified
          ? {
              ...ad.videoAdRef.toObject(),
              isVerified: ad.videoAdRef.isAdVerified,
            }
          : null,
      surveyAd:
        ad.surveyAdRef && ad.surveyAdRef.isAdVerified
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
// To fetch single verified ad

const fetchSingleVerifiedAd = async (req, res) => {
  const { adId } = req.params;

  try {
    const ad = await Ad.findById(adId)
      .populate("imgAdRef")
      .populate("videoAdRef")
      .populate("surveyAdRef");

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    const isImageAdVerified = ad.imgAdRef && ad.imgAdRef.isAdVerified;
    const isVideoAdVerified = ad.videoAdRef && ad.videoAdRef.isAdVerified;
    const isSurveyAdVerified = ad.surveyAdRef && ad.surveyAdRef.isAdVerified;

    if (!isImageAdVerified && !isVideoAdVerified && !isSurveyAdVerified) {
      return res.status(403).json({ message: "Ad is not verified" });
    }

    const formattedAd = {
      _id: ad._id,
      imageAd: isImageAdVerified
        ? {
            ...ad.imgAdRef.toObject(),
            isVerified: ad.imgAdRef.isAdVerified,
          }
        : null,
      videoAd: isVideoAdVerified
        ? {
            ...ad.videoAdRef.toObject(),
            isVerified: ad.videoAdRef.isAdVerified,
          }
        : null,
      surveyAd: isSurveyAdVerified
        ? {
            ...ad.surveyAdRef.toObject(),
            isVerified: ad.surveyAdRef.isAdVerified,
          }
        : null,
    };

    return res.status(200).json({
      message: "Verified ad fetched successfully",
      ad: formattedAd,
    });
  } catch (error) {
    console.error("Error fetching single verified ad:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// to fetch verified imageAd based on repation if any periodic fetchng and only if the view count is not reached
const fetchVerifiedImgAd = async (req, res) => {
  try {
    const { userId } = req.params;
    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const profileCoords = user.locationCoordinates
      ? { lat: user.locationCoordinates.lat, lng: user.locationCoordinates.lng }
      : null;

    const userState = user.state?.toLowerCase();
    const userDistrict = user.district?.toLowerCase();

    if (
      (!userLat || !userLng) &&
      !profileCoords &&
      !userState &&
      !userDistrict
    ) {
      return res.status(400).json({
        message:
          "No valid user location or region data available for ad matching",
      });
    }

    const allAds = await Ad.find().populate("imgAdRef");
    const currentDate = new Date();
    const verifiedImgAds = [];

    for (const ad of allAds) {
      const imgAd = ad.imgAdRef;
      if (!imgAd || imgAd.createdBy?.toString() === userId) continue;

      // 🔍 Region-based targeting
      const isUserInTargetRegion = imgAd.targetRegions?.some((region) => {
        if (!region?.location?.coordinates) return false;

        const [targetLat, targetLng] = region.location.coordinates;
        const radiusMeters = region.radius * 1000;

        const withinLiveLocation =
          userLat &&
          userLng &&
          calculateDistance(userLat, userLng, targetLat, targetLng) <=
            radiusMeters;

        const withinProfileLocation =
          profileCoords &&
          calculateDistance(
            profileCoords.lat,
            profileCoords.lng,
            targetLat,
            targetLng
          ) <= radiusMeters;

        return withinLiveLocation || withinProfileLocation;
      });

      // 🔍 State + District Targeting
      let isUserInTargetState = false;
      let isUserInTargetDistrict = false;

      if (imgAd.targetStates?.length > 0) {
        isUserInTargetState = imgAd.targetStates.some(
          (state) => state.toLowerCase() === userState
        );

        if (isUserInTargetState && imgAd.targetDistricts?.length > 0) {
          const normalizedDistricts = imgAd.targetDistricts.map((d) =>
            d.toLowerCase()
          );

          if (normalizedDistricts.includes("all")) {
            isUserInTargetDistrict = true;
          } else {
            isUserInTargetDistrict = normalizedDistricts.includes(userDistrict);
          }
        }
      }

      // ✅ Combined location targeting logic
      const matchesLocation =
        isUserInTargetRegion ||
        (isUserInTargetState && imgAd.targetDistricts.length === 0) ||
        (isUserInTargetState && isUserInTargetDistrict);

      if (!matchesLocation) continue;

      // ✅ Has user already seen the ad?
      const hasUserViewed = imgAd.viewersRewarded.some(
        (entry) => entry.userId.toString() === userId
      );

      // ✅ Is ad active?
      const adIsActive =
        imgAd.isAdVerified &&
        imgAd.isAdVisible &&
        imgAd.isAdOn &&
        imgAd.totalViewCount < imgAd.userViewsNeeded &&
        (!imgAd.adExpirationTime || imgAd.adExpirationTime > currentDate);

      if (adIsActive) {
        if (!imgAd.adRepetition && hasUserViewed) continue;

        if (imgAd.adRepetition) {
          const userSchedule = imgAd.adRepeatSchedule.find(
            (entry) => entry.userId.toString() === userId
          );
          if (userSchedule && userSchedule.nextScheduledAt > currentDate)
            continue;
        }

        verifiedImgAds.push({
          _id: ad._id,
          imageAd: {
            ...imgAd.toObject(),
            isVerified: imgAd.isAdVerified,
          },
        });
      } else {
        // Update expired or fully viewed ads
        const updateFields = {};
        let shouldUpdate = false;

        if (
          imgAd.totalViewCount >= imgAd.userViewsNeeded &&
          !imgAd.isViewsReached
        ) {
          updateFields.isViewsReached = true;
          shouldUpdate = true;
        }

        if (
          imgAd.adExpirationTime &&
          imgAd.adExpirationTime <= currentDate &&
          imgAd.isAdVisible
        ) {
          updateFields.isAdVisible = false;
          shouldUpdate = true;
        }

        if (shouldUpdate) {
          await ImageAd.findByIdAndUpdate(imgAd._id, updateFields);
        }
      }
    }

    if (verifiedImgAds.length === 0) {
      return res.status(404).json({
        message:
          "No verified and eligible image ads found for your location or region",
      });
    }

    return res.status(200).json({
      message: "Verified image ads fetched successfully",
      count:verifiedImgAds.length,
      ads: verifiedImgAds,
    });
  } catch (error) {
    console.error("Error fetching verified image ads:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// to fetch verified imageAd based on repation if any periodic fetchng and only if the view count is not reached
const fetchVerifiedVideoAd = async (req, res) => {  
  try {
    const { userId } = req.params;
    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const profileCoords = user.locationCoordinates
      ? { lat: user.locationCoordinates.lat, lng: user.locationCoordinates.lng }
      : null;

    const userState = user.state?.toLowerCase();
    const userDistrict = user.district?.toLowerCase();

    if (
      (!userLat || !userLng) &&
      !profileCoords &&
      !userState &&
      !userDistrict
    ) {
      return res.status(400).json({
        message:
          "No valid user location or region data available for ad matching",
      });
    }

    const allAds = await Ad.find().populate("videoAdRef");
    const currentDate = new Date();
    const verifiedVideoAds = [];

    for (const ad of allAds) {
      const videoAd = ad.videoAdRef;
      if (!videoAd || videoAd.createdBy?.toString() === userId) continue;

      // 🔍 Region-based targeting
      const isUserInTargetRegion = videoAd.targetRegions?.some((region) => {
        if (!region?.location?.coordinates) return false;

        const [targetLat, targetLng] = region.location.coordinates;
        const radiusMeters = region.radius * 1000;

        const withinLiveLocation =
          userLat &&
          userLng &&
          calculateDistance(userLat, userLng, targetLat, targetLng) <=
            radiusMeters;

        const withinProfileLocation =
          profileCoords &&
          calculateDistance(
            profileCoords.lat,
            profileCoords.lng,
            targetLat,
            targetLng
          ) <= radiusMeters;

        return withinLiveLocation || withinProfileLocation;
      });

      // 🔍 State + District Targeting
      let isUserInTargetState = false;
      let isUserInTargetDistrict = false;

      if (videoAd.targetStates?.length > 0) {
        isUserInTargetState = videoAd.targetStates.some(
          (state) => state.toLowerCase() === userState
        );

        if (isUserInTargetState && videoAd.targetDistricts?.length > 0) {
          const normalizedDistricts = videoAd.targetDistricts.map((d) =>
            d.toLowerCase()
          );

          if (normalizedDistricts.includes("all")) {
            isUserInTargetDistrict = true;
          } else {
            isUserInTargetDistrict = normalizedDistricts.includes(userDistrict);
          }
        }
      }

      // ✅ Combined location targeting logic
      const matchesLocation =
        isUserInTargetRegion ||
        (isUserInTargetState && videoAd.targetDistricts.length === 0) ||
        (isUserInTargetState && isUserInTargetDistrict);

      if (!matchesLocation) continue;

      // ✅ Has user already seen the ad?
      const hasUserViewed = videoAd.viewersRewarded.some(
        (entry) => entry.userId.toString() === userId
      );

      // ✅ Is ad active?
      const adIsActive =
        videoAd.isAdVerified &&
        videoAd.isAdVisible &&
        videoAd.isAdOn &&
        videoAd.totalViewCount < videoAd.userViewsNeeded &&
        (!videoAd.adExpirationTime || videoAd.adExpirationTime > currentDate);

      if (adIsActive) {
        if (!videoAd.adRepetition && hasUserViewed) continue;

        if (videoAd.adRepetition) {
          const userSchedule = videoAd.adRepeatSchedule.find(
            (entry) => entry.userId.toString() === userId
          );
          if (userSchedule && userSchedule.nextScheduledAt > currentDate)
            continue;
        }

        verifiedVideoAds.push({
          _id: ad._id,
          videoAd: {
            ...videoAd.toObject(),
            isVerified: videoAd.isAdVerified,
          },
        });
      } else {
        // Update expired or fully viewed ads
        const updateFields = {};
        let shouldUpdate = false;

        if (
          videoAd.totalViewCount >= videoAd.userViewsNeeded &&
          !videoAd.isViewsReached
        ) {
          updateFields.isViewsReached = true;
          shouldUpdate = true;
        }

        if (
          videoAd.adExpirationTime &&
          videoAd.adExpirationTime <= currentDate &&
          videoAd.isAdVisible
        ) {
          updateFields.isAdVisible = false;
          shouldUpdate = true;
        }

        if (shouldUpdate) {
          await VideoAd.findByIdAndUpdate(videoAd._id, updateFields);
        }
      }
    }

    if (verifiedVideoAds.length === 0) {
      return res.status(404).json({
        message:
          "No verified and eligible video ads found for your location or region",
      });
    }

    return res.status(200).json({
      message: "Verified video ads fetched successfully",
      count:verifiedVideoAds.length,
      ads: verifiedVideoAds,
    });
  } catch (error) {
    console.error("Error fetching verified video ads:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// to fetch verified surveyAd
const fetchVerifiedSurveyAd = async (req, res) => {
  try {
    const { userId } = req.params;
    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const profileCoords = user.locationCoordinates
      ? { lat: user.locationCoordinates.lat, lng: user.locationCoordinates.lng }
      : null;

    const userState = user.state?.toLowerCase();
    const userDistrict = user.district?.toLowerCase();

    if (
      (!userLat || !userLng) &&
      !profileCoords &&
      !userState &&
      !userDistrict
    ) {
      return res.status(400).json({
        message:
          "No valid user location or region data available for ad matching",
      });
    }

    const allAds = await Ad.find().populate("surveyAdRef");
    const currentDate = new Date();
    const verifiedSurveyAds = [];

    for (const ad of allAds) {
      const surveyAd = ad.surveyAdRef;
      if (!surveyAd || surveyAd.createdBy?.toString() === userId) continue;

      // ✅ Region-based targeting
      const isUserInTargetRegion = surveyAd.targetRegions?.some((region) => {
        if (!region?.location?.coordinates) return false;

        const [targetLat, targetLng] = region.location.coordinates;
        const radiusMeters = region.radius * 1000;

        const withinLiveLocation =
          userLat &&
          userLng &&
          calculateDistance(userLat, userLng, targetLat, targetLng) <=
            radiusMeters;

        const withinProfileLocation =
          profileCoords &&
          calculateDistance(
            profileCoords.lat,
            profileCoords.lng,
            targetLat,
            targetLng
          ) <= radiusMeters;

        return withinLiveLocation || withinProfileLocation;
      });

      // ✅ State + District Targeting
      let isUserInTargetState = false;
      let isUserInTargetDistrict = false;

      if (surveyAd.targetStates?.length > 0) {
        isUserInTargetState = surveyAd.targetStates.some(
          (state) => state.toLowerCase() === userState
        );

        if (isUserInTargetState && surveyAd.targetDistricts?.length > 0) {
          const normalizedDistricts = surveyAd.targetDistricts.map((d) =>
            d.toLowerCase()
          );
          if (normalizedDistricts.includes("all")) {
            isUserInTargetDistrict = true;
          } else {
            isUserInTargetDistrict = normalizedDistricts.includes(userDistrict);
          }
        }
      }

      const matchesLocation =
        isUserInTargetRegion ||
        (isUserInTargetState && surveyAd.targetDistricts.length === 0) ||
        (isUserInTargetState && isUserInTargetDistrict);

      if (!matchesLocation) continue;

      // ✅ Already completed check
      const hasUserCompleted = surveyAd.usersCompleted?.some(
        (entry) => entry.userId.toString() === userId
      );

      // ✅ Active status
      const adIsActive =
        surveyAd.isAdVerified &&
        surveyAd.isAdVisible &&
        surveyAd.isAdOn &&
        surveyAd.totalResponses < surveyAd.responseLimit &&
        (!surveyAd.adExpirationTime || surveyAd.adExpirationTime > currentDate);

      if (adIsActive) {
        if (!surveyAd.adRepetition && hasUserCompleted) continue;

        if (surveyAd.adRepetition) {
          const userSchedule = surveyAd.repeatSchedule?.find(
            (entry) => entry.userId.toString() === userId
          );
          if (userSchedule && userSchedule.nextScheduledAt > currentDate)
            continue;
        }

        verifiedSurveyAds.push({
          _id: ad._id,
          surveyAd: {
            ...surveyAd.toObject(),
            isVerified: surveyAd.isAdVerified,
          },
        });
      } else {
        const updateFields = {};
        let shouldUpdate = false;

        if (
          surveyAd.totalResponses >= surveyAd.responseLimit &&
          !surveyAd.isResponsesReached
        ) {
          updateFields.isResponsesReached = true;
          shouldUpdate = true;
        }

        if (
          surveyAd.adExpirationTime &&
          surveyAd.adExpirationTime <= currentDate &&
          surveyAd.isAdVisible
        ) {
          updateFields.isAdVisible = false;
          shouldUpdate = true;
        }

        if (shouldUpdate) {
          await SurveyAd.findByIdAndUpdate(surveyAd._id, updateFields);
        }
      }
    }

    if (verifiedSurveyAds.length === 0) {
      return res.status(404).json({
        message:
          "No verified and eligible survey ads found for your location or region",
      });
    }

    return res.status(200).json({
      message: "Verified survey ads fetched successfully",
      ads: verifiedSurveyAds,
    });
  } catch (error) {
    console.error("Error fetching verified survey ads:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// to watch ads,star split,view count
const viewAd = async (req, res) => {
  const { id, adId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(id)
      .populate("userWalletDetails")
      .session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(400).json({ message: "User not found" });
    }

    const ad = await Ad.findById(adId)
      .populate("imgAdRef")
      .populate("videoAdRef")
      .populate("surveyAdRef")
      .session(session);

    if (!ad) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Ad not found" });
    }

    const adTypes = [
      { ref: ad.imgAdRef, type: "Image" },
      { ref: ad.videoAdRef, type: "Video" },
      { ref: ad.surveyAdRef, type: "Survey" },
    ];

    const adObj = adTypes.find(({ ref }) => ref && ref.isAdVerified)?.ref;
    const adType = adTypes.find(({ ref }) => ref && ref.isAdVerified)?.type;

    if (!adObj) {
      await session.abortTransaction();
      return res.status(403).json({
        message: "Ad is not verified or not found in any category",
      });
    }

    const now = new Date();

    const previouslyRewarded = adObj.viewersRewarded.find(
      (entry) => entry.userId.toString() === id
    );

    // Check for user's repeat schedule (latest, since we now ensure only one entry)
    const userRepeat = adObj.adRepeatSchedule.find(
      (entry) => entry.userId.toString() === id
    );

    // If repetition is off and user already rewarded
    if (!adObj.adRepetition && previouslyRewarded) {
      await session.abortTransaction();
      return res.status(409).json({
        message: "User has already viewed this ad",
      });
    }

    // If repetition is on and the user is not yet eligible again
    if (adObj.adRepetition && userRepeat && userRepeat.nextScheduledAt > now) {
      const waitTime = (userRepeat.nextScheduledAt - now) / 1000 / 60;
      await session.abortTransaction();
      return res.status(429).json({
        message: `Ad will be available again in ${Math.ceil(
          waitTime
        )} minute(s)`,
      });
    }

    if (adObj.starPayoutPlan.length === 0) {
      await session.abortTransaction();
      return res.status(410).json({
        message: "All rewards have been claimed",
      });
    }

    // Rewarding
    const starsToGive = adObj.starPayoutPlan.shift();
    adObj.totalViewCount += 1;

    if (adObj.totalViewCount >= adObj.userViewsNeeded) {
      adObj.isViewsReached = true;
    }

    adObj.viewersRewarded.push({
      userId: user._id,
      starsGiven: starsToGive,
      rewardedAt: now,
    });

    if (adObj.adRepetition) {
      const nextScheduledAt = new Date(
        now.getTime() + adObj.adPeriod * 60 * 60 * 1000
      );

      const existingIndex = adObj.adRepeatSchedule.findIndex(
        (entry) => entry.userId.toString() === user._id.toString()
      );

      if (existingIndex !== -1) {
        adObj.adRepeatSchedule[existingIndex].viewsRepatitionCount += 1;
        adObj.adRepeatSchedule[existingIndex].nextScheduledAt = nextScheduledAt;
      } else {
        adObj.adRepeatSchedule.push({
          userId: user._id,
          viewsRepatitionCount: 1,
          nextScheduledAt,
        });
      }
    }

    const wallet = user.userWalletDetails;
    if (!wallet) {
      await session.abortTransaction();
      return res.status(500).json({
        message: "User wallet not found",
      });
    }

    wallet.totalStars += starsToGive;
    wallet.adWatchStars += starsToGive;
    wallet.lastUpdated = now;

    const alreadyViewed = user.viewedAds.some(
      (entry) => entry.adId.toString() === ad._id.toString()
    );

    if (!alreadyViewed) {
      user.viewedAds.push({
        adId: ad._id,
        viewedAt: now,
      });
    }

    await Promise.all([
      adObj.save({ session }),
      wallet.save({ session }),
      user.save({ session }),
    ]);

    await session.commitTransaction();

    return res.status(200).json({
      message: `${adType} Ad viewed successfully and stars rewarded`,
      starsRewarded: starsToGive,
      currentViewCount: adObj.totalViewCount,
      remainingPayouts: adObj.starPayoutPlan.length,
      isViewsReached: adObj.isViewsReached,
      nextAvailableAt: adObj.adRepetition
        ? new Date(
            now.getTime() + adObj.adPeriod * 60 * 60 * 1000
          ).toISOString()
        : null,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("Error viewing ad:", error);

    if (error.name === "VersionError") {
      return res.status(409).json({
        message: "The ad was modified by another operation. Please try again.",
        code: "VERSION_CONFLICT",
      });
    }

    if (error.name === "DocumentNotFoundError") {
      return res.status(404).json({
        message: "The ad or user was not found. It may have been deleted.",
        code: "DOCUMENT_NOT_FOUND",
      });
    }

    return res.status(500).json({
      message: "Error viewing ad",
      error: error.message,
      code: "INTERNAL_SERVER_ERROR",
    });
  } finally {
    session.endSession();
  }
};

// to on or off ads(toggle functionality)
const toggleAds = async (req, res) => {
  const { adId } = req.body;

  try {
    const specificAd = await Ad.findById(adId)
      .populate("imgAdRef")
      .populate("videoAdRef")
      .populate("surveyAdRef");

    if (!specificAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    let refAd = specificAd.imgAdRef || specificAd.videoAdRef || specificAd.surveyAdRef;

    if (!refAd) {
      return res.status(400).json({ message: "No referenced ad found to toggle" });
    }

    refAd.isAdOn = !refAd.isAdOn;
    await refAd.save();

    return res.status(200).json({
      message: `Ad has been ${refAd.isAdOn ? "enabled" : "disabled"}`,
      ad: specificAd, // includes populated ref with updated isAdOn
    });
  } catch (error) {
    console.error("Error toggling ad:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
// to edit imageAds
const editImageAd = async (req, res) => {
  const { adId } = req.params;
  const {
    title,
    description,
    adPeriod,
    locations,
    states,
    districts,
  } = req.body;

  // console.log("Looking for Ad with ID:", adId); // Debug log

  try {
    const ad = await Ad.findById(adId).populate("imgAdRef");
    
    // console.log("Found Ad:", ad); // Debug log
    
    if (!ad) {
      // console.log("Ad document not found");
      return res.status(404).json({ message: "Ad not found" });
    }
    
    if (!ad.imgAdRef) {
      // console.log("imgAdRef is null or undefined");
      return res.status(404).json({ message: "Image ad reference not found" });
    }
    
    if (!(ad.imgAdRef instanceof mongoose.Document)) {
      // console.log("imgAdRef is not a mongoose Document");
      // console.log("imgAdRef type:", typeof ad.imgAdRef);
      return res.status(404).json({ message: "Image ad reference is not a valid document" });
    }

    const imageAd = ad.imgAdRef;

    // 🔧 Update editable fields
    if (title) imageAd.title = title;
    if (description) imageAd.description = description;

    if (adPeriod) {
      const parsedAdPeriod = parseFloat(adPeriod);
      imageAd.adPeriod = !isNaN(parsedAdPeriod) && parsedAdPeriod > 0 ? parsedAdPeriod : 0;
      imageAd.adRepetition = parsedAdPeriod > 0;
    }

    try {
      // 🌍 Parse target regions
      const parsedLocations = typeof locations === "string" ? JSON.parse(locations) : locations;
      if (Array.isArray(parsedLocations)) {
        const targetRegions = [];

        for (const loc of parsedLocations) {
          if (!loc.coords || !loc.radius) continue;

          const [latStr, lngStr] = loc.coords.split(",");
          const latitude = parseFloat(latStr);
          const longitude = parseFloat(lngStr);
          const radius = parseFloat(loc.radius);

          if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(radius)) {
            targetRegions.push({
              location: {
                type: "Point",
                coordinates: [longitude, latitude], // ✅ [lng, lat] per GeoJSON standard
              },
              radius,
            });
          }
        }

        imageAd.targetRegions = targetRegions;
      }

      // 🏙️ States & Districts
      const parsedStates = typeof states === "string" ? JSON.parse(states) : states;
      if (Array.isArray(parsedStates)) {
        imageAd.targetStates = parsedStates;
      }

      const parsedDistricts = typeof districts === "string" ? JSON.parse(districts) : districts;
      if (Array.isArray(parsedDistricts)) {
        imageAd.targetDistricts = parsedDistricts;
      }

    } catch (err) {
      return res.status(400).json({ message: "Invalid location format", error: err.message });
    }

    // 🔄 Re-verification trigger
    if (imageAd.isAdVerified === true) {
      imageAd.isAdVerified = false;
    }

    await imageAd.save();

    return res.status(200).json({
      message: "Image Ad updated successfully. Ad is sent to admin for verification.",
      updatedAd: imageAd,
    });

  } catch (error) {
    console.error("Error updating image ad:", error);
    return res.status(500).json({ message: "Failed to update ad", error: error.message });
  }
}; 

// to edit videoAds
const editVideoAd=async(req,res)=>{
  const {adId}=req.params;
  const{
    title,
    description,
    adPeriod,
    locations,
    states,
    districts
  }=req.body;
  try {
    const ad =await Ad.findById(adId).populate("videoAdRef");
    if (!ad){
return res.status(404).json({message:"Ad not found"});
    }
    if(!ad.videoAdRef){
      //  console.log("imgAdRef is null or undefined");
      return res.status(404).json({ message: "Video ad reference not found" });
    }
    if(!(ad.videoAdRef instanceof mongoose.Document)){
         return res.status(404).json({ message: "Video ad reference is not a valid document" });
    }
    const videoAd=ad.videoAdRef;
    if(title) videoAd.title=title;
    if(description) videoAd.description=description;
    if (req.file) {
  videoAd.videoUrl = `/videoAdUploads/${req.file.filename}`; // Update this path if you serve files differently
}

    if(adPeriod){
      const parsedAdPeriod=parseFloat(adPeriod);
      videoAd.adPeriod=!isNaN(parsedAdPeriod)&&
      parsedAdPeriod>0?parsedAdPeriod:0;

    }
    try {
      // 🌍 Parse target regions
      const parsedLocations = typeof locations === "string" ? JSON.parse(locations) : locations;
      if (Array.isArray(parsedLocations)) {
        const targetRegions = [];

        for (const loc of parsedLocations) {
          if (!loc.coords || !loc.radius) continue;

          const [latStr, lngStr] = loc.coords.split(",");
          const latitude = parseFloat(latStr);
          const longitude = parseFloat(lngStr);
          const radius = parseFloat(loc.radius);

          if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(radius)) {
            targetRegions.push({
              location: {
                type: "Point",
                coordinates: [longitude, latitude], // ✅ [lng, lat] per GeoJSON standard
              },
              radius,
            });
          }
        }

        videoAd.targetRegions = targetRegions;
      }

      //  States & Districts
      const parsedStates = typeof states === "string" ? JSON.parse(states) : states;
      if (Array.isArray(parsedStates)) {
        videoAd.targetStates = parsedStates;
      }

      const parsedDistricts = typeof districts === "string" ? JSON.parse(districts) : districts;
      if (Array.isArray(parsedDistricts)) {
        videoAd.targetDistricts = parsedDistricts;
      }

    } catch (err) {
      return res.status(400).json({ message: "Invalid location format", error: err.message });
    }
 if (videoAd.isAdVerified === true) {
      videoAd.isAdVerified = false;
    }

    await videoAd.save();

    return res.status(200).json({
      message: "Video Ad updated successfully. Ad is sent to admin for verification.",
      updatedAd: videoAd,
    });

  } catch (error) {
    console.error("Error updating video ad:", error);
    return res.status(500).json({ message: "Failed to update ad", error: error.message });
  }

};




export {
  createImageAd,
  createVideoAd,
  createSurveyAd,
  fetchAdsForVerification,
  fetchVerifiedAds,
  fetchSingleUnverifiedAd,
  fetchSingleVerifiedAd,
  fetchVerifiedImgAd,
  fetchVerifiedVideoAd,
  fetchVerifiedSurveyAd,
  viewAd,
  toggleAds,
  editImageAd,
  editVideoAd
};
