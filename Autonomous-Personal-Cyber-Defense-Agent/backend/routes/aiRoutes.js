const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "Input required" });
    }

    const response = await axios.post(
      "http://127.0.0.1:8000/analyze",
      { input }
    );

    res.json(response.data);

  } catch (error) {
    console.error("AI Engine Error:", error.message);
    res.status(500).json({ error: "AI Engine Failed" });
  }
});

module.exports = router;