const express = require('express')
const router = express.Router()
const { login, signup, getuserDetails, refreshToken, getUserById, getuser, getWatchedVideosByUser, editUserCategory, editProfileImage } = require("../controllers/User")
const { verifyToken } = require("../utils/AuthUtils")

router.post("/login", login)
router.post("/signup", signup)

router.get("/userDetails", verifyToken, getuserDetails)
router.get("/refreshToken", verifyToken, refreshToken)
router.get("/profile", verifyToken, getuser)
router.get("/watchHistory", verifyToken, getWatchedVideosByUser)
router.get("/:userId", getUserById)
router.put("/updateInterstedArea", verifyToken, editUserCategory);
router.put("/updateProfile", verifyToken, editProfileImage);

module.exports = router;
