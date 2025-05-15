import { ImageAd } from "../model/imageadModel.js";
import { VideoAd } from "../model/videoadModel.js";
import { SurveyAd } from "../model/surveyadModel.js";

// ------------------- IMAGE AD -------------------

const createImageAd = async (req, res) => {
  const { title, description, imageUrl } = req.body;

  if (!title || !description || !imageUrl) {
    return res.status(400).json({ message: "All fields are required for Image Ad" });
  }

  try {
    const ad = await ImageAd.create({
      title,
      description,
      imageUrl,
    });
    res.status(201).json({ message: "Image Ad created successfully", ad });
  } catch (err) {
    res.status(500).json({ message: "Image Ad creation failed", error: err.message });
  }
};

// ------------------- VIDEO AD -------------------

const createVideoAd = async (req, res) => {
  const { title, description, videoUrl } = req.body;

  if (!title || !description || !videoUrl) {
    return res.status(400).json({ message: "All fields are required for Video Ad" });
  }

  try {
    const ad = await VideoAd.create({
      title,
      description,
      videoUrl,
    });
    res.status(201).json({ message: "Video Ad created successfully", ad });
  } catch (err) {
    res.status(500).json({ message: "Video Ad creation failed", error: err.message });
  }
};

// ------------------- SURVEY AD -------------------

const createSurveyAd = async (req, res) => {
  const { title, questions } = req.body;

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "Survey Ad must have a title and at least one question" });
  }


  for (const q of questions) {
    if (!q.questionText || !Array.isArray(q.options) || q.options.length < 2) {
      return res.status(400).json({
        message: "Each question must have questionText and at least 2 options",
      });
    }
  }

  try {
    const ad = await SurveyAd.create({
      title,
      questions,

    });
    res.status(200).json({ message: "Survey Ad created successfully", ad });
  } catch (err) {
    res.status(500).json({ message: "Survey Ad creation failed", error: err.message });
  }
};
export { createImageAd,createVideoAd,createSurveyAd};
