"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pathToKey = path_1.default.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs_1.default.readFileSync(pathToKey, 'utf8');
const router = (0, express_1.Router)();
const ProductCtril_1 = require("../../controllers/ProductCtrl/ProductCtril");
const getRankedBooks = async (req, res, next) => {
    try {
        const productController = new ProductCtril_1.ProductController();
        const books = await productController.getBooksRankedAndQueriedFromUserLocation(req, res, next);
        res.status(200).json({ books: books });
    }
    catch (err) {
        res.status(500).json({ message: "There was an error", err: err });
    }
};
const getBookDetails = async (req, res, next) => {
    try {
        const productController = new ProductCtril_1.ProductController();
        const bookDetails = await productController.getBookDetails(req, res, next);
        res.status(200).json({ message: "This is the data from the python API" });
    }
    catch (err) {
        res.status(500).json({ message: "There was an error", err: err });
    }
};
