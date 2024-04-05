"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const bookModel_1 = require("../../models/typesOfModels/Items/BookModels/bookModel");
const userModels_1 = require("../../models/typesOfModels/Users/userModels");
const UserItemModel_1 = require("../../models/typesOfModels/Items/UserItemModel");
class ProductController {
    constructor() {
        // Common Models for all functions
        this.bookModel = new bookModel_1.BookItemModel();
        this.userModel = new userModels_1.UserModel();
        this.userItemsModel = new UserItemModel_1.UserItemModel();
        /**
         * Get all books in the location space of the user
         *
         * @param req maxDistance
         * @param res
         * @param next
         * @returns
         */
        this.getRankedBooks = async (options, req, res, next) => {
            // from product/books get all books in location space x
            let userID = 1;
            const { lat, lng, searchQuery: searchQuery, maxDistance, minRating, maxPrice } = options;
            const locationOfUser = { lat, lng };
            const rankedBooks = await this.bookModel.findAllBooksWithinRadiusAndSearchQuery({ locationOfUser, maxDistance, searchQuery, minRating, maxPrice });
            // SEND TO PYTHON FOR AI RANKING
            // return rankedBooks;
            return [];
        };
        this.getBookDetails = async (req, res, next) => {
            var _a;
            // get book details
            let userID = 1; // get from token
            const bookID = parseFloat((_a = req.query.id) !== null && _a !== void 0 ? _a : 1);
            const bookDetails = await this.bookModel.getFullBookDetailsForBookID(bookID);
            return bookDetails;
        };
        this.getBookOwnedByUser = async (req, res, next) => {
            // get book details
            let userID = 1;
            const { err, result: bookDetails } = await this.userItemsModel.findAll({ where: { ownerID: userID }, rejectOnEmpty: true });
            const bookIDs = bookDetails.map((book) => book.itemID);
            const bookPreview = await this.bookModel.findAllBooksForIDs(bookIDs);
            console.log(bookPreview);
            return bookPreview;
        };
    }
}
exports.ProductController = ProductController;