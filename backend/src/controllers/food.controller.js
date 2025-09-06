const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');
const {v4:uuid} = require('uuid');

async function createFood(req, res) {
    console.log("REQ",req)
    // console.log("FILE",req.file)
    // console.log("FORM DATA",req.body.name)
    // console.log("FOOD PARTNER",req.foodPartner)
    // console.log("TOKEN",req.body.token)
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

    /* Dao file,validater layer missing !!! */

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    });

    res.status(201).json({ message: 'Food item created successfully', foodItem });

}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find();
    res.status(200).json({ message: 'Food items retrieved successfully', foodItems });
}

async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const likeExists = await likeModel.findOne({ user: user._id, food: foodId });
    if (likeExists) {
        await likeModel.deleteOne({ _id: likeExists._id });

        await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });

        return res.status(200).json({ message: 'Food item unliked successfully', like:false  });
    }
    await likeModel.create({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });
    res.status(200).json({ message: 'Food item liked successfully', like:true });
}

async function saveFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({ user: user._id, food: foodId });
    if (isAlreadySaved) {
        await saveModel.deleteOne({ user: user._id, food: foodId });
        await foodModel.findByIdAndUpdate(foodId, { $inc: { saves: -1 } });
        return res.status(200).json({ message: 'Food item unsaved successfully', save:false });
    }
    await saveModel.create({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { saves: 1 } });
    return res.status(200).json({ message: 'Food item saved successfully', save:true });

}

async function getSavedFood(req, res) {
    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if(!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: 'No saved food items found' });
    }

    res.status(200).json({ message: 'Saved food items retrieved successfully', savedFoods });

}


module.exports = { createFood, getFoodItems, likeFood, saveFood,getSavedFood };