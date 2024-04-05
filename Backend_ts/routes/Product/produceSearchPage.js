"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
const router = (0, express_1.Router)();
const ProductCtril_1 = require("../../controllers/ProductCtrl/ProductCtril");
// well let controller deal with auth
const getRankedBooks = async (req, res, next) => {
    var _a, _b, _c;
    try {
        const productController = new ProductCtril_1.ProductController();
        const qlat = req.query.lat;
        const qlng = req.query.lng;
        const searchTerm = req.query.search;
        const maxDistance = (_a = req.query.maxDistance) !== null && _a !== void 0 ? _a : Infinity;
        const minRating = (_b = req.query.minRating) !== null && _b !== void 0 ? _b : 0;
        const maxPrice = (_c = req.query.maxPrice) !== null && _c !== void 0 ? _c : Infinity;
        const lat = parseFloat(qlat);
        const lng = parseFloat(qlng);
        // ... any other query params
        const books = {};
        // const books = await productController.getRankedBooks({ lat, lng, searchQuery: searchTerm, maxDistance, minRating, maxPrice });
        res.status(200).json({ books: books });
    }
    catch (err) {
        res.status(500).json({ message: "There was an error in get ranked books ROUTE", err: err });
    }
};
router.get('/get-full-book-details', async (req, res, next) => {
    try {
        const productController = new ProductCtril_1.ProductController();
        const bookDetails = await productController.getBookDetails(req, res, next);
        res.status(200).json({ message: bookDetails });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
router.get('/get-items-user-list', async (req, res, next) => {
    try {
        const productController = new ProductCtril_1.ProductController();
        const bookDetails = await productController.getBookOwnedByUser(req, res, next);
        res.status(200).json({ message: bookDetails });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
exports.default = router;
