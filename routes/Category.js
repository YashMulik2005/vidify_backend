const express = require('express')
const router = express.Router()

const { addCategory, getCategory } = require("../controllers/Category")

router.post("/addCategory", addCategory);
router.get("/getCategory", getCategory);

module.exports = router;