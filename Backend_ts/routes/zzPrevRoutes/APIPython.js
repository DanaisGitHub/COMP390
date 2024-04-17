"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PyAPIController_1 = __importDefault(require("../../controllers/Others/PyAPI/PyAPIController"));
const router = (0, express_1.Router)();
router.get('/all-users-data', async (req, res, next) => {
    try {
        const pyAPIController = new PyAPIController_1.default();
        const data = await pyAPIController.getAllUserData(req, res, next);
        res.status(200).json({ message: "This is the data from the python API", data: data });
    }
    catch (err) {
        res.status(500).json({ message: "There was an error", err: err });
    }
});
router.get('/all-book-data', (req, res, next) => {
    try {
        res.status(200).json({ message: "This is the data from the python API" });
    }
    catch (err) {
        res.status(500).json({ message: "There was an error", err: err });
    }
});
exports.default = router;
