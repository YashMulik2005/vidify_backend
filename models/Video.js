const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    topic: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        text: {
            type: String,
            required: true
        },
        time: {
            type: Date,
            default: Date.now
        }
    }],
    thambnail: {
        type: String,
    },
    video: {
        type: String
    },
    public_id: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
