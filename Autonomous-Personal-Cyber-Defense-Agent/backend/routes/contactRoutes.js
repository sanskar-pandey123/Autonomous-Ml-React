const express = require("express");
const router = express.Router();
const Contact = require("../models/ContactMessage");

// POST message
router.post("/send-message", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();

    res.status(200).json({ success: true, message: "Message saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
