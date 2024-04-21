const express = require('express')
const router = express.Router();
const { getSubscribedData, getRelatedVideos, videoFeed } = require("../controllers/Feed")
const { verifyToken } = require("../utils/AuthUtils")

router.get("/subscribedData", verifyToken, getSubscribedData);
router.get("/relatedvideo/:id", getRelatedVideos)
router.get("/feeddata", verifyToken, videoFeed)

module.exports = router;