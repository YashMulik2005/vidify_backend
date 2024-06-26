const UserModel = require("../models/User");
const WatchHistoryModel = require('../models/WatchHistory');
const applyPagination = require("../utils/DataUtils")

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv")

dotenv.config();
const jwt_key = process.env.jwt_key;

const login = async (req, res) => {
    try {
        console.log(jwt_key);
        const { username, password } = req.body;
        const userexist = await UserModel.findOne({ username: username })

        if (!userexist) {
            return res.status(200).json({
                data: { status: false, msg: "username or password is invalid." }
            })
        }
        const match = await bcrypt.compare(password, userexist.password);

        if (match) {
            const data = {
                id: userexist._id,
                username: userexist.username,
                email: userexist.email,
                category: userexist.interested_area,
                fname: userexist.fname,
                lname: userexist.lname,
                channel: userexist.channel,
                issuedAt: Date.now()
            };
            const token = jwt.sign(data, jwt_key, { expiresIn: '4d' })
            return res.status(200).json({
                data: { status: true, msg: "login sucessful", token: token }
            })
        }

        return res.status(200).json({
            data: { status: false, msg: "username or password is invalid." }
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            data: { status: false, error: err }
        })
    }
}

const signup = async (req, res) => {
    try {
        const { fname, lname, username, email, password, interested_area } = req.body;

        const existuser = await UserModel.findOne({ username: username });
        if (existuser) {
            return res.status(200).json({
                data: { status: false, msg: "username is already taken." }
            })
        }

        const hashpassword = await bcrypt.hash(password, 10);
        const user = new UserModel({
            fname: fname,
            lname: lname,
            username: username,
            email: email,
            password: hashpassword,
            interested_area: interested_area
        })

        await user.save();
        return res.status(200).json({
            data: { status: true, msg: "Account created sucessfully." }
        })
    } catch (err) {
        return res.status(400).json({
            data: { status: false, error: err }
        })
    }
}

const getuserDetails = async (req, res) => {
    try {
        const user = req.user;
        const data = await UserModel.findOne({ _id: user.id })
        //console.log(user);
        return res.status(200).json({
            data: { status: true, data: data }
        })
    } catch (err) {
        return res.status(200).json({
            data: { status: false, error: err }
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        const user = req.user;
        user.issuedAt = Date.now();
        const new_token = jwt.sign(user, jwt_key, { expiresIn: '4d' })
        return res.status(200).json({
            data: { token: new_token }
        })
    } catch (err) {

    }
}
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ status: false, msg: "User not found" });
        }

        return res.status(200).json({ status: true, data: user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
};

const getuser = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await UserModel.findOne({ _id: userId }).populate('channel', 'name profile_image subscribers').populate('interested_area');

        if (!data) {
            return res.status(404).json({ status: false, msg: "User not found" });
        }

        return res.status(200).json({ status: true, data: data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
}

const getWatchedVideosByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = req.query.page || 1;
        const limit = req.query.limit || 4;
        let watchHistory = await WatchHistoryModel.find({ user: userId })
            .populate({
                path: 'video',
                select: 'thumbnail time views title',
                populate: { path: 'channel', select: 'name profile_image' }
            })
            .sort({ watchedAt: -1 });

        watchHistory = watchHistory.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.video._id.toString() === item.video._id.toString()
            ))
        );

        const paginatedData = applyPagination(watchHistory, page, limit);

        return res.status(200).json({ status: true, response: paginatedData });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
}

const editUserCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { category } = req.body;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ status: false, msg: "User not found" });
        }
        user.interested_area = category;
        await user.save();

        return res.status(200).json({ status: true, msg: "User category updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
};

const editProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { profile } = req.body;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ status: false, msg: "User not found" });
        }
        user.profile_image = profile;
        await user.save();

        return res.status(200).json({ status: true, msg: "Profile Image updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
};



module.exports = { login, signup, getuserDetails, refreshToken, getUserById, getuser, getWatchedVideosByUser, editUserCategory, editProfileImage };

