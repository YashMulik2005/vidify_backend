const videoModel = require("../models/Video");
const Comment = require("../models/Comment");

const addComment = async (req, res) => {
    try {
        const user = req.user.id;
        const { videoId, text } = req.body;
        const video = await videoModel.findById(videoId);
        if (!video) {
            return res.status(404).json({ status: false, msg: "Video not found" });
        }

        const newComment = new Comment({
            user: user,
            text,
        });
        const savedComment = await newComment.save();
        video.comments.unshift(savedComment._id);
        await video.save();

        return res.status(201).json({ status: true, msg: "Comment added successfully", data: savedComment });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { videoId, commentId } = req.params;
        const video = await videoModel.findById(videoId);
        if (!video) {
            return res.status(404).json({ status: false, msg: "Video not found" });
        }

        const commentIndex = video.comments.indexOf(commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ status: false, msg: "Comment not found" });
        }

        video.comments.splice(commentIndex, 1);
        await video.save();

        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({ status: true, msg: "Comment deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
};

const pinComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ status: false, msg: "Comment not found" });
        }

        comment.pinned = true;
        await comment.save();

        return res.status(200).json({ status: true, msg: "Comment pinned successfully", data: comment });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
};

const unpinComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ status: false, msg: "Comment not found" });
        }

        comment.pinned = false;
        await comment.save();

        return res.status(200).json({ status: true, msg: "Comment unpinned successfully", data: comment });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
};

const getCommentById = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ status: false, msg: "Comment not found" });
        }

        return res.status(200).json({ status: true, data: comment });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
};

module.exports = { addComment, deleteComment, pinComment, unpinComment, getCommentById };
