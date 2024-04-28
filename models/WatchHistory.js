const mongoose = require('mongoose');

const watchHistorySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    watchedAt: {
        type: Date,
        default: Date.now
    }
});

const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);

module.exports = WatchHistory;
