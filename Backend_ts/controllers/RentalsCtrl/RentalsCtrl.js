"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalsContorller = void 0;
const bookModel_1 = require("../../models/typesOfModels/Items/BookModels/bookModel");
const userModels_1 = require("../../models/typesOfModels/Users/userModels");
const UserItemModel_1 = require("../../models/typesOfModels/Items/UserItemModel");
const sequelize_1 = require("sequelize");
const customError_1 = require("../../utils/other/customError");
const RentalModel_1 = require("../../models/typesOfModels/Rentals/RentalModel");
class RentalsContorller {
    constructor() {
        // Common Models for all functions
        this.userItemModel = new UserItemModel_1.UserItemModel();
        this.bookItemModel = new bookModel_1.BookItemModel();
        this.rentalDetailsModel = new userModels_1.UserModel();
        this.rentalModel = new RentalModel_1.RentalModel();
        this.getAllCurrentlyListedItems = async () => {
            try { // from product/books get all books in location space x
                let userID = 15;
                const { err, result: bookDetails } = await this.userItemModel.findAll({ where: { ownerID: userID }, rejectOnEmpty: false });
                const bookIDs = bookDetails.map((book) => {
                    return book.dataValues.itemID;
                });
                const books = await this.bookItemModel.getObjsFromIDs(bookIDs);
                const bookPreview = books.map((book) => {
                    return {
                        itemID: book.id,
                        book: book.book,
                        ranking_of_book: book.rating
                    };
                });
                return bookPreview;
            }
            catch (err) {
                console.error(err);
                throw new Error("Error in getting all items listed by user");
            }
        };
        this.addNewItemListing = async (item) => {
            try {
                const { err, result: userItem } = await this.userItemModel.addNew(item);
                return userItem;
            }
            catch (err) {
                console.error(err);
                throw new Error("Error in adding new item listing");
            }
        };
        this.deleteItemListing = async (itemID) => {
            try {
                const userID = 10;
                const { err, result: bookDetails } = await this.userItemModel.remove({ where: { itemID: itemID, ownerID: userID } });
            }
            catch (err) {
                console.error(err);
                throw new Error("Error in deleting item listing");
            }
        };
        this.checkIfItemIsAvailable = async (options) => {
            try {
                const { ownerID, itemID, quantity, startDate, endDate } = options;
                // check quantity
                const isEnoughQuant = await this.userItemModel.checkIfEnoughQuantity({ ownerID, itemID, quantity });
                if (!isEnoughQuant) {
                    console.log("Not enough quantity");
                    return false;
                }
                // check if dates are available // more complicated/ have to search rentals and see if dates are available in each rental
                const clash = await this.rentalModel.checkIfUserItemDatesClash({ ownerID, itemID, startDate, endDate });
                if (clash) {
                    console.log("Dates clash");
                    return false;
                }
                return true; // if all checks pass
            }
            catch (err) {
                console.error(err);
                throw new Error(`Error in checkIfItemIsAvailable:=> ${err}`);
            }
        };
        this.createPurchaseRequest = async (purchaseReq) => {
            try {
                const { ownerID, renterID, startDate, endDate, rentalItems } = purchaseReq;
                for (let rentalItem of rentalItems) {
                    const params = { ownerID, itemID: rentalItem.itemID, quantity: rentalItem.quantity, startDate, endDate };
                    const isAvailable = await this.checkIfItemIsAvailable(params);
                    if (!isAvailable) {
                        throw new Error("Item is not available");
                    }
                }
                const purchaseRequest = await this.rentalModel.addOrderWithItems(purchaseReq);
                // if item is available
                // create a purchase request
            }
            catch (err) {
                console.error(err);
                throw new Error("Error createPurchaseRequest ---> " + err.message);
            }
        };
        this.getPriceAndQuantity = async (options) => {
            try {
                const { ownerID, itemID } = options;
                const { err, result: bookDetails } = await this.userItemModel.find({ where: { ownerID, itemID }, rejectOnEmpty: true });
                return { price: bookDetails.price, quantity: bookDetails.quantity };
            }
            catch (err) {
                if (err instanceof sequelize_1.EmptyResultError) {
                    throw new customError_1.NotFoundError("Item not found");
                }
                console.error(err);
                throw new Error("Error in getting price and quantity");
            }
        };
    }
}
exports.RentalsContorller = RentalsContorller;
