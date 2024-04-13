const express = require('express')
const router = express.Router();
const { getSubscribedData } = require("../controllers/Feed")
const { verifyToken } = require("../utils/AuthUtils")

router.get("/subscribedData", verifyToken, getSubscribedData);

module.exports = router;