const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  scanType: {
    type: String,
    required: true
  },
  inputValue: {
    type: String,
    required: true
  },
  result: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Scan", scanSchema);