const express = require('express')
const router = express.Router();

const { createChannel, getAllChannels, getOneChannel, subscribe, unsubscribe } = require('../controllers/Channel')

const { verifyToken } = require("../utils/AuthUtils")

router.post("/createChannel", verifyToken, createChannel);
router.post("/subscribe", verifyToken, subscribe);
router.post("/unsubscribe", verifyToken, unsubscribe);

router.get("/getChennls", getAllChannels);
router.get("/oneChannel/:id", getOneChannel)

module.exports = router;