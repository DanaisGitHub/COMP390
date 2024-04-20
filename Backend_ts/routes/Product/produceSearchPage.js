"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductCtril_1 = require("../../controllers/ProductCtrl/ProductCtril");
const authUtils_1 = require("../../utils/auth/authUtils");
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
const router = (0, express_1.Router)();
const productController = new ProductCtril_1.ProductController();
// well let controller deal with auth
router.get('/get-full-book-details', authUtils_1.authMiddleware, async (req, res, next) => {
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
router.get('/get-items-user-list', authUtils_1.authMiddleware, async (req, res, next) => {
    try {
        const productController = new ProductCtril_1.ProductController();
        const { id: userID, userEmail } = (0, authUtils_1.getPayloadFromAuthHeader)(req);
        const bookDetails = await productController.getBookOwnedByUser(userID);
        res.status(200).json({ message: bookDetails });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
router.get('/get-ranked-books', authUtils_1.authMiddleware, async (req, res, next) => {
    try {
        const lat = parseFloat(req.query.lat); // should give an auto location eg center of the Mannyeh
        const lng = parseFloat(req.query.lng); // should give an auto location eg center of the Mannyeh
        const searchQuery = req.query.searchQuery ? req.query.searchQuery : undefined; // "" == string
        const maxDistance = !Number.isNaN(parseFloat(req.query.maxDistance)) ? parseFloat(req.query.maxDistance) : 10000;
        const minRating = !Number.isNaN(parseFloat(req.query.minRating)) ? parseFloat(req.query.minRating) : 0;
        const maxPrice = !Number.isNaN(parseFloat(req.query.maxPrice)) ? parseFloat(req.query.maxPrice) : 10000;
        const { id: userID, userEmail } = (0, authUtils_1.getPayloadFromAuthHeader)(req);
        // ... any other query params
        const books = await productController.getRankedBooks({ lat, lng, searchQuery, maxDistance, minRating, maxPrice, userID }); // shuld be sending userID as well
        res.status(200).json({ message: books });
    }
    catch (err) {
        res.status(500).json({ message: "There was an error in get ranked books ROUTE", err: err });
    }
});
router.get('/get-user-location', authUtils_1.authMiddleware, async (req, res, next) => {
    try {
        const { id: userID, userEmail } = (0, authUtils_1.getPayloadFromAuthHeader)(req);
        const userLocation = await productController.getUserLocation(userID);
        res.status(200).json({ lng: userLocation.lng, lat: userLocation.lat });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
exports.default = router;
