"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const usdaApi_1 = __importDefault(require("../../controllers/usdaApi/usdaApi"));
const foodModel_1 = require("../../models/typesOfModels/foodModel");
const pathToKey = path_1.default.join(__dirname, '..', '..', 'id_rsa_pub.pem');
const PUB_KEY = fs_1.default.readFileSync(pathToKey, 'utf8');
const getUserIdFromHeader = (req, res) => {
    try {
        const bearerAccessToken = req.headers.authorization; // contains "bearer"
        if (bearerAccessToken === undefined || bearerAccessToken === null || bearerAccessToken === "") {
            console.log("No access token");
            throw new Error("No access token in cookies");
        }
        const accessToken = bearerAccessToken.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(accessToken, PUB_KEY); // should make not async// type error if not :any see what's going here
        return decoded.id;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: "There was an error trying to get the user id from cookies" });
        throw new Error("There was an error");
    }
};
class FoodControllerClass {
    constructor() {
        this.db = new foodModel_1.FoodModel();
        this.getTodaysDate = () => {
            const today = new Date();
            const dateAsString = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);
            const todayDate = new Date(dateAsString);
            return todayDate;
        };
        // input would not be from user
        this.getAllUserLogs = async (req, res, next) => {
            try {
                const foodClass = new foodModel_1.FoodModel();
                const userId = getUserIdFromHeader(req, res);
                let { err, result } = await foodClass.getDailyMacrosList(userId);
                result = result.reverse();
                res.status(200).json({ err, result });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ err: err, result: "There was an error" });
            }
        };
        this.getUserDetails = async (req, res, next) => {
            try {
                const userId = getUserIdFromHeader(req, res);
                const userQuery = await this.db.getUser(userId);
                if (userQuery.err) {
                    throw new Error("Couldn't get user");
                }
                const user = userQuery.result;
                const theUser = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    weight: user.weight,
                    calorieGoal: user.calorieGoal,
                    birthDate: user.birthDate,
                    height: user.height,
                    gender: user.gender,
                    password: "" //Not sending password
                };
                res.status(200).json({ err: false, message: theUser });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ err: err, message: err });
            }
        };
        // Deprecated
        this.changeUserDetails = async (req, res, next) => {
            try {
                const userId = getUserIdFromHeader(req, res);
                const userQuery = await this.db.getUser(userId);
                if (userQuery.err) {
                    throw new Error("Couldn't get user");
                }
                const user = userQuery.result;
                const newUserDetails = {
                    id: user.id,
                    firstName: req.body.firstName || user.firstName,
                    lastName: req.body.lastName || user.lastName,
                    weight: req.body.weight || user.weight,
                    calorieGoal: req.body.calorieGoal || user.calorieGoal,
                    birthDate: req.body.birthDate || user.birthDate,
                    height: req.body.height || user.height,
                    gender: req.body.gender || user.gender,
                    password: user.password
                };
                const { err, result } = await this.db.changeUserDetails(userId, newUserDetails);
                // updating the user
                res.status(200).json({ err: err, message: result });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ err: err, message: null });
            }
        };
        //works
        this.addCustomFoodData = async (req, res, next) => {
            try {
                const userId = getUserIdFromHeader(req, res);
                const newCustomFoodData = {
                    foodName: req.body.foodName,
                    calories: req.body.calories,
                    sugar: req.body.sugar,
                    carbohydrates: req.body.carbohydrates,
                    fat: req.body.fat,
                    protein: req.body.protein,
                    fibre: req.body.fibre,
                };
                const { err, result } = await this.db.addCustomFood(userId, newCustomFoodData);
                const userLogResponse = await this.addUserLogs(userId, { customFoodId: [result.id] });
                res.status(200).json({ err, result: { customFood: result, userLog: userLogResponse.result } });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ err: err, result: "addCustomFoodData" });
            }
        };
        //works
        this.addExcerise = async (req, res, next) => {
            try {
                const userId = getUserIdFromHeader(req, res);
                const newExcersie = {
                    emailId: userId,
                    caloriesBurned: req.body.caloriesBurned,
                    exerciseName: req.body.exerciseName,
                    exerciseTime: req.body.exerciseTime,
                };
                const { err, result } = await this.db.addExcerise(newExcersie);
                const userLogResponse = await this.addUserLogs(userId, { exerciseId: [result.id] });
                res.status(200).json({ err, result: { excercise: result, userLog: userLogResponse.result } });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ err: err, message: null });
            }
        };
        this.addFoodData = async (req, res, next) => {
            try {
                const userId = getUserIdFromHeader(req, res);
                const food = req.body.food;
                const quantity = req.body.quantity; // how many grams
                const foodChoice = req.body.foodChoice; // number between 1-5
                const foodClass = new usdaApi_1.default();
                const theFoodChoices = await foodClass.getFood(food, quantity, foodChoice);
                // now need to multiply the food choices by the quantity and then add into database
                const multiplier = quantity / 100;
                let newFoodData = {
                    foodName: food,
                    calories: theFoodChoices.calories * multiplier,
                    sugar: theFoodChoices.sugar * multiplier,
                    carbohydrates: theFoodChoices.carbs * multiplier,
                    fat: theFoodChoices.fat * multiplier,
                    protein: theFoodChoices.protein * multiplier,
                    fibre: theFoodChoices.fiber * multiplier,
                    quantity: quantity,
                };
                const { err, result } = await this.db.addFood(newFoodData);
                const userLogResponse = await this.addUserLogs(userId, { foodId: [result.id] });
                res.status(200).json({ err, result: { foodData: result, userLog: userLogResponse.result } });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ err: true, message: err });
            }
        };
        this.addUserLogs = async (userId, obj) => {
            try {
                const foodClass = new foodModel_1.FoodModel();
                const newData = {
                    date: this.getTodaysDate(),
                    email: userId,
                    customFoodId: obj.customFoodId,
                    exerciseId: obj.exerciseId,
                    foodId: obj.foodId
                };
                const { err, result } = await foodClass.addUserLogs(newData);
                return { err, result };
            }
            catch (err) {
                console.log(err);
                throw new Error("There was an error");
            }
        };
    }
}
exports.default = FoodControllerClass;
