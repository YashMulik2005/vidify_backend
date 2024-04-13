const videoModel = require("../models/Video")
const ChannelModel = require('../models/Channel');

const addVideo = async (req, res) => {
    try {
        const { title, description, thambnail, video, topic, channel, public_id } = req.body;
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
            thambnail,
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
        const videos = await videoModel.find();
        return res.status(200).json({ status: true, data: videos });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ status: false, msg: err });
    }
}

const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await videoModel.findById(id);
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
        const { channelId } = req.params;
        const channel = await ChannelModel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ status: false, msg: "Channel not found" });
        }

        const videos = await videoModel.find({ channel: channelId });
        return res.status(200).json({ status: true, data: videos });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
}

module.exports = { addVideo, getVideos, getVideoById, deleteVideo, updateVideo, like, unlike, getVideosByChannel };

