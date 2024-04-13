const userModel = require("../models/User");
const videoModel = require("../models/Video");

const getSubscribedData = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ status: false, msg: "User not found" });
        }

        const subscribedChannels = user.subscribed;
        const videos = await videoModel.find({ channel: { $in: subscribedChannels } });

        return res.status(200).json({ status: true, data: videos });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
}

module.exports = { getSubscribedData };
