const moongose = require('mongoose');

const channelSchema = moongose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    categories: [{
        type: moongose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    banner_image: {
        type: String,
    },
    profile_image: {
        type: String
    },
    videos: [{
        type: moongose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    subscribers: [{
        type: moongose.Schema.Types.ObjectId,
        ref: 'User'
    }],
})

const ChannelModel = moongose.model("Channel", channelSchema);

module.exports = ChannelModel;