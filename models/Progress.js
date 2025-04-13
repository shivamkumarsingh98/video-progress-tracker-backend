const mongoose = require("mongoose");

const intervalSchema = new mongoose.Schema({
  start: Number,
  end: Number,
});

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  videoId: { type: String },
  videoDuration: { type: Number },
  watchedIntervals: [{ start: Number, end: Number }],
});

module.exports = mongoose.model("Progress", progressSchema);
