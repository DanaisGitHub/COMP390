"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const modelSetUp_1 = require("../../models/DB_Functions/Set_Up/modelSetUp");
const bookModel_1 = require("../../models/typesOfModels/Items/BookModels/bookModel");
const userModels_1 = require("../../models/typesOfModels/Users/userModels");
class ProductController {
    constructor() {
        // Common Models for all functions
        this.bookModel = new bookModel_1.BookItemModel();
        this.userModel = new userModels_1.UserModel();
        /**
         * Get all books in the location space of the user
         *
         * @param req maxDistance
         * @param res
         * @param next
         * @returns
         */
        this.getBooksRankedAndQueriedFromUserLocation = async (req, res, next) => {
            var _a, _b;
            // from product/books get all books in location space x
            let userID = 1; // AUTH will decide this
            const maxDistance = ((_a = req.query.max_distance) !== null && _a !== void 0 ? _a : 10); // assume km
            const searchQuery = ((_b = req.query.search_query) !== null && _b !== void 0 ? _b : ''); // assume
            const user = await modelSetUp_1.User.findByPk(userID);
            if (!user) {
                throw new Error('User not found');
            }
            const locationOfUser = { lat: user.lat, lng: user.lng }; // need to change def
            // func (user, userLocation, maxDistance, searchQuery): books that match criteria
            const rankedBooks = await this.bookModel.findAllBooksWithinRadiusAndSearchQuery(locationOfUser, maxDistance, searchQuery);
            return rankedBooks;
        };
        this.getBookDetails = async (req, res, next) => {
            var _a, _b;
            // from product/books get all books in location space x
            let userID = 1; // AUTH will decide this
            const bookID = ((_a = req.query.book_id) !== null && _a !== void 0 ? _a : -1); // assume
            const ranking = (_b = req.query.ranking) !== null && _b !== void 0 ? _b : 0; // assume
            const user = await modelSetUp_1.User.findByPk(userID);
            if (!user) {
                throw new Error('User not found');
            }
            // func (user, userLocation, maxDistance, searchQuery): books that match criteria
            const { err, result: bookDetails } = await this.bookModel.findByPkey(bookID);
            const bookDetailsRanked = Object.assign(Object.assign({}, bookDetails), { ranking: ranking });
            if (!bookDetails) {
                throw new Error('Book not found');
            }
            return bookDetails;
        };
    }
}
exports.ProductController = ProductController;
