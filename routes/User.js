const express = require('express')
const router = express.Router()
const { login, signup, getuserDetails, refreshToken, getUserById, getuser, getWatchedVideosByUser } = require("../controllers/User")
const { verifyToken } = require("../utils/AuthUtils")

router.post("/login", login)
router.post("/signup", signup)

router.get("/userDetails", verifyToken, getuserDetails)
router.get("/refreshToken", verifyToken, refreshToken)
router.get("/profile", verifyToken, getuser)
router.get("/watchHistory", verifyToken, getWatchedVideosByUser)
router.get("/:userId", getUserById)

module.exports = router;
