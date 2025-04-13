// controllers/progressController.js

const Progress = require("../models/Progress");
const mergeIntervals = require("../utils/mergeIntervals");

// Utility to calculate total watched seconds
function getTotalWatchedSeconds(intervals) {
  return intervals.reduce((acc, curr) => acc + (curr.end - curr.start), 0);
}

exports.saveProgress = async (req, res) => {
  console.log("Received data:", req.body);
  const { videoId, newInterval: interval, videoDuration } = req.body;
  const userId = req.user._id;

  if (
    !interval ||
    typeof interval.start !== "number" ||
    typeof interval.end !== "number" ||
    interval.start >= interval.end
  ) {
    console.error("Invalid interval:", interval);
    return res.status(400).json({ message: "Invalid interval format" });
  }

  let progress = await Progress.findOne({ userId, videoId });
  if (!progress) {
    progress = new Progress({
      userId,
      videoId,
      watchedIntervals: [interval],
    });
  } else {
    progress.watchedIntervals.push(interval);
    progress.watchedIntervals = mergeIntervals(progress.watchedIntervals);
  }

  try {
    await progress.save();

    const totalWatched = getTotalWatchedSeconds(progress.watchedIntervals);
    const percentage = Math.min(
      Math.round((totalWatched / videoDuration) * 100),
      100
    );

    res.json({
      message: "Progress saved",
      percentage,
      watchedIntervals: progress.watchedIntervals,
    });
  } catch (error) {
    console.error("Error saving progress:", error.message);
    res.status(500).json({ message: "Error saving progress" });
  }
};

exports.getProgress = async (req, res) => {
  const { videoId, videoDuration } = req.query;
  const userId = req.user._id;

  const progress = await Progress.findOne({ userId, videoId });

  if (!progress) {
    return res.json({
      watchedIntervals: [],
      percentage: 0,
    });
  }

  const totalWatched = getTotalWatchedSeconds(progress.watchedIntervals);
  const percentage = Math.min(
    Math.round((totalWatched / videoDuration) * 100),
    100
  );

  res.json({
    intervals: progress.watchedIntervals,
    percentage,
  });
};
