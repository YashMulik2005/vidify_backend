const express = require("express")
const router = express.Router();

const { addVideo, getVideos, getVideoById, deleteVideo, updateVideo, like, unlike, getVideosByChannel, addviews } = require("../controllers/Video")
const { verifyToken } = require("../utils/AuthUtils")

router.post("/addVideo", verifyToken, addVideo)
router.delete("/deletevideo/:id", verifyToken, deleteVideo)
router.put("/updatevideo/:id", verifyToken, updateVideo)
router.post("/like", verifyToken, like)
router.post("/unlike", verifyToken, unlike)
router.get("/channel/:channelId", verifyToken, getVideosByChannel);

router.get("/getvideos", getVideos)
router.get("/getvideo/:id", getVideoById)
router.post("/views", addviews)

module.exports = router