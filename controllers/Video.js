const videoModel = require("../models/Video")
const ChannelModel = require('../models/Channel');
const WatchHistoryModel = require('../models/WatchHistory');
const applyPagination = require("../utils/DataUtils")

const addVideo = async (req, res) => {
    try {
        const { title, description, thambnail, video, topic, channel, public_id } = req.body;
        console.log(thambnail);
        const existVideo = await videoModel.findOne({ title: title });
        if (existVideo) {
            return res.status(200).json({
                status: false,
                msg: "Video with same name exist"
            })
        }

        const newVideo = new videoModel({
            title,
            description,
            thumbnail: thambnail,
            video,
            topic,
            channel,
            public_id
        });
        const savedVideo = await newVideo.save();

        const updateChannel = await ChannelModel.findByIdAndUpdate(channel, { $addToSet: { videos: { $each: [savedVideo._id] } } });
        return res.status(201).json({ status: true, msg: "video added  sucessfully" });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: false,
            msg: err
        })
    }
}

const getVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const topic = req.query.topic;


        let query = {};

        if (topic && topic !== "all") {
            query.topic = topic;
        }

        const videos = await videoModel.find(query).populate('channel', 'name profile_image').sort({ time: -1 });
        const paginatedData = applyPagination(videos, page);

        return res.status(200).json({
            status: true,
            response: paginatedData
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
}



const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await videoModel.findById(id).populate('channel');
        if (!video) {
            return res.status(404).json({ status: false, msg: "Video not found" });
        }
        return res.status(200).json({ status: true, data: video });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
}

const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await videoModel.findById(id);
        if (!video) {
            return res.status(404).json({ status: false, msg: "Video not found" });
        }

        const channelId = video.channel;
        await ChannelModel.findByIdAndUpdate(channelId, { $pull: { videos: id } });

        await videoModel.findByIdAndDelete(id);

        return res.status(200).json({ status: true, msg: "Video deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
}


const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, topic } = req.body;

        let video = await videoModel.findById(id);
        if (!video) {
            return res.status(404).json({ status: false, msg: "Video not found" });
        }

        if (title) {
            video.title = title;
        }
        if (description) {
            video.description = description;
        }
        if (topic) {
            video.topic = topic;
        }

        video = await video.save();

        return res.status(200).json({ status: true, msg: "Video updated successfully", data: video });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
}

const like = async (req, res) => {
    try {
        const userId = req.user.id;
        const { videoId } = req.body;

        await videoModel.findByIdAndUpdate(videoId, { $push: { likes: userId } });

        return res.status(200).json({ status: true, msg: "Liked successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: false,
            msg: "Internal Server Error"
        });
    }
};

const unlike = async (req, res) => {
    try {
        const userId = req.user.id;
        const { videoId } = req.body;

        await videoModel.findByIdAndUpdate(videoId, { $pull: { likes: userId } });

        return res.status(200).json({ status: true, msg: "Unliked successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: false,
            msg: "Internal Server Error"
        });
    }
};

const getVideosByChannel = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const { channelId } = req.params;
        const channel = await ChannelModel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ status: false, msg: "Channel not found" });
        }

        const videos = await videoModel.find({ channel: channelId }).populate('channel', 'name profile_image').sort({ time: -1 });

        const paginatedData = applyPagination(videos, page)
        return res.status(200).json({ status: true, response: paginatedData });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
}

const addviews = async (req, res) => {
    try {
        const { videoId } = req.body;
        if (!videoId) {
            return res.status(400).json({ status: false, msg: "Video ID is required" });
        }

        const updatedVideo = await videoModel.findByIdAndUpdate(
            videoId,
            { $inc: { views: 1 } }
        );

        if (!updatedVideo) {
            return res.status(404).json({ status: false, msg: "Video not found" });
        }

        return res.status(200).json({ status: true, msg: "Views incremented successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
}

const addWatchHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { videoId } = req.body;

        const existingWatchHistory = await WatchHistoryModel.findOne({ user: userId, video: videoId });

        if (existingWatchHistory) {
            existingWatchHistory.watchedAt = Date.now();
            await existingWatchHistory.save();
            return res.status(200).json({ status: true, msg: "Watch history updated successfully" });
        } else {
            const newWatchHistory = new WatchHistoryModel({
                user: userId,
                video: videoId,
                watchedAt: Date.now()
            });
            await newWatchHistory.save();
            return res.status(201).json({ status: true, msg: "Watch history added successfully" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
}

const search = async (req, res) => {
    const { search } = req.body;
    const page = req.query.page || 1;
    try {
        const result = await videoModel.find({
            title: { $regex: ".*" + search + ".*", $options: "i" },
        }).populate('channel', 'name profile_image');

        const paginatedData = applyPagination(result, page);
        return res.status(200).json({ status: true, response: paginatedData });
    } catch (err) {
        res.status(400).json({
            data: { error: err },
        });
    }
}

const suggestSearch = async (req, res) => {
    const { search } = req.body;
    try {
        const result = await videoModel.find({
            title: { $regex: ".*" + search + ".*", $options: "i" },
        }, { title: 1 });

        return res.status(200).json({ status: true, response: result });
    } catch (err) {
        res.status(400).json({
            data: { error: err },
        });
    }
}

module.exports = { addVideo, getVideos, getVideoById, deleteVideo, updateVideo, like, unlike, getVideosByChannel, addviews, addWatchHistory, search, suggestSearch };

