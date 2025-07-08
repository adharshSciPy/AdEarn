// routes/geocodeRoute.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query" });

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;

  try {
    const response = await fetch(url, {
      headers: {
        // Required by OpenStreetMap Nominatim API
        "User-Agent": "YourAppName/1.0 (your@email.com)",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Geocoding error:", error);
    res.status(500).json({ error: "Failed to fetch geocode data" });
  }
});

export default router;
