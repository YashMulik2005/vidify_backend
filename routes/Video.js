const express = require("express")
const router = express.Router();

const { addVideo, getVideos, getVideoById, deleteVideo, updateVideo, like, unlike, getVideosByChannel, addviews, addWatchHistory, search, suggestSearch } = require("../controllers/Video")
const { verifyToken } = require("../utils/AuthUtils")

router.post("/addVideo", verifyToken, addVideo)
router.delete("/deletevideo/:id", verifyToken, deleteVideo)
router.put("/updatevideo/:id", verifyToken, updateVideo)
router.post("/like", verifyToken, like)
router.post("/unlike", verifyToken, unlike)
router.get("/channel/:channelId", getVideosByChannel);
router.post("/watchHistory", verifyToken, addWatchHistory)

router.get("/getvideos", getVideos)
router.get("/getvideo/:id", getVideoById)
router.post("/views", addviews)
router.post("/search", search);
router.post("/suggestSearch", suggestSearch);

module.exports = router