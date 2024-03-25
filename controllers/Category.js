const CategoryModel = require("../models/Category")

const addCategory = async (req, res) => {
    try {
        const { category } = req.body;
        const data = new CategoryModel({
            name: category
        })

        await data.save()
        return res.status(200).json({
            data: {
                msg: "added"
            }
        })
    } catch (err) {
        return res.status(400).json({
            data: {
                msg: err
            }
        })
    }
}

const getCategory = async (req, res) => {
    try {
        const category = await CategoryModel.find({});
        return res.status(200).json({
            data: { category }
        })
    }
    catch (err) {
        return res.status(400).json({
            data: { msg: err }
        })
    }
}

module.exports = { addCategory, getCategory };