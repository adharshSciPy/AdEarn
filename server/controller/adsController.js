import { ImageAd } from "../model/imageadModel.js";
import { VideoAd } from "../model/videoadModel.js";
import { SurveyAd } from "../model/surveyadModel.js";
import User from "../model/userModel.js";
import { Ad } from "../model/AdsModel.js";
import mongoose from "mongoose";
import { UserWallet } from "../model/userWallet.js";
import { sendNotification } from "../utils/sendNotifications.js";
import AdminWallet from "../model/adminwalletModel.js";
import SuperAdminWallet from "../model/superAdminWallet.js";
import { Admin } from "../model/adminModel.js";
import superAdminModel from "../model/superAdminModel.js";

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
const ADMIN_ROLE=process.env.ADMIN_ROLE;
const USER_ROLE=process.env.USER_ROLE;
const SUPER_ADMIN_ROLE=process.env.SUPER_ADMIN_ROLE;

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

  if (!id) return res.status(400).json({ message: "User ID is required" });
  if (!title || !description || !userViewsNeeded)
    return res.status(400).json({ message: "Missing required fields" });

  const imageFile = req.files?.imageAd?.[0];
  const audioFile = req.files?.audioAd?.[0];
  // if (!imageFile)
  //   return res.status(400).json({ message: "Image file is required" });
   let imageUrl = "";
  if (imageFile) {
    imageUrl = `/imgAdUploads/${imageFile.filename}`;
  } else if (req.body.existingImageUrl) {
    imageUrl =req.body.existingImageUrl;
  } else {
    return res.status(400).json({ message: "No image file or existing image URL provided." });
  }

  let audioUrl = null;
  if (audioFile) {
    audioUrl = `/imgAdUploads/${audioFile.filename}`;
  } else if (req.body.existingAudioUrl) {
    audioUrl = req.body.existingAudioUrl;
  }


  const parsedAdPeriod = parseFloat(adPeriod);
  const adRepetition = !isNaN(parsedAdPeriod) && parsedAdPeriod > 0;

  // Parse locations
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
    return res.status(400).json({
      message: "Invalid location format",
      error: err.message,
    });
  }

  try {
    const user = await User.findById(id).populate("userWalletDetails");
    if (!user) return res.status(404).json({ message: "User not found" });

    const userWallet = user.userWalletDetails;
    if (!userWallet)
      return res.status(400).json({ message: "User wallet not found" });

    //Deduction logic
    const starsDeductionRate = 0.6;
    const baseDeductedStars = userViewsNeeded * starsDeductionRate;

    // Extra stars
    const viewsChunk = Math.floor(userViewsNeeded / 100);
    const extraDeductedStars = viewsChunk * 5;

    const totalStarsToBeDeducted = baseDeductedStars + extraDeductedStars;
    if (userWallet.totalStars < totalStarsToBeDeducted) {
      const starsShort = totalStarsToBeDeducted - userWallet.totalStars;
      return res.status(401).json({
        message: `Insufficient stars. You need ${starsShort} more stars to post this ad.`,
      });
    }

    //Star payout plan
    const highvalueArray = [5, 4, 3, 2];
    const highValueRepetitions = Math.floor(userViewsNeeded / 100);
    let highValueStars = [];
    for (const value of highvalueArray) {
      const repeatedStars = Array(highValueRepetitions).fill(value);
      highValueStars.push(...repeatedStars);
    }

    const highValueTotal = highValueStars.reduce((acc, val) => acc + val, 0);
    const singleStarsCount = Math.floor(baseDeductedStars - highValueTotal);
    const singleStars = Array(singleStarsCount).fill(1);
    const totalGiven = highValueStars.length + singleStars.length;
    const nullStarsCount = userViewsNeeded - totalGiven;
    const nullStars = Array(nullStarsCount).fill(0);

    const starPayoutPlan = [
      ...highValueStars,
      ...singleStars,
      ...nullStars,
    ];

   
    userWallet.totalStars -= totalStarsToBeDeducted;
    await userWallet.save();

  
    // const imageUrl = `/imgAdUploads/${imageFile.filename}`;
    // const audioUrl = audioFile ? `/imgAdUploads/${audioFile.filename}` : null;

    const imageAd = await ImageAd.create({
      title,
      description,
      imageUrl,
      audioUrl,
      clickUrl: clickUrl?.trim() || null,
      adPeriod: adRepetition ? parsedAdPeriod : 0,
      adRepetition,
      createdBy: user._id,
      userViewsNeeded,
      totalStarsAllocated: baseDeductedStars,
      extraDeductedStars, 
      starPayoutPlan,
      targetRegions,
      targetStates,
      targetDistricts,
      paymentMode: "star",
      isPaymentCompleted: true,
      userShare: totalStarsToBeDeducted,
    });

    const ad = await Ad.create({ imgAdRef: imageAd._id });

    user.ads.push(ad._id);
    await user.save();
//     if (extraDeductedStars > 0) {
//   const superWallet = await SuperAdminWallet.findOne();
//   if (superWallet) {
//     superWallet.totalStars += extraDeductedStars;
//     superWallet.adExtraDeductions.push({
//       adId: ad._id,
//       adType: "Image Ad",
//       userId: user._id,
//       stars: extraDeductedStars,
//       status: "verified",
//     });
//     await superWallet.save();
//   }
// }


    return res.status(200).json({
      message: "Image Ad created successfully and stars deducted",
      imageAd,
      ad,
      baseDeductedStars,
      extraDeductedStars,
      totalDeducted: totalStarsToBeDeducted,
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
  if (!id) return res.status(400).json({ message: "User ID is required" });
  if (!title || !description || !userViewsNeeded)
    return res.status(400).json({ message: "Missing required fields" });

  
  let videoUrl = "";
  if (req.file) {
    videoUrl = `/videoAdUploads/${req.file.filename}`;
  } else if (req.body.existingVideoUrl) {
    videoUrl = req.body.existingVideoUrl;
  } else {
    return res.status(400).json({ message: "No video file or existing video URL provided." });
  }

  const parsedAdPeriod = parseFloat(adPeriod);
  const adRepetition = !isNaN(parsedAdPeriod) && parsedAdPeriod > 0;

  let targetRegions = [];
  let targetStates = [];
  let targetDistricts = [];

  try {
    const parsedLocations = typeof locations === "string" ? JSON.parse(locations) : locations;
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
          location: { type: "Point", coordinates: [latitude, longitude] },
          radius,
        });
      }
    }

    targetStates = typeof states === "string" ? JSON.parse(states) : states;
    if (!Array.isArray(targetStates)) targetStates = [];

    targetDistricts = typeof districts === "string" ? JSON.parse(districts) : districts;
    if (!Array.isArray(targetDistricts)) targetDistricts = [];

    if (
      targetRegions.length === 0 &&
      targetStates.length === 0 &&
      targetDistricts.length === 0
    ) {
      return res.status(400).json({
        message: "At least one target location (geo, state, or district) is required",
      });
    }
  } catch (err) {
    return res.status(400).json({ message: "Invalid location format", error: err.message });
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

    const starsDeductionRate = 2.4;
    const baseDeductedStars = viewsNeeded * starsDeductionRate;
    const viewsChunk = Math.floor(viewsNeeded / 100);
    const extraDeductedStars = viewsChunk * 5;
    const totalStarsToBeDeducted = baseDeductedStars + extraDeductedStars;

    if (userWallet.totalStars < totalStarsToBeDeducted) {
      const starsShort = totalStarsToBeDeducted - userWallet.totalStars;
      return res.status(401).json({
        message: `Insufficient stars. You need ${starsShort} more stars to post this ad.`,
      });
    }

    // Create payout plan for ONLY baseDeductedStars
    const total3Stars = Math.floor((baseDeductedStars * 0.4) / 3);
    const total2Stars = Math.floor((baseDeductedStars * 0.6) / 2);
    const usedStars = total3Stars * 3 + total2Stars * 2;
    let remainingStars = Math.floor(baseDeductedStars - usedStars);
    if (remainingStars < 0) remainingStars = 0;

    const highValueStars = [
      ...Array(total3Stars).fill(3),
      ...Array(total2Stars).fill(2),
      ...Array(remainingStars).fill(1),
    ];

    const totalGiven = highValueStars.length;
    let nullStarsCount = viewsNeeded - totalGiven;
    if (nullStarsCount < 0) nullStarsCount = 0;

    const starPayoutPlan = [
      ...highValueStars,
      ...Array(nullStarsCount).fill(0),
    ];

    // Deduct stars
    userWallet.totalStars -= totalStarsToBeDeducted;
    await userWallet.save();

    const videoAd = await VideoAd.create({
      title,
      description,
      videoUrl, // ✅ use the correct video URL
      adPeriod: adRepetition ? parsedAdPeriod : 0,
      adRepetition,
      createdBy: user._id,
      userViewsNeeded: viewsNeeded,
      totalStarsAllocated: baseDeductedStars,
      extraDeductedStars,
      starPayoutPlan,
      targetRegions,
      targetStates,
      targetDistricts,
      paymentMode: "star",
      isPaymentCompleted: true,
      userShare: totalStarsToBeDeducted,
    });

    const ad = await Ad.create({ videoAdRef: videoAd._id });

    user.ads.push(ad._id);
    await user.save();

    return res.status(200).json({
      message: "Video Ad created successfully and stars deducted",
      videoAd,
      ad,
      baseDeductedStars,
      extraDeductedStars,
      totalDeducted: totalStarsToBeDeducted,
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

  let parsedQuestions, parsedStates, parsedDistricts, parsedLocations;

  try {
    parsedQuestions = typeof questions === "string" ? JSON.parse(questions) : questions;
    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      return res.status(400).json({ message: "At least one question is required" });
    }

    parsedStates = typeof states === "string" ? JSON.parse(states) : states || [];
    parsedDistricts = typeof districts === "string" ? JSON.parse(districts) : districts || [];
    parsedLocations = typeof locations === "string" ? JSON.parse(locations) : locations || [];

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

    // ⭐ Same logic as video ad
    const starsDeductionRate = 2.4;
    const baseDeductedStars = viewsNeeded * starsDeductionRate;
    const viewsChunk = Math.floor(viewsNeeded / 100);
    const extraDeductedStars = viewsChunk * 5;
    const totalStarsToBeDeducted = baseDeductedStars + extraDeductedStars;

    if (userWallet.totalStars < totalStarsToBeDeducted) {
      const starsShort = totalStarsToBeDeducted - userWallet.totalStars;
      return res.status(401).json({
        message: `Insufficient stars. You need ${starsShort} more stars to post this ad.`,
      });
    }

    // Payout plan from baseDeductedStars only
    const total3Stars = Math.floor((baseDeductedStars * 0.4) / 3);
    const total2Stars = Math.floor((baseDeductedStars * 0.6) / 2);
    const usedStars = total3Stars * 3 + total2Stars * 2;
    let remainingStars = Math.floor(baseDeductedStars - usedStars);
    if (remainingStars < 0) remainingStars = 0;

    const highValueStars = [
      ...Array(total3Stars).fill(3),
      ...Array(total2Stars).fill(2),
      ...Array(remainingStars).fill(1),
    ];

    const totalGiven = highValueStars.length;
    let nullStarsCount = viewsNeeded - totalGiven;
    if (nullStarsCount < 0) nullStarsCount = 0;

    const starPayoutPlan = [
      ...highValueStars,
      ...Array(nullStarsCount).fill(0),
    ];

    // Deduct from user wallet
    userWallet.totalStars -= totalStarsToBeDeducted;
    await userWallet.save();

    // const imageUrl = req.file ? `/surveyAdUploads/${req.file.filename}` : "";
    let imageUrl = "";
if (req.file) {
  imageUrl = `/surveyAdUploads/${req.file.filename}`;
} else if (req.body.existingImageUrl) {
  imageUrl = req.body.existingImageUrl;
} else {
  return res.status(400).json({
    message: "No image file or existing image URL provided.",
  });
}


    const parsedAdPeriod = parseFloat(adPeriod);
    const adRepetition = !isNaN(parsedAdPeriod) && parsedAdPeriod > 0;

    const questionStats = parsedQuestions.map((q) => ({
      questionText: q.questionText,
      options: q.options,
      counts: q.options.map(() => 0),
      respondentNames: q.options.map(() => []),
    }));

      const surveyAd = await SurveyAd.create({
      title,
      description,
      imageUrl,
      questions: parsedQuestions,
      questionStats,
      createdBy: user._id,
      userViewsNeeded: viewsNeeded,
      totalStarsAllocated: baseDeductedStars,
      extraDeductedStars,
      starPayoutPlan,
      adPeriod: adRepetition ? parsedAdPeriod : 0,
      adRepetition,
      targetRegions,
      targetStates: parsedStates,
      targetDistricts: parsedDistricts,
      paymentMode: "star",
      isPaymentCompleted: true,
      userShare: totalStarsToBeDeducted,
    });

    const ad = await Ad.create({ surveyAdRef: surveyAd._id });
    user.ads.push(ad._id);
    await user.save();

    // // Handle extra deduction record (✅ same as video ad)
    // if (extraDeductedStars > 0) {
    //   const superWallet = await SuperAdminWallet.findOne();
    //   if (superWallet) {
    //     superWallet.totalStars += extraDeductedStars;
    //     superWallet.adExtraDeductions.push({
    //       adId: ad._id,
    //       adType: "Survey Ad",
    //       userId: user._id,
    //       stars: extraDeductedStars,
    //       status: "verified",
    //     });
    //     await superWallet.save();
    //   }
    // }

    return res.status(200).json({
      message: "Survey Ad created successfully and stars deducted",
      surveyAd,
      ad,
      baseDeductedStars,
      extraDeductedStars,
      totalDeducted: totalStarsToBeDeducted,
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


const submitSurveyResponse = async (req, res) => {
  const { surveyAdId, responses, userId } = req.body;

  if (!surveyAdId || !responses || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const surveyAd = await SurveyAd.findById(surveyAdId);
    if (!surveyAd) {
      return res.status(404).json({ message: "Survey Ad not found" });
    }

    if (!Array.isArray(surveyAd.questionStats)) {
      return res.status(500).json({ message: "Survey Ad has no questionStats field" });
    }

    if (surveyAd.isViewsReached) {
      return res.status(400).json({ message: "Survey has already ended" });
    }

    // ✅ Check if user already submitted
    const alreadySubmitted = surveyAd.questionStats.some((q) =>
      q.respondentNames?.some((arr) => Array.isArray(arr) && arr.includes(userId))
    );

    if (alreadySubmitted) {
      return res.status(400).json({ message: "You have already submitted this survey." });
    }

    // 🧍 Find user and wallet
    const user = await User.findById(userId).populate("userWalletDetails");
    if (!user || !user.userWalletDetails) {
      return res.status(404).json({ message: "User or wallet not found" });
    }

    // 🔄 Record response
    for (const [i, resItem] of responses.entries()) {
      const { selectedOption } = resItem;
      const stat = surveyAd.questionStats[i];

      if (!stat || !stat.options.includes(selectedOption)) continue;

      const optionIndex = stat.options.indexOf(selectedOption);

      if (!stat.respondentNames[optionIndex]) {
        stat.respondentNames[optionIndex] = [];
      }

      stat.counts[optionIndex] += 1;
      stat.respondentNames[optionIndex].push(userId); // Now using userId
    }

    // ⭐ Reward logic
    let starReward = 0;
    if (Array.isArray(surveyAd.starPayoutPlan) && surveyAd.starPayoutPlan.length > 0) {
      starReward = surveyAd.starPayoutPlan.shift();
      surveyAd.markModified("starPayoutPlan");
    }

    user.userWalletDetails.totalStars += starReward;
    await user.userWalletDetails.save();

    // ✅ Update view count
    surveyAd.totalViewCount += 1;
    if (surveyAd.totalViewCount >= surveyAd.userViewsNeeded) {
      surveyAd.isViewsReached = true;
    }

    await surveyAd.save();

    return res.status(200).json({
      message: `Response submitted successfully. You earned ${starReward} star(s).`,
      reward: starReward,
    });
  } catch (error) {
    console.error("Submit survey error:", error);
    return res.status(500).json({ message: "Failed to submit response", error: error.message });
  }
};

const getSurveyAdStats = async (req, res) => {
  const { surveyAdId } = req.params;

  try {
    const ad = await SurveyAd.findById(surveyAdId);

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    const totalResponses = ad.totalViewCount;

    const stats = ad.questionStats.map((q) => {
      const percentages = q.counts.map((count) =>
        totalResponses === 0 ? 0 : parseFloat(((count / totalResponses) * 100).toFixed(2))
      );

      return {
        question: q.questionText,
        options: q.options,
        counts: q.counts,
        percentages, // same order as options
      };
    });

    return res.status(200).json({ surveyAdId, totalResponses, stats });
  } catch (error) {
    console.error("getSurveyAdStats error:", error);
    return res.status(500).json({ message: "Failed to fetch stats", error: error.message });
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

    // Step 1: Fetch all ads that have at least one ad reference
    const allAds = await Ad.find({
      $or: [
        { imgAdRef: { $ne: null } },
        { videoAdRef: { $ne: null } },
        { surveyAdRef: { $ne: null } },
      ],
    })
      .populate("imgAdRef")
      .populate("videoAdRef")
      .populate("surveyAdRef");

    // Step 2: Filter ads with at least one unverified & assignable ad
    const validAds = allAds.filter((ad) => {
      const img = ad.imgAdRef;
      const vid = ad.videoAdRef;
      const survey = ad.surveyAdRef;

      return (
        (img &&
          img.isPaymentCompleted &&
          !img.isAdVerified &&
          !img.isAdRejected &&
          (!img.assignedAdminId || new Date(img.assignmentTime) < fiveMinutesAgo)) ||

        (vid &&
          vid.isPaymentCompleted &&
          !vid.isAdVerified &&
          !vid.isAdRejected &&
          (!vid.assignedAdminId || new Date(vid.assignmentTime) < fiveMinutesAgo)) ||

        (survey &&
          survey.isPaymentCompleted &&
          !survey.isAdVerified &&
          !survey.isAdRejected &&
          (!survey.assignedAdminId || new Date(survey.assignmentTime) < fiveMinutesAgo))
      );
    });

    // Step 3: Prepare the response
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

    if (!adsWithVerificationStatus.length) {
      return res
        .status(404)
        .json({ message: "No ads available for verification" });
    }

    return res
      .status(200)
      .json({ count: adsWithVerificationStatus.length, ads: adsWithVerificationStatus });

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
    let userLat = parseFloat(req.query.lat);
    let userLng = parseFloat(req.query.lng);

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
    let userLat = parseFloat(req.query.lat);
    let userLng = parseFloat(req.query.lng);

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

    let userLat = parseFloat(req.query.lat); // ✅ use let, not const
    let userLng = parseFloat(req.query.lng);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fallback to profile coordinates
    if (isNaN(userLat) || isNaN(userLng)) {
      if (user.locationCoordinates) {
        userLat = user.locationCoordinates.lat;
        userLng = user.locationCoordinates.lng;
      }
    }

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
        message: "No valid user location or region data available for ad matching",
      });
    }

    const allAds = await Ad.find().populate("surveyAdRef");
    const currentDate = new Date();
    const verifiedSurveyAds = [];

    for (const ad of allAds) {
      let surveyAd = ad.surveyAdRef;
      if (!surveyAd) continue;
      if (surveyAd.createdBy?.toString() === userId) continue;

      //  Region-based targeting
      const isUserInTargetRegion = surveyAd.targetRegions?.some((region) => {
        if (!region?.location?.coordinates) return false;

        const [lat, lng] = region.location.coordinates;
        const radiusMeters = region.radius * 1000;

        const withinLiveLocation =
          userLat &&
          userLng &&
          calculateDistance(userLat, userLng, lat, lng) <= radiusMeters;

        const withinProfileLocation =
          profileCoords &&
          calculateDistance(profileCoords.lat, profileCoords.lng, lat, lng) <= radiusMeters;

        return withinLiveLocation || withinProfileLocation;
      });

      // State & District targeting
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
          isUserInTargetDistrict =
            normalizedDistricts.includes("all") ||
            normalizedDistricts.includes(userDistrict);
        }
      }

      const matchesLocation =
        isUserInTargetRegion ||
        (isUserInTargetState && surveyAd.targetDistricts.length === 0) ||
        (isUserInTargetState && isUserInTargetDistrict);

      if (!matchesLocation) continue;

      // Check if already completed
      const hasUserCompleted = surveyAd.usersCompleted?.some(
        (entry) => entry.userId.toString() === userId
      );

      // ✅ Check ad is active
      const adIsActive =
        surveyAd.isAdVerified &&
        surveyAd.isAdVisible &&
        surveyAd.isAdOn &&
        surveyAd.totalViewCount < surveyAd.userViewsNeeded &&
        (!surveyAd.adExpirationTime || surveyAd.adExpirationTime > currentDate);

      if (adIsActive) {
        if (!surveyAd.adRepetition && hasUserCompleted) continue;

        if (surveyAd.adRepetition) {
          const userSchedule = surveyAd.repeatSchedule?.find(
            (entry) => entry.userId.toString() === userId
          );
          if (userSchedule && userSchedule.nextScheduledAt > currentDate) continue;
        }

        verifiedSurveyAds.push({
          _id: ad._id,
          surveyAd: {
            ...surveyAd.toObject(),
            isVerified: surveyAd.isAdVerified,
          },
        });
      } else {
        // 🔄 Update status if needed
        const updateFields = {};
        let shouldUpdate = false;

        if (
          surveyAd.totalViewCount >= surveyAd.userViewsNeeded &&
          !surveyAd.isViewsReached
        ) {
          updateFields.isViewsReached = true;
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
        message: "No verified and eligible survey ads found for your location or region",
      });
    }

    return res.status(200).json({
      message: "Verified survey ads fetched successfully",
      ads: verifiedSurveyAds,
    });
  } catch (error) {
    console.error("❌ Error fetching verified survey ads:", error);
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
// to post image ad with payment method
const createImageAdDraft = async (req, res) => {
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

  const { id: userId } = req.params;
  const imageFile = req.files?.imageAd?.[0];
  const audioFile = req.files?.audioAd?.[0];

  if (!userId || !title || !description || !userViewsNeeded || !imageFile) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const parsedAdPeriod = parseFloat(adPeriod) || 0;
    const adRepetition = parsedAdPeriod > 0;

    // Parse location input
    let targetRegions = [];
    let targetStates = Array.isArray(states) ? states : JSON.parse(states || "[]");
    let targetDistricts = Array.isArray(districts) ? districts : JSON.parse(districts || "[]");
    const parsedLocations = Array.isArray(locations) ? locations : JSON.parse(locations || "[]");

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
            coordinates: [latitude, longitude],
          },
          radius,
        });
      }
    }

    // Calculation
    const starsDeductionRate = 0.6;
    const baseDeductedStars = userViewsNeeded * starsDeductionRate;
    const extraDeductedStars = 0;
    const conversionRate = 4;
    const percentageToUser = 60;

    const totalStarsGenerated = baseDeductedStars * (100 / percentageToUser);
    const rupeesToPay = totalStarsGenerated / conversionRate;

    const userShare = baseDeductedStars;
    const superAdminShare = totalStarsGenerated * 0.2;
    const adminShare = totalStarsGenerated * 0.1;
    const referredUserShare = totalStarsGenerated * 0.1;

    // Star payout plan
    const highvalueArray = [5, 4, 3, 2];
    const highValueRepetitions = Math.floor(userViewsNeeded / 100);
    let highValueStars = [];
    for (const value of highvalueArray) {
      highValueStars.push(...Array(highValueRepetitions).fill(value));
    }
    const highValueTotal = highValueStars.reduce((a, b) => a + b, 0);
    const singleStarsCount = Math.floor(baseDeductedStars - highValueTotal);
    const starPayoutPlan = [
      ...highValueStars,
      ...Array(singleStarsCount).fill(1),
      ...Array(userViewsNeeded - (highValueStars.length + singleStarsCount)).fill(0),
    ];

    const imageUrl = `/imgAdUploads/${imageFile.filename}`;
    const audioUrl = audioFile ? `/imgAdUploads/${audioFile.filename}` : null;

    const imageAd = await ImageAd.create({
      title,
      description,
      imageUrl,
      audioUrl,
      clickUrl: clickUrl?.trim() || null,
      adPeriod: adRepetition ? parsedAdPeriod : 0,
      adRepetition,
      createdBy: user._id,
      userViewsNeeded,
      totalStarsAllocated: baseDeductedStars,
      extraDeductedStars,
      starPayoutPlan,
      targetRegions,
      targetStates,
      targetDistricts,
      paymentMode: "payment",
      isPaymentCompleted: false,
      amountToPay: rupeesToPay,
      userShare,
      superAdminShare,
      adminShare,
      referredUserShare,
    });

    const ad = await Ad.create({ imgAdRef: imageAd._id });
    user.ads.push(ad._id);
    await user.save();

    return res.status(200).json({
      message: "Ad draft created. Proceed to payment.",
      adId: ad._id,
      amountToPay: rupeesToPay.toFixed(2),
      imageAd,
    });
  } catch (err) {
    console.error("Error creating ad draft:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
//to create video ad with payment method
const createVideoAdDraft = async (req, res) => {
  const {
    title,
    description,
    userViewsNeeded,
    adPeriod,
    locations,
    states,
    districts,
  } = req.body;

  const { id: userId } = req.params;
  const videoFile = req.file;

  if (!userId || !title || !description || !userViewsNeeded || !videoFile) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const parsedAdPeriod = parseFloat(adPeriod) || 0;
    const adRepetition = parsedAdPeriod > 0;

    // Parse location input
    let targetRegions = [];
    let targetStates = Array.isArray(states) ? states : JSON.parse(states || "[]");
    let targetDistricts = Array.isArray(districts) ? districts : JSON.parse(districts || "[]");
    const parsedLocations = Array.isArray(locations) ? locations : JSON.parse(locations || "[]");

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
            coordinates: [latitude, longitude],
          },
          radius,
        });
      }
    }

    // Video Ad Plan
    const viewsNeeded = parseInt(userViewsNeeded);
    const starsDeductionRate = 2.4;
    const baseDeductedStars = viewsNeeded * starsDeductionRate;

    const extraDeductedStars = 0; // No extra deduction
    const totalStarsToBeDeducted = baseDeductedStars;

    const conversionRate = 4; // 4 stars = ₹1
    const percentageToUser = 60;

    const totalStarsGenerated = baseDeductedStars * (100 / percentageToUser);
    const rupeesToPay = totalStarsGenerated / conversionRate;

    const userShare = baseDeductedStars;
    const superAdminShare = totalStarsGenerated * 0.2;
    const adminShare = totalStarsGenerated * 0.1;
    const referredUserShare = totalStarsGenerated * 0.1;

    // ✅ Star payout plan: strictly within viewsNeeded
    let starsLeft = Math.floor(baseDeductedStars);
    const totalViews = viewsNeeded;

    const max3Stars = Math.floor((starsLeft * 0.4) / 3);
    const max2Stars = Math.floor((starsLeft * 0.6) / 2);

    let payout = [];
    let count = 0;

    // Add 3-star
    for (let i = 0; i < max3Stars && count < totalViews; i++) {
      payout.push(3);
      starsLeft -= 3;
      count++;
    }

    // Add 2-star
    for (let i = 0; i < max2Stars && count < totalViews; i++) {
      payout.push(2);
      starsLeft -= 2;
      count++;
    }

    // Add 1-star if still stars left
    while (starsLeft > 0 && count < totalViews) {
      payout.push(1);
      starsLeft -= 1;
      count++;
    }

    // Fill rest with 0s if needed
    while (count < totalViews) {
      payout.push(0);
      count++;
    }

    const videoUrl = `/videoAdUploads/${videoFile.filename}`;

    const videoAd = await VideoAd.create({
      title,
      description,
      videoUrl,
      adPeriod: adRepetition ? parsedAdPeriod : 0,
      adRepetition,
      createdBy: user._id,
      userViewsNeeded: viewsNeeded,
      totalStarsAllocated: baseDeductedStars,
      extraDeductedStars,
      starPayoutPlan: payout,
      targetRegions,
      targetStates,
      targetDistricts,
      paymentMode: "payment",
      isPaymentCompleted: false,
      amountToPay: rupeesToPay,
      userShare,
      superAdminShare,
      adminShare,
      referredUserShare,
    });

    const ad = await Ad.create({ videoAdRef: videoAd._id });
    user.ads.push(ad._id);
    await user.save();

    return res.status(200).json({
      message: "Video ad draft created. Proceed to payment.",
      adId: ad._id,
      amountToPay: rupeesToPay.toFixed(2),
      videoAd,
    });
  } catch (err) {
    console.error("Error creating video ad draft:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
const createSurveyAdDraft = async (req, res) => {
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

  const { id: userId } = req.params;

  if (!userId || !title || !description || !questions || !userViewsNeeded) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  let parsedQuestions, parsedStates, parsedDistricts, parsedLocations;

  try {
    parsedQuestions = typeof questions === "string" ? JSON.parse(questions) : questions;
    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      return res.status(400).json({ message: "At least one question is required" });
    }

    parsedStates = Array.isArray(states) ? states : JSON.parse(states || "[]");
    parsedDistricts = Array.isArray(districts) ? districts : JSON.parse(districts || "[]");
    parsedLocations = Array.isArray(locations) ? locations : JSON.parse(locations || "[]");

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

  // Process location
  let targetRegions = [];
  try {
    for (const loc of parsedLocations) {
      if (!loc.coords || !loc.radius) continue;
      const [latStr, lngStr] = loc.coords.split(",");
      const latitude = parseFloat(latStr);
      const longitude = parseFloat(lngStr);
      const radius = parseFloat(loc.radius);

      if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(radius)) {
        targetRegions.push({
          location: { type: "Point", coordinates: [latitude, longitude] },
          radius,
        });
      }
    }
  } catch (err) {
    return res.status(400).json({ message: "Invalid location format", error: err.message });
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
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const viewsNeeded = parseInt(userViewsNeeded);
    if (isNaN(viewsNeeded) || viewsNeeded <= 0) {
      return res.status(400).json({ message: "Invalid userViewsNeeded value" });
    }

    // Cost calculation logic
    const starsDeductionRate = 2.4;
    const baseDeductedStars = viewsNeeded * starsDeductionRate;
    const extraDeductedStars = 0;
    const totalStarsToBeDeducted = baseDeductedStars;

    const conversionRate = 4; // 4 stars = ₹1
    const percentageToUser = 60;

    const totalStarsGenerated = baseDeductedStars * (100 / percentageToUser);
    const rupeesToPay = totalStarsGenerated / conversionRate;

    const userShare = baseDeductedStars;
    const superAdminShare = totalStarsGenerated * 0.2;
    const adminShare = totalStarsGenerated * 0.1;
    const referredUserShare = totalStarsGenerated * 0.1;

    // Build star payout plan
    let starsLeft = Math.floor(baseDeductedStars);
    const totalViews = viewsNeeded;

    const max3Stars = Math.floor((starsLeft * 0.4) / 3);
    const max2Stars = Math.floor((starsLeft * 0.6) / 2);

    let payout = [];
    let count = 0;

    for (let i = 0; i < max3Stars && count < totalViews; i++) {
      payout.push(3);
      starsLeft -= 3;
      count++;
    }

    for (let i = 0; i < max2Stars && count < totalViews; i++) {
      payout.push(2);
      starsLeft -= 2;
      count++;
    }

    while (starsLeft > 0 && count < totalViews) {
      payout.push(1);
      starsLeft -= 1;
      count++;
    }

    while (count < totalViews) {
      payout.push(0);
      count++;
    }

    const parsedAdPeriod = parseFloat(adPeriod) || 0;
    const adRepetition = parsedAdPeriod > 0;

    const questionStats = parsedQuestions.map((q) => ({
      questionText: q.questionText,
      options: q.options,
      counts: q.options.map(() => 0),
      respondentNames: q.options.map(() => []),
    }));

    const imageUrl = req.file ? `/surveyAdUploads/${req.file.filename}` : "";

    const surveyAd = await SurveyAd.create({
      title,
      description,
      imageUrl,
      questions: parsedQuestions,
      questionStats,
      createdBy: user._id,
      userViewsNeeded: viewsNeeded,
      totalStarsAllocated: baseDeductedStars,
      extraDeductedStars,
      starPayoutPlan: payout,
      adPeriod: adRepetition ? parsedAdPeriod : 0,
      adRepetition,
      targetRegions,
      targetStates: parsedStates,
      targetDistricts: parsedDistricts,
      paymentMode: "payment",
      isPaymentCompleted: false,
      amountToPay: rupeesToPay,
      userShare,
      superAdminShare,
      adminShare,
      referredUserShare,
    });

    const ad = await Ad.create({ surveyAdRef: surveyAd._id });
    user.ads.push(ad._id);
    await user.save();

    return res.status(200).json({
      message: "Survey ad draft created. Proceed to payment.",
      adId: ad._id,
      amountToPay: rupeesToPay.toFixed(2),
      surveyAd,
    });
  } catch (err) {
    console.error("Error creating survey ad draft:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};





// to confirm the status of the payment and to deliver star shares to respective wallets
const confirmAdPayment = async (req, res) => {
  const { adId } = req.params;
  const { io, connectedUsers } = req;

  try {
    const ad = await Ad.findById(adId)
      .populate("imgAdRef")
      .populate("videoAdRef")
      .populate("surveyAdRef");

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    const adRef = ad.imgAdRef || ad.videoAdRef || ad.surveyAdRef;
    if (!adRef) return res.status(404).json({ message: "No linked ad found" });
    if (adRef.isPaymentCompleted) return res.status(400).json({ message: "Payment already confirmed" });

    const user = await User.findById(adRef.createdBy)
      .populate("userWalletDetails")
      .populate("referedBy");

    if (!user) return res.status(404).json({ message: "User not found" });

    const wallet = user.userWalletDetails;
    if (!wallet) return res.status(404).json({ message: "User wallet not found" });

    const {
      userShare,
      superAdminShare,
      adminShare,
      referredUserShare,
    } = adRef;

    console.log("Shares →", {
      userShare,
      superAdminShare,
      adminShare,
      referredUserShare,
    });

    // Validate shares are numbers
    if ([userShare, superAdminShare, adminShare, referredUserShare].some(s => typeof s !== "number" || isNaN(s))) {
      throw new Error("Invalid share values: One or more shares are NaN");
    }

    //Update user wallet
    if (typeof wallet.totalStars !== "number" || isNaN(wallet.totalStars)) {
      wallet.totalStars = 0;
    }
    wallet.totalStars += Math.floor(userShare);
    wallet.starBought.push({
      starsNeeded: Math.floor(userShare),
      paymentStatus: "completed",
    });
    await wallet.save();

    //Handle referred user
    let referredUserNotification = null;
    if (user.referedBy) {
      const referredUser = await User.findById(user.referedBy).populate("userWalletDetails");
      if (referredUser?.userWalletDetails) {
        const referredWallet = referredUser.userWalletDetails;

        if (typeof referredWallet.totalStars !== "number" || isNaN(referredWallet.totalStars)) {
          referredWallet.totalStars = 0;
        }

        referredWallet.totalStars += Math.floor(referredUserShare);
        referredWallet.starBought.push({
          starsNeeded: Math.floor(referredUserShare),
          paymentStatus: "completed",
        });
        referredWallet.referralTransactions.push({
          fromUser: user._id,
          starsReceived: Math.floor(referredUserShare),
        });

        await referredWallet.save();

        referredUser.referalCredits += Math.floor(referredUserShare);
        await referredUser.save();

        referredUserNotification = sendNotification(
          referredUser._id,
          USER_ROLE,
          `You received ${Math.floor(referredUserShare)} stars as referral bonus from ${user.firstName}'s ad payment!`,
          io,
          connectedUsers
        );
      }
    } else {
      //Fallback to first user
      const firstUser = await User.findOne().sort({ createdAt: 1 }).populate("userWalletDetails");
      if (firstUser?.userWalletDetails) {
        const firstWallet = firstUser.userWalletDetails;

        if (typeof firstWallet.totalStars !== "number" || isNaN(firstWallet.totalStars)) {
          firstWallet.totalStars = 0;
        }

        firstWallet.totalStars += Math.floor(referredUserShare);
        firstWallet.starBought.push({
          starsNeeded: Math.floor(referredUserShare),
          paymentStatus: "completed",
        });
        firstWallet.referralTransactions.push({
          fromUser: user._id,
          starsReceived: Math.floor(referredUserShare),
        });

        await firstWallet.save();
      }
    }

    //Admin wallet
    let adminWallet = await AdminWallet.findOne();
    if (!adminWallet) {
      adminWallet = new AdminWallet({
        totalStars: Math.floor(adminShare),
        transactions: [{
          userId: user._id,
          starsReceived: Math.floor(adminShare),
        }],
      });
    } else {
      if (typeof adminWallet.totalStars !== "number" || isNaN(adminWallet.totalStars)) {
        adminWallet.totalStars = 0;
      }

      adminWallet.totalStars += Math.floor(adminShare);
      adminWallet.transactions.push({
        userId: user._id,
        starsReceived: Math.floor(adminShare),
      });
    }
    await adminWallet.save();

    //Super admin wallet
    let superAdminWallet = await SuperAdminWallet.findOne(); 
    if (!superAdminWallet) {
      superAdminWallet = new SuperAdminWallet({
        totalStars: Math.floor(superAdminShare),
        transactions: [{
          userId: user._id,
          starsReceived: Math.floor(superAdminShare),
        }],
      });
    } else {
      if (typeof superAdminWallet.totalStars !== "number" || isNaN(superAdminWallet.totalStars)) {
        superAdminWallet.totalStars = 0;
      }

      superAdminWallet.totalStars += Math.floor(superAdminShare);
      superAdminWallet.transactions.push({
        userId: user._id,
        starsReceived: Math.floor(superAdminShare),
      });
    }
    await superAdminWallet.save();

    // Send notifications
    const adminUsers = await Admin.find({ adminRole: ADMIN_ROLE });
    const superAdminUser = await superAdminModel.findOne({ role: SUPER_ADMIN_ROLE });

    const notificationsToSend = [
      sendNotification(
        user._id,
        USER_ROLE,
        `Your ad payment succeeded. You received ${Math.floor(userShare)} stars.`,
        io,
        connectedUsers
      ),
      ...adminUsers.map((admin) =>
        sendNotification(
          admin._id,
          ADMIN_ROLE,
          `You received ${Math.floor(adminShare)} stars from ${user.firstName} ${user.lastName}'s ad payment.`,
          io,
          connectedUsers
        )
      ),
      sendNotification(
        superAdminUser?._id,
        SUPER_ADMIN_ROLE,
        `You received ${Math.floor(superAdminShare)} stars from ${user.firstName} ${user.lastName}'s ad payment.`,
        io,
        connectedUsers
      )
    ];

    if (referredUserNotification) {
      notificationsToSend.push(referredUserNotification);
    }

    await Promise.all(notificationsToSend);

    // ✅ Mark payment as completed
    adRef.isPaymentCompleted = true;
    await adRef.save();

    return res.status(200).json({
      message: "Ad payment confirmed and shares distributed",
      adType: ad.imgAdRef ? "ImageAd" : ad.videoAdRef ? "VideoAd" : "SurveyAd",
      adId: adRef._id,
    });

  } catch (err) {
    console.error("Error in confirmAdPayment:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};





export {
  createImageAd,
  createVideoAd,
  createSurveyAd,
  submitSurveyResponse,
  getSurveyAdStats,
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
  editVideoAd,
  createImageAdDraft,
  createVideoAdDraft,
  createSurveyAdDraft,
  confirmAdPayment
};
