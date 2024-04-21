const userModel = require("../models/User");
const videoModel = require("../models/Video");
const topicModel = require("../models/Category");
const applyPagination = require("../utils/DataUtils")

const getSubscribedData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const userId = req.user.id;
        const user = await userModel.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ status: false, msg: "User not found" });
        }

        const subscribedChannels = user.subscribed;
        const videos = await videoModel.find({ channel: { $in: subscribedChannels } }).populate('channel', 'name profile_image').sort({ time: -1 });

        const paginatedData = applyPagination(videos, page);

        return res.status(200).json({ status: true, response: paginatedData });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
}


const getRelatedVideos = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await videoModel.findById(id);
        if (!video) {
            return res.status(404).json({ status: false, msg: "Video not found" });
        }

        const topic = video.topic;
        const relatedVideos = await videoModel.find({ _id: { $ne: id }, topic: { $eq: topic } }).populate('channel').sort({ time: -1 }).limit(10);

        return res.status(200).json({ status: true, data: relatedVideos });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
}

const videoFeed = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;

        const userId = req.user.id;
        const user = await userModel.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ status: false, msg: "User not found" });
        }

        const interested = user.interested_area;
        const subscribedChannels = user.subscribed;

        const videosByInterest = await videoModel.find({ topic: { $in: interested } }).populate('channel', 'name profile_image');

        const videosBySubscription = await videoModel.find({ channel: { $in: subscribedChannels } }).populate('channel', 'name profile_image');

        const videoSet = new Set([...videosByInterest, ...videosBySubscription]);
        const uniqueVideos = Array.from(videoSet);

        uniqueVideos.sort((a, b) => b.time - a.time);

        const paginatedData = applyPagination(uniqueVideos, page)

        return res.status(200).json({ status: true, response: paginatedData });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
}

module.exports = { getSubscribedData, getRelatedVideos, videoFeed };
