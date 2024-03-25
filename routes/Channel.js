const express = require('express')
const router = express.Router();

const { createChannel, getAllChannels, getOneChannel } = require('../controllers/Channel')

const { verifyToken } = require("../utils/AuthUtils")

router.post("/createChannel", verifyToken, createChannel);

router.get("/getChennls", getAllChannels);
router.get("/oneChannel/:id", getOneChannel)

module.exports = router;