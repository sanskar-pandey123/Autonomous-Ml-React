const ContactMessage = require("../models/ContactMessage");

const sendMessage = async (req, res) => {
  console.log("CONTACT API HIT");

  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    // Save to MongoDB
    const newMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message
    });

    console.log("Contact message saved:", newMessage._id);

    // Professional response
    return res.status(201).json({
      success: true,
      message: "Message saved successfully",
      data: newMessage
    });

  } catch (error) {
    console.error("Contact Save Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = { sendMessage };