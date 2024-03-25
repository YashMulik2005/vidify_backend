const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cloudinary = require('./utils/MediaUtils');

const categoryRoute = require("./routes/Category")
const userRoute = require("./routes/User")
const channelRoute = require("./routes/Channel");

const app = express()

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cors({
    origin: "*"
}))
//P9VUkCb4OBxGlc3r
mongoose.set("strictQuery", false);
var db = "mongodb+srv://yashmulik95:P9VUkCb4OBxGlc3r@cluster0.grtirmv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("connect");
    })
    .catch((err) => {
        console.log(err);
    });


app.use("/api/category", categoryRoute)
app.use("/api/auth", userRoute)
app.use("/api/channel", channelRoute)

app.post("/Image", async (req, res) => {
    const { public_id } = req.body;
    try {
        const hls_url = cloudinary.url(public_id, {
            resource_type: 'video',
            secure: true,
        });
        res.status(200).json({ hls_url: hls_url });
    } catch (err) {
        console.log(err);
        res.status(400).json({ err: err })
    }
});


app.listen(3000, () => {
    console.log("server started");
})
