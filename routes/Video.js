const express = require("express")
const router = express.Router();

const { addVideo, getVideos, getVideoById, deleteVideo, updateVideo } = require("../controllers/Video")
const { verifyToken } = require("../utils/AuthUtils")

router.post("/addVideo", verifyToken, addVideo)
router.delete("/deletevideo/:id", verifyToken, deleteVideo)
router.put("/updatevideo/:id", verifyToken, updateVideo)

router.get("/getvideos", getVideos)
router.get("/getvideo/:id", getVideoById)

module.exports = router