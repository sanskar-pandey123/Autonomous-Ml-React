const express = require("express");
const router = express.Router();
const Scan = require("../models/Scan");
const authMiddleware = require("../middleware/authMiddleware");

// 🔥 Save Scan
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { scanType, inputValue, result } = req.body;

    const newScan = new Scan({
      userId: req.user.id,  // JWT se aa raha hai
      scanType,
      inputValue,
      result
    });

    await newScan.save();

    res.status(201).json({ message: "Scan saved successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Get User Scans
router.get("/", authMiddleware, async (req, res) => {
  try {
    const scans = await Scan.find({ userId: req.userId })
                            .sort({ createdAt: -1 });

    res.json(scans);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;