// routes/progressRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  saveProgress,
  getProgress,
} = require("../controllers/progressController");

router.post("/progress", authMiddleware, saveProgress);
router.get("/progress/:userId/:videoId", authMiddleware, getProgress);

module.exports = router;
