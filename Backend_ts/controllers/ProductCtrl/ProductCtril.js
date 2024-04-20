"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const bookModel_1 = require("../../models/typesOfModels/Items/BookModels/bookModel");
const userModels_1 = require("../../models/typesOfModels/Users/userModels");
const UserItemModel_1 = require("../../models/typesOfModels/Items/UserItemModel");
const customError_1 = require("../../utils/other/customError");
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
        this.getRankedBooks = async (options) => {
            // from product/books get all books in location space x
            const { lat, lng, searchQuery, maxDistance, minRating, maxPrice, userID } = options;
            const { err, result: user } = await this.userModel.findByPkey(userID);
            if (err)
                throw new customError_1.NotFoundError('User not found');
            const userSex = !user.sex ? 0 : 1;
            const rankedBookPrevs = await this.bookModel.getRankedBooksWithinRadiusAndSearchQuery({
                lat,
                lng,
                maxDistance,
                searchQuery,
                minRating,
                maxPrice,
                userID,
                userSex
            });
            return rankedBookPrevs;
        };
        this.getBookDetails = async (bookID) => {
            // get book details
            const bookDetails = await this.bookModel.getFullBookDetailsForBookID(bookID);
            return bookDetails;
        };
        this.getBookOwnedByUser = async (userID) => {
            // get book details
            const { err, result: bookDetails } = await this.userItemsModel.findAll({ where: { ownerID: userID }, rejectOnEmpty: true });
            const bookIDs = bookDetails.map((book) => book.itemID);
            const bookPreview = await this.bookModel.findAllBooksForIDs(bookIDs);
            console.log(bookPreview);
            return bookPreview;
        };
        this.getUserLocation = async (userID) => {
            // get user location
            const { err, result: user } = await this.userModel.findByPkey(userID);
            if (err)
                throw new customError_1.NotFoundError('User not found');
            return { lat: user.lat, lng: user.lng };
        };
    }
}
exports.ProductController = ProductController;
