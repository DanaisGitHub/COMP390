"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authUtils_1 = require("../utils/authUtils");
const foodController_1 = __importDefault(require("../controllers/food/foodController"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pathToKey = path_1.default.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs_1.default.readFileSync(pathToKey, 'utf8');
const router = (0, express_1.Router)();
const foodClass = new foodController_1.default(); // this is not a good solution as it won't work with multiple users
// we are running into some refresh token issues, so access Token is going to be 15 days and refresh token is going to be 30 days
// Then a force logout will happen 
const getUserIdFromHeader = (req, res) => {
    try {
        const bearerAccessToken = req.headers.authorization; // contains "bearer"
        if (bearerAccessToken === undefined || bearerAccessToken === null || bearerAccessToken === "") {
            console.log("No access token");
            throw new Error("No access token in cookies");
        }
        const accessToken = bearerAccessToken.split(" ")[1];
        console.log(accessToken);
        const decoded = jsonwebtoken_1.default.verify(accessToken, PUB_KEY); // should make not async// type error if not :any see what's going here
        return decoded.id;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: "There was an error trying to get the user id from cookies" });
        throw new Error("There was an error");
    }
};
const errorHandler = (err, req, res, next) => {
    console.log("There was an error", err);
    if (err) {
        res.json({ message: "There was a fatal an error", error: err });
    }
};
///////Some how the middlware need to know what user is logged in and then pass that user to the controller
//////////////////////////Read////////////////////////////
router.get('/getAllLogs', authUtils_1.authMiddleware, async (req, res, next) => {
    try {
        foodClass.getAllUserLogs(req, res, next);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
router.get('/getUserDetails', authUtils_1.authMiddleware, async (req, res, next) => {
    try {
        const user = getUserIdFromHeader(req, res);
        foodClass.getUserDetails(req, res, next);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
////////////////////////Update////////////////////////////
router.put('/changeUserDetails', authUtils_1.authMiddleware, async (req, res, next) => {
    try {
        const user = getUserIdFromHeader(req, res);
        foodClass.changeUserDetails(req, res, next);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
//////////////////////Create/////////////////////////////
router.post('/addExercise', authUtils_1.authMiddleware, async (req, res, next) => {
    try {
        foodClass.addExcerise(req, res, next);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
router.post('/addCustomFood', authUtils_1.authMiddleware, async (req, res, next) => {
    try {
        foodClass.addCustomFoodData(req, res, next);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
router.post('/addFood', authUtils_1.authMiddleware, async (req, res, next) => {
    try {
        foodClass.addFoodData(req, res, next);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
router.use(errorHandler);
exports.default = router;
