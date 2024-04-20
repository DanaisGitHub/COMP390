"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const authRoutes_1 = __importDefault(require("./Auth/authRoutes"));
//import { FoodModel } from '../models/typesOfModels/foodModel';
const produceSearchPage_1 = __importDefault(require("./Product/produceSearchPage"));
const UserProfilePage_1 = __importDefault(require("./UserDetails/UserProfilePage"));
const MyItemsPage_1 = __importDefault(require("./UserDetails/MyItemsPage"));
const PurchasePage_1 = __importDefault(require("./Rental/PurchasePage"));
const cors_1 = __importDefault(require("cors"));
const pathToKey = path_1.default.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs_1.default.readFileSync(pathToKey, 'utf8');
const router = (0, express_1.Router)();
router.use((0, cors_1.default)());
router.use('/auth', authRoutes_1.default);
router.use('/productSearchPage', produceSearchPage_1.default);
router.use('/userProfilePage', UserProfilePage_1.default);
router.use('/MyItemsPage', MyItemsPage_1.default);
router.use('/rental', PurchasePage_1.default);
const errorHandler = (err, req, res, next) => {
    console.log("There was an error", err);
    res.status(500).json({ err: "There was a fatal an error", result: err });
};
/**
 *
 * @returns the date of today
 */
const getTodaysDate = () => {
    const today = new Date();
    const dateAsString = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const todayDate = new Date(dateAsString);
    return todayDate;
};
/**
 * Calucates the date of the day that is x days ago
 * @param days number of days to go back
 * @returns
 */
const getDate = (days) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - days);
    yesterday.setHours(0, 0, 0, 0); // set time to midnight
    return yesterday;
};
exports.default = router;
