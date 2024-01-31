"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
//import self-written files
const modelSetUp_1 = require("../../models/modelSetUp");
const itemsModel_1 = require("../../models/typesOfModels/itemsModel");
const baseController_1 = require("../../controllers/_baseController/baseController");
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
class ItemController extends baseController_1.BaseController {
    constructor() {
        super(new itemsModel_1.ItemModel(), modelSetUp_1.Item);
        //works
        this.createItem = async (req, res, next) => {
            try {
                //const userId = getUserIdFromHeader(req, res);
                const newCustomFoodData = {
                    itemName: req.body.itemName,
                    description: req.body.description,
                    thumbnail: req.body.thumbnail,
                    pricePerDay: req.body.pricePerDay,
                    itemLocation: req.body.itemLocation,
                    quantity: req.body.quantity,
                };
                await this.create(res, newCustomFoodData);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ err: err, result: "addCustomFoodData" });
            }
        };
        // input would not be from user
        this.getOneItem = async (req, res, next) => {
            try {
                await this.getOne(req, res, next);
            }
            catch (err) { // more errors than just server errors
                console.log(err);
                res.status(500).json({ err: err, result: "There was an error" });
            }
        };
        this.getManyItems = async (req, res, next) => {
            try {
                this.getMany(req, res, next);
            }
            catch (err) { // more errors than just server errors
                console.log(err);
                res.status(500).json({ err: err, result: "There was an error" });
            }
        };
        this.updateItem = async (req, res, next) => {
            try {
                await this.update(req, res, next, modelSetUp_1.Item);
            }
            catch (err) { // more errors than just server errors
                console.log(err);
                res.status(500).json({ err: err, result: "There was an error" });
            }
        };
        this.removeItem = async (req, res, next) => {
            try {
                await this.remove(req, res, next);
            }
            catch (err) { // more errors than just server errors
                console.log(err);
                res.status(500).json({ err: err, result: "There was an error" });
            }
        };
        this.addCSVItems = async (req, res, next) => {
            try {
                const { err, result } = await this.db.addManyNewBookItems();
                res.status(200).json({ err, result });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ err: err, result: "There was an error" });
            }
        };
    }
}
exports.default = ItemController;
