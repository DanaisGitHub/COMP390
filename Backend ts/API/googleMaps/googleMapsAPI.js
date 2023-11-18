"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usdaApi_1 = __importDefault(require("../../controllers/usdaApi/usdaApi"));
const router = (0, express_1.Router)();
const errorHandler = (err, req, res, next) => {
    console.log("There was an error", err);
    if (err) {
        res.json({ message: "There was a fatal an error", error: err });
    }
};
// should be using contoller alot better than this
router.post('/getFoodOptions', async (req, res, next) => {
    try {
        const food = req.body.food;
        console.log(food);
        const foodClass = new usdaApi_1.default();
        if (food === undefined) {
            res.status(400).json({ err: "food is undefined", result: null });
            return;
        }
        const theFoodChoices = await foodClass.getFoodChoices(food);
        res.status(200).json({ err: false, result: theFoodChoices });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, result: null });
    }
});
router.post('/foodData', async (req, res, next) => {
    try {
        const food = req.body.food;
        const quantity = req.body.quantity; // how many grams
        const foodChoice = req.body.foodChoice; // number between 1-5
        const foodClass = new usdaApi_1.default();
        const theFoodChoices = await foodClass.getFood(food, quantity, foodChoice);
        // now need to multiply the food choices by the quantity and then add into database
        const multiplier = quantity / 100;
        let foodData = {
            calories: theFoodChoices.calories * multiplier,
            sugar: theFoodChoices.sugar * multiplier,
            carbohydrates: theFoodChoices.carbs * multiplier,
            fat: theFoodChoices.fat * multiplier,
            protein: theFoodChoices.protein * multiplier,
            fiber: theFoodChoices.fiber * multiplier,
            quantity: quantity,
        };
        res.status(200).json({ err: false, result: foodData });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, result: null });
    }
});
router.use(errorHandler);
exports.default = router;
