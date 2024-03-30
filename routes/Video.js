const express = require("express")
const router = express.Router();

const { addVideo, getVideos, getVideoById } = require("../controllers/Video")
const { verifyToken } = require("../utils/AuthUtils")

router.post("/addVideo", verifyToken, addVideo)
router.get("/getvideos", getVideos)
router.get("/getvideo/:id", getVideoById)

module.exports = router