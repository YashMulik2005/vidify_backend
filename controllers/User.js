const UserModel = require("../models/User");
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
module.exports = { login, signup, getuserDetails, refreshToken }
