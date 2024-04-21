const express = require('express')
const router = express.Router()

const { addCategory, getCategory, getCategoryById } = require("../controllers/Category")

router.post("/addCategory", addCategory);
router.get("/getCategory", getCategory);
router.get("/getCategory/:categoryId", getCategoryById)

module.exports = router;