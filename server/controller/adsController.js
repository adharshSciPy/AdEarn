import { ImageAd } from "../model/imageadModel.js";
import { VideoAd } from "../model/videoadModel.js";
import { SurveyAd } from "../model/surveyadModel.js";
import User from "../model/userModel.js";
import { Ad } from "../model/AdsModel.js";
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
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ------------------- IMAGE AD -------------------
const createImageAd = async (req, res) => {
  const { title, description, userViewsNeeded, adPeriod, locations } = req.body;
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

  const parsedAdPeriod = parseFloat(adPeriod);
  const adRepetition = !isNaN(parsedAdPeriod) && parsedAdPeriod > 0;

  // Parse and validate multiple locations
  let targetRegions = [];
  try {
    const parsedLocations = typeof locations === "string" ? JSON.parse(locations) : locations;

    if (!Array.isArray(parsedLocations) || parsedLocations.length === 0) {
      return res.status(400).json({ message: "At least one location is required" });
    }

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
          coordinates: [longitude, latitude],
        },
        radius,
      });
    }
  } catch (err) {
    return res.status(400).json({ message: "Invalid location format", error: err.message });
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

    // Create star payout plan
    const highvalueArray = [5, 4, 3, 2];
    const highValueStarConversion = userViewsNeeded / 100;
    const highValueStars = highvalueArray.map((val) => val * highValueStarConversion);
    const highValueTotal = highValueStars.reduce((acc, val) => acc + val, 0);

    const singleStarsCount = Math.floor(starsToBeDeducted - highValueTotal);
    const singleStars = Array(singleStarsCount).fill(1);

    const nullStarsCount = userViewsNeeded - (highValueStars.length + singleStars.length);
    const nullStars = Array(nullStarsCount).fill(0);

    const starPayoutPlan = [...highValueStars, ...singleStars, ...nullStars];

    // Deduct stars from wallet
    userWallet.totalStars -= starsToBeDeducted;
    await userWallet.save();

    // Save image ad
    const imageUrl = `/imgAdUploads/${req.file.filename}`;
    const imageAd = await ImageAd.create({
      title,
      description,
      imageUrl,
      adPeriod: adRepetition ? parsedAdPeriod : 0,
      adRepetition,
      createdBy: user._id,
      userViewsNeeded,
      totalStarsAllocated: starsToBeDeducted,
      starPayoutPlan,
      targetRegions,
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
  const { title, description,  userViewsNeeded, adPeriod, locations } = req.body;
  const { id } = req.params;
  const videoUrl = req.file?.path;

  if (!id) return res.status(400).json({ message: "User ID is required" });
  if (!title || !description || !videoUrl || !userViewsNeeded)
    return res.status(400).json({ message: "Missing required fields" });

  const parsedAdPeriod = parseFloat(adPeriod);
  const adRepetition = !isNaN(parsedAdPeriod) && parsedAdPeriod > 0;

  // Parse and validate multiple locations
  let targetRegions = [];
  try {
    const parsedLocations = typeof locations === "string" ? JSON.parse(locations) : locations;
    if (!Array.isArray(parsedLocations) || parsedLocations.length === 0) {
      return res.status(400).json({ message: "At least one location is required" });
    }

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
          coordinates: [longitude, latitude],
        },
        radius,
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

    const starsDeductionRate = 0.6;
    const starsToBeDeducted = userViewsNeeded * starsDeductionRate;

    if (userWallet.totalStars < starsToBeDeducted) {
      const starsShort = starsToBeDeducted - userWallet.totalStars;
      return res.status(401).json({ message: `Insufficient stars. You need ${starsShort} more stars to post this ad.` });
    }

    // Create star payout plan
    const highvalueArray = [5, 4, 3, 2];
    const highValueStarConversion = userViewsNeeded / 100;
    const highValueStars = highvalueArray.map(val => val * highValueStarConversion);
    const highValueTotal = highValueStars.reduce((acc, val) => acc + val, 0);

    const singleStarsCount = Math.floor(starsToBeDeducted - highValueTotal);
    const singleStars = Array(singleStarsCount).fill(1);

    const nullStarsCount = userViewsNeeded - (highValueStars.length + singleStars.length);
    const nullStars = Array(nullStarsCount).fill(0);

    const starPayoutPlan = [...highValueStars, ...singleStars, ...nullStars];

    // Deduct stars from wallet
    userWallet.totalStars -= starsToBeDeducted;
    await userWallet.save();

    // Save video ad
    const videoUrl = `/videoAdUploads/${req.file.filename}`;
    const videoAd = await VideoAd.create({
      title,
      description,
      videoUrl,
      adPeriod: adRepetition ? parsedAdPeriod : 0,
      adRepetition,
      createdBy: user._id,
      userViewsNeeded,
      totalStarsAllocated: starsToBeDeducted,
      starPayoutPlan,
      targetRegions,
    });
    const ad = await Ad.create({ videoAdRef:videoAd._id });

    user.ads.push(videoAd._id);
    await user.save();

    return res.status(200).json({
      message: "Video Ad created successfully and stars deducted",
      videoAd,
      ad,
      remainingStars: userWallet.totalStars,
    });
  } catch (error) {
    console.error("Error creating video ad:", error);
    return res.status(500).json({ message: "Failed to create video ad", error: error.message });
  }
};

// ------------------- SURVEY AD -------------------

const createSurveyAd = async (req, res) => {
  const { title, questions, userViewsNeeded, adPeriod, locations } = req.body;
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "User ID is required" });
  if (!title || !questions || !userViewsNeeded)
    return res.status(400).json({ message: "Missing required fields" });

  const parsedAdPeriod = parseFloat(adPeriod);
  const adRepetition = !isNaN(parsedAdPeriod) && parsedAdPeriod > 0;

  // Parse and validate multiple locations
  let targetRegions = [];
  try {
    const parsedLocations = typeof locations === "string" ? JSON.parse(locations) : locations;
    if (!Array.isArray(parsedLocations) || parsedLocations.length === 0) {
      return res.status(400).json({ message: "At least one location is required" });
    }

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
          coordinates: [longitude, latitude],
        },
        radius,
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

    const starsDeductionRate = 0.6;
    const starsToBeDeducted = userViewsNeeded * starsDeductionRate;

    if (userWallet.totalStars < starsToBeDeducted) {
      const starsShort = starsToBeDeducted - userWallet.totalStars;
      return res.status(401).json({ message: `Insufficient stars. You need ${starsShort} more stars to post this ad.` });
    }

    // Create star payout plan
    const highvalueArray = [5, 4, 3, 2];
    const highValueStarConversion = userViewsNeeded / 100;
    const highValueStars = highvalueArray.map(val => val * highValueStarConversion);
    const highValueTotal = highValueStars.reduce((acc, val) => acc + val, 0);

    const singleStarsCount = Math.floor(starsToBeDeducted - highValueTotal);
    const singleStars = Array(singleStarsCount).fill(1);

    const nullStarsCount = userViewsNeeded - (highValueStars.length + singleStars.length);
    const nullStars = Array(nullStarsCount).fill(0);

    const starPayoutPlan = [...highValueStars, ...singleStars, ...nullStars];

    // Deduct stars from wallet
    userWallet.totalStars -= starsToBeDeducted;
    await userWallet.save();

    // Create survey ad
    const now = new Date();
    const surveyAd = await SurveyAd.create({
      title,
      questions,
      createdBy: user._id,
      userViewsNeeded,
      totalStarsAllocated: starsToBeDeducted,
      starPayoutPlan,
      adPeriod: adRepetition ? parsedAdPeriod : 0,
      adRepetition,
      isAdVisible: true,
      isViewsReached: false,
      targetRegions,
      adVerifiedTime: now,
      adExpirationTime: adRepetition && parsedAdPeriod > 0
        ? new Date(now.getTime() + parsedAdPeriod * 24 * 60 * 60 * 1000)
        : null,
    });

    // Create ad reference
    const ad = await Ad.create({ surveyAdRef: surveyAd._id });

    // Link to user
    user.ads.push(surveyAd._id);
    await user.save();

    return res.status(200).json({
      message: "Survey Ad created successfully and stars deducted",
      surveyAd,
      ad,
      remainingStars: userWallet.totalStars,
    });
  } catch (error) {
    console.error("Error creating survey ad:", error);
    return res.status(500).json({ message: "Failed to create survey ad", error: error.message });
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

    // ✅ Use stored coordinates from the profile
    const profileCoords = user.locationCoordinates
      ? { lat: user.locationCoordinates.lat, lng: user.locationCoordinates.lng }
      : null;

    // ✅ Validate that at least one location source exists
    if ((!userLat || !userLng) && !profileCoords) {
      return res.status(400).json({
        message: "No valid user geolocation available for location-based ad matching",
      });
    }

    const allAds = await Ad.find().populate("imgAdRef");
    const currentDate = new Date();
    const verifiedImgAds = [];

    for (const ad of allAds) {
      const imgAd = ad.imgAdRef;
      if (!imgAd || imgAd.createdBy?.toString() === userId) continue;

      const isUserInTargetRegion = imgAd.targetRegions?.some(region => {
        if (!region?.location?.coordinates) return false;

        const [targetLng, targetLat] = region.location.coordinates;
        const radiusMeters = region.radius * 1000;

        const withinLiveLocation =
          userLat && userLng &&
          calculateDistance(userLat, userLng, targetLat, targetLng) <= radiusMeters;

        const withinProfileLocation =
          profileCoords &&
          calculateDistance(profileCoords.lat, profileCoords.lng, targetLat, targetLng) <=
            radiusMeters;

        return withinLiveLocation || withinProfileLocation;
      });

      if (!isUserInTargetRegion) continue;

      const hasUserViewed = imgAd.viewersRewarded.some(
        entry => entry.userId.toString() === userId
      );

      const adIsActive =
        imgAd.isAdVerified &&
        imgAd.isAdVisible &&
        imgAd.totalViewCount < imgAd.userViewsNeeded &&
        (!imgAd.adExpirationTime || imgAd.adExpirationTime > currentDate);

      if (adIsActive) {
        if (!imgAd.adRepetition && hasUserViewed) continue;

        if (imgAd.adRepetition) {
          const userSchedule = imgAd.adRepeatSchedule.find(
            entry => entry.userId.toString() === userId
          );
          if (userSchedule && userSchedule.nextScheduledAt > currentDate) continue;
        }

        verifiedImgAds.push({
          _id: ad._id,
          imageAd: {
            ...imgAd.toObject(),
            isVerified: imgAd.isAdVerified,
          },
        });
      } else {
        const updateFields = {};
        let shouldUpdate = false;

        if (imgAd.totalViewCount >= imgAd.userViewsNeeded && !imgAd.isViewsReached) {
          updateFields.isViewsReached = true;
          shouldUpdate = true;
        }

        if (imgAd.adExpirationTime && imgAd.adExpirationTime <= currentDate && imgAd.isAdVisible) {
          updateFields.isAdVisible = false;
          shouldUpdate = true;
        }

        if (shouldUpdate) {
          await ImageAd.findByIdAndUpdate(imgAd._id, updateFields);
        }
      }
    }

    if (verifiedImgAds.length === 0) {
      return res.status(404).json({ message: "No verified and eligible image ads found for your location" });
    }

    return res.status(200).json({
      message: "Verified image ads fetched successfully",
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

    // ✅ Use stored coordinates from the profile
    const profileCoords = user.locationCoordinates
      ? { lat: user.locationCoordinates.lat, lng: user.locationCoordinates.lng }
      : null;

    // ✅ Validate that at least one location source exists
    if ((!userLat || !userLng) && !profileCoords) {
      return res.status(400).json({
        message: "No valid user geolocation available for location-based ad matching",
      });
    }

    const allAds = await Ad.find().populate("videoAdRef");
    const currentDate = new Date();
    const verifiedVideoAds = [];

    for (const ad of allAds) {
      const videoAd = ad.videoAdRef;
      if (!videoAd || videoAd.createdBy?.toString() === userId) continue;

      const isUserInTargetRegion = videoAd.targetRegions?.some(region => {
        if (!region?.location?.coordinates) return false;

        const [targetLng, targetLat] = region.location.coordinates;
        const radiusMeters = region.radius * 1000;

        const withinLiveLocation =
          userLat && userLng &&
          calculateDistance(userLat, userLng, targetLat, targetLng) <= radiusMeters;

        const withinProfileLocation =
          profileCoords &&
          calculateDistance(profileCoords.lat, profileCoords.lng, targetLat, targetLng) <=
            radiusMeters;

        return withinLiveLocation || withinProfileLocation;
      });

      if (!isUserInTargetRegion) continue;

      const hasUserViewed = videoAd.viewersRewarded.some(
        entry => entry.userId.toString() === userId
      );

      const adIsActive =
        videoAd.isAdVerified &&
        videoAd.isAdVisible &&
        videoAd.totalViewCount < videoAd.userViewsNeeded &&
        (!videoAd.adExpirationTime || videoAd.adExpirationTime > currentDate);

      if (adIsActive) {
        if (!videoAd.adRepetition && hasUserViewed) continue;

        if (videoAd.adRepetition) {
          const userSchedule = videoAd.adRepeatSchedule.find(
            entry => entry.userId.toString() === userId
          );
          if (userSchedule && userSchedule.nextScheduledAt > currentDate) continue;
        }

        verifiedVideoAds.push({
          _id: ad._id,
          videoAd: {
            ...videoAd.toObject(),
            isVerified: videoAd.isAdVerified,
          },
        });
      } else {
        const updateFields = {};
        let shouldUpdate = false;

        if (videoAd.totalViewCount >= videoAd.userViewsNeeded && !videoAd.isViewsReached) {
          updateFields.isViewsReached = true;
          shouldUpdate = true;
        }

        if (videoAd.adExpirationTime && videoAd.adExpirationTime <= currentDate && videoAd.isAdVisible) {
          updateFields.isAdVisible = false;
          shouldUpdate = true;
        }

        if (shouldUpdate) {
          await VideoAd.findByIdAndUpdate(videoAd._id, updateFields);
        }
      }
    }

    if (verifiedVideoAds.length === 0) {
      return res.status(404).json({ message: "No verified and eligible video ads found for your location" });
    }

    return res.status(200).json({
      message: "Verified video ads fetched successfully",
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

    if ((!userLat || !userLng) && !profileCoords) {
      return res.status(400).json({
        message: "No valid user geolocation available for location-based ad matching",
      });
    }

    const allAds = await Ad.find().populate("surveyAdRef");
    const currentDate = new Date();
    const verifiedSurveyAds = [];

    for (const ad of allAds) {
      const surveyAd = ad.surveyAdRef;
      if (!surveyAd || surveyAd.createdBy?.toString() === userId) continue;

      // Check if user is within target region
      const isUserInTargetRegion = surveyAd.targetRegions?.some(region => {
        if (!region?.location?.coordinates) return false;

        const [targetLng, targetLat] = region.location.coordinates;
        const radiusMeters = region.radius * 1000;

        const withinLiveLocation =
          userLat && userLng &&
          calculateDistance(userLat, userLng, targetLat, targetLng) <= radiusMeters;

        const withinProfileLocation =
          profileCoords &&
          calculateDistance(profileCoords.lat, profileCoords.lng, targetLat, targetLng) <=
            radiusMeters;

        return withinLiveLocation || withinProfileLocation;
      });

      if (!isUserInTargetRegion) continue;

      const hasUserCompleted = surveyAd.usersCompleted?.some(
        entry => entry.userId.toString() === userId
      );

      const adIsActive =
        surveyAd.isAdVerified &&
        surveyAd.isAdVisible &&
        surveyAd.totalResponses < surveyAd.responseLimit &&
        (!surveyAd.adExpirationTime || surveyAd.adExpirationTime > currentDate);

      if (adIsActive) {
        if (!surveyAd.allowRepeat && hasUserCompleted) continue;

        if (surveyAd.allowRepeat) {
          const userSchedule = surveyAd.repeatSchedule?.find(
            entry => entry.userId.toString() === userId
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
        const updateFields = {};
        let shouldUpdate = false;

        if (surveyAd.totalResponses >= surveyAd.responseLimit && !surveyAd.isResponsesReached) {
          updateFields.isResponsesReached = true;
          shouldUpdate = true;
        }

        if (surveyAd.adExpirationTime && surveyAd.adExpirationTime <= currentDate && surveyAd.isAdVisible) {
          updateFields.isAdVisible = false;
          shouldUpdate = true;
        }

        if (shouldUpdate) {
          await SurveyAd.findByIdAndUpdate(surveyAd._id, updateFields);
        }
      }
    }

    if (verifiedSurveyAds.length === 0) {
      return res.status(404).json({ message: "No verified and eligible survey ads found for your location" });
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
  const { adId } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("userWalletDetails");
    if (!user) return res.status(400).json({ message: "User not found" });

    const ad = await Ad.findById(adId)
      .populate("imgAdRef")
      .populate("videoAdRef")
      .populate("surveyAdRef");

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    // Identify which ad type it is
    const adTypes = [
      { ref: ad.imgAdRef, type: "Image" },
      { ref: ad.videoAdRef, type: "Video" },
      { ref: ad.surveyAdRef, type: "Survey" },
    ];

    const adObj = adTypes.find(({ ref }) => ref && ref.isAdVerified)?.ref;
    const adType = adTypes.find(({ ref }) => ref && ref.isAdVerified)?.type;

    if (!adObj) {
      return res.status(403).json({ message: "Ad is not verified or not found in any category" });
    }

    const now = new Date();

    // Check if user already rewarded
    const previouslyRewarded = adObj.viewersRewarded.find(
      (entry) => entry.userId.toString() === userId
    );

    const userRepeat = adObj.adRepeatSchedule.find(
      (entry) => entry.userId.toString() === userId
    );

    // If repetition is off and user already viewed
    if (!adObj.adRepetition && previouslyRewarded) {
      return res.status(409).json({ message: "User has already viewed this ad" });
    }

    // If repetition is on but time not reached
    if (adObj.adRepetition) {
      if (userRepeat && userRepeat.nextScheduledAt > now) {
        const waitTime = (userRepeat.nextScheduledAt - now) / 1000 / 60;
        return res.status(429).json({
          message: `Ad will be available again in ${Math.ceil(waitTime)} minute(s)`,
        });
      }
    }

    // If no rewards left
    if (adObj.starPayoutPlan.length === 0) {
      return res.status(410).json({ message: "All rewards have been claimed" });
    }

    // Reward the user
    const starsToGive = adObj.starPayoutPlan.shift();
    adObj.totalViewCount += 1;

    if (adObj.totalViewCount >= adObj.userViewsNeeded) {
      adObj.isViewsReached = true;
    }

    adObj.viewersRewarded.push({
      userId: user._id,
      starsGiven: starsToGive,
    });

    if (adObj.adRepetition) {
      const nextScheduledAt = new Date(now.getTime() + adObj.adPeriod * 60 * 60 * 1000);
      if (userRepeat) {
        userRepeat.viewsRepatitionCount += 1;
        userRepeat.nextScheduledAt = nextScheduledAt;
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
      return res.status(500).json({ message: "User wallet not found" });
    }

    wallet.totalStars += starsToGive;

   const alreadyViewed = user.viewedAds.some(
      (entry) => entry.adId.toString() === ad._id.toString()
    );

    if (!alreadyViewed) {
      user.viewedAds.push({
        adId: ad._id,
        viewedAt: new Date(),
      });
    }

    await Promise.all([adObj.save(), wallet.save(), user.save()]);

    return res.status(200).json({
      message: `${adType} Ad viewed successfully and stars rewarded`,
      starsRewarded: starsToGive,
      currentViewCount: adObj.totalViewCount,
      remainingPayouts: adObj.starPayoutPlan.length,
      isViewsReached: adObj.isViewsReached,
    });

  } catch (error) {
    console.error("Error viewing ad:", error);
    return res.status(500).json({
      message: "Error viewing ad",
      error: error.message,
    });
  }
};

// 

export {
  createImageAd,
  createVideoAd,
  createSurveyAd,
  fetchAdsForVerification,
  fetchVerifiedAds,
  fetchSingleVerifiedAd,
  fetchVerifiedImgAd,
  fetchVerifiedVideoAd,
  fetchVerifiedSurveyAd,
  viewAd
};
