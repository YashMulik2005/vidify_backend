const ChannelModel = require('../models/Channel');
const UserModel = require('../models/User');
const applyPagination = require("../utils/DataUtils")

const createChannel = async (req, res) => {
    try {
        const user = req.user;
        const { name, description, categories, banner_image, profile_image } = req.body;

        const existChannel = await ChannelModel.findOne({ name: name });
        if (existChannel) {
            return res.status(200).json({
                status: false,
                msg: "name arleady taken"
            })
        }

        const newChannel = new ChannelModel({
            name,
            description,
            categories,
            banner_image,
            profile_image
        });
        const savedChannel = await newChannel.save();

        const updateUser = await UserModel.findByIdAndUpdate(user.id, { channel: savedChannel._id });

        return res.status(201).json({ status: true, msg: "created sucessfully" });
    } catch (error) {
        console.error("Error creating channel:", error);
        return res.status(500).json({ status: false, error: "Failed to create channel" });
    }
}


const getAllChannels = async (req, res) => {
    try {
        const channels = await ChannelModel.find();
        return res.status(200).json({
            status: true,
            data: channels
        });
    } catch (error) {
        console.error("Error fetching channels:", error);
        return res.status(500).json({ status: false, error: "Failed to fetch channels" });
    }
}

const getOneChannel = async (req, res) => {
    try {
        const { id } = req.params;
        const channel = await ChannelModel.findById(id).populate('videos');

        if (!channel) {
            return res.status(404).json({ status: false, error: "Channel not found" });
        }
        return res.status(200).json({ status: true, data: channel });
    } catch (error) {
        console.error("Error fetching channel:", error);
        return res.status(500).json({ status: false, error: "Failed to fetch channel" });
    }
}

const subscribedChannel = async (req, res) => {
    try {
        const { id } = req.params;
        const channel = await ChannelModel.findById(id, 'name profile_image');

        if (!channel) {
            return res.status(404).json({ status: false, error: "Channel not found" });
        }
        return res.status(200).json({ status: true, data: channel });
    } catch (error) {
        console.error("Error fetching channel:", error);
        return res.status(500).json({ status: false, error: "Failed to fetch channel" });
    }
}

const subscribe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { channelId } = req.body;

        const c = await ChannelModel.findByIdAndUpdate(
            channelId,
            { $push: { subscribers: userId } }
        );

        const u = await UserModel.findByIdAndUpdate(
            userId,
            { $push: { subscribed: channelId } }
        );

        return res.status(200).json({ status: true, msg: "Subscribed successfully" });
    } catch (error) {
        console.error("Error subscribing:", error);
        return res.status(500).json({ status: false, error: "Failed to subscribe" });
    }
}

const unsubscribe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { channelId } = req.body;

        await ChannelModel.findByIdAndUpdate(
            channelId,
            { $pull: { subscribers: userId } }
        );

        await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { subscribed: channelId } }
        );

        return res.status(200).json({ status: true, msg: "Unsubscribed successfully" });
    } catch (error) {
        console.error("Error unsubscribing:", error);
        return res.status(500).json({ status: false, error: "Failed to unsubscribe" });
    }
}

const search = async (req, res) => {
    const { search } = req.body;
    const page = req.query.page || 1;
    try {
        const result = await ChannelModel.find({
            name: { $regex: ".*" + search + ".*", $options: "i" },
        })

        const paginatedData = applyPagination(result, page);
        return res.status(200).json({ status: true, response: paginatedData });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            data: { error: err },
        });
    }
}

const suggestSearch = async (req, res) => {
    const { search } = req.body;
    try {
        const result = await ChannelModel.find({
            name: { $regex: ".*" + search + ".*", $options: "i" },
        }, { name: 1 });

        return res.status(200).json({ status: true, response: result });
    } catch (err) {
        res.status(400).json({
            data: { error: err },
        });
    }
}

module.exports = { createChannel, getAllChannels, getOneChannel, subscribe, unsubscribe, subscribedChannel, search, suggestSearch };
