import { ImageAd } from "../models/ImageAd.js";
import { VideoAd } from "../models/VideoAd.js";
import { SurveyAd } from "../models/SurveyAd.js";

// ------------------- IMAGE AD -------------------

export const createImageAd = async (req, res) => {
  const { title, description, imageUrl } = req.body;

  if (!title || !description || !imageUrl) {
    return res.status(400).json({ message: "All fields are required for Image Ad" });
  }

  try {
    const ad = await ImageAd.create({
      title,
      description,
      imageUrl,
      createdBy: req.user.id,
    });
    res.status(201).json({ message: "Image Ad created successfully", ad });
  } catch (err) {
    res.status(500).json({ message: "Image Ad creation failed", error: err.message });
  }
};

// ------------------- VIDEO AD -------------------

export const createVideoAd = async (req, res) => {
  const { title, description, videoUrl } = req.body;

  if (!title || !description || !videoUrl) {
    return res.status(400).json({ message: "All fields are required for Video Ad" });
  }

  try {
    const ad = await VideoAd.create({
      title,
      description,
      videoUrl,
      createdBy: req.user.id,
    });
    res.status(201).json({ message: "Video Ad created successfully", ad });
  } catch (err) {
    res.status(500).json({ message: "Video Ad creation failed", error: err.message });
  }
};

// ------------------- SURVEY AD -------------------

export const createSurveyAd = async (req, res) => {
  const { title, questions } = req.body;

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "Survey Ad must have a title and at least one question" });
  }

  // Validate each question
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
      createdBy: req.user.id,
    });
    res.status(201).json({ message: "Survey Ad created successfully", ad });
  } catch (err) {
    res.status(500).json({ message: "Survey Ad creation failed", error: err.message });
  }
};
