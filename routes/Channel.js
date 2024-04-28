const express = require('express')
const router = express.Router();

const { createChannel, getAllChannels, getOneChannel, subscribe, unsubscribe, subscribedChannel, search, suggestSearch } = require('../controllers/Channel')

const { verifyToken } = require("../utils/AuthUtils")

router.post("/createChannel", verifyToken, createChannel);
router.post("/subscribe", verifyToken, subscribe);
router.post("/unsubscribe", verifyToken, unsubscribe);
router.get("/subscribed/:id", subscribedChannel)

router.get("/getChennls", getAllChannels);
router.get("/oneChannel/:id", getOneChannel);
router.post("/search", search);
router.post("/suggestSearch", suggestSearch);

module.exports = router;