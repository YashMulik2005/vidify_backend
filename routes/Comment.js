const express = require("express");
const router = express.Router();

const { addComment, deleteComment, pinComment, unpinComment, getCommentById } = require("../controllers/Comment");
const { verifyToken } = require("../utils/AuthUtils");

router.post("/addComment", verifyToken, addComment);
router.delete("/deleteComment/:videoId/:commentId", verifyToken, deleteComment);
router.put("/pinComment/:commentId", verifyToken, pinComment);
router.put("/unpinComment/:commentId", verifyToken, unpinComment);
router.get("/:commentId", getCommentById);

module.exports = router;
