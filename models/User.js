const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    interested_area: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        default: null
    },
    subscribed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    }]
})

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;