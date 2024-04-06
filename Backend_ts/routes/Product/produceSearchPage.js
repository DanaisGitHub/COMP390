"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductCtril_1 = require("../../controllers/ProductCtrl/ProductCtril");
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
const router = (0, express_1.Router)();
const productController = new ProductCtril_1.ProductController();
// well let controller deal with auth
const getRankedBooks = async (req, res, next) => {
    var _a, _b, _c, _d;
    try {
        const lat = parseFloat(req.query.lat); // should give an auto location eg center of the Mannyeh
        const lng = parseFloat(req.query.lng); // should give an auto location eg center of the Mannyeh
        const searchQuery = (_a = req.query.searchQuery) !== null && _a !== void 0 ? _a : ''; // "" == string
        const maxDistance = (_b = parseFloat(req.query.maxDistance)) !== null && _b !== void 0 ? _b : Infinity;
        const minRating = (_c = parseFloat(req.query.minRating)) !== null && _c !== void 0 ? _c : 0;
        const maxPrice = (_d = parseFloat(req.query.maxPrice)) !== null && _d !== void 0 ? _d : Infinity;
        // ... any other query params
        const books = await productController.getRankedBooks({ lat, lng, searchQuery, maxDistance, minRating, maxPrice }); // shuld be sending userID as well
        res.status(200).json({ message: books });
    }
    catch (err) {
        res.status(500).json({ message: "There was an error in get ranked books ROUTE", err: err });
    }
};
router.get('/get-full-book-details', async (req, res, next) => {
    try {
        const productController = new ProductCtril_1.ProductController();
        const bookID = parseInt(req.query.bookID);
        const bookDetails = await productController.getBookDetails(bookID);
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
router.get('/get-ranked-books', getRankedBooks);
exports.default = router;
