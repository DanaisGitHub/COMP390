"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalsContorller = void 0;
const bookModel_1 = require("../../models/typesOfModels/Items/BookModels/bookModel");
const UserItemModel_1 = require("../../models/typesOfModels/Items/UserItemModel");
class RentalsContorller {
    constructor() {
        // Common Models for all functions
        this.userItemModel = new UserItemModel_1.UserItemModel();
        this.bookItemModel = new bookModel_1.BookItemModel();
        this.getAllCurrentlyListedItems = async () => {
            try { // from product/books get all books in location space x
                let userID = 10;
                const { err, result: bookDetails } = await this.userItemModel.findAll({ where: { ownerID: userID }, rejectOnEmpty: false });
                const bookIDs = bookDetails.map((book) => {
                    return book.dataValues.itemID;
                });
                const books = await this.bookItemModel.getObjsFromIDs(bookIDs);
                return books;
            }
            catch (err) {
                console.error(err);
                throw new Error("Error in getting all items listed by user");
            }
        };
        this.addNewItemListing = async (item) => {
            try {
                const { err, result: bookDetails } = await this.bookItemModel.addNew(item);
                return bookDetails;
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
        this.checkIfItemIsAvailable = async (userItem, params) => {
            try {
                const { ownerID, itemID } = userItem;
                const { quantity, startDate, endDate } = params;
                // check quantity
                const isEnoughQuant = await this.userItemModel.checkIfEnoughQuantity({ ownerID, itemID, quantity });
                if (isEnoughQuant)
                    return false;
                // check if dates are available // more complicated/ have to search rentals and see if dates are available in each rental
                const { err: result } = await this.(ownerID, itemID, startDate, endDate);
                return true;
            }
            catch (err) {
                console.error(err);
                throw new Error(`Error in checkIfItemIsAvailable:=> ${err}`);
            }
        };
        this.createPurchaseRequest = async (userItem, params) => {
            try {
                // check if item meets requirements
                const isAvailable = await this.checkIfItemIsAvailable(userItem, params);
                if (!isAvailable) {
                    throw new Error("Item is not available");
                }
                // if item is available
                // create a purchase request
            }
            catch (err) {
                console.error(err);
                throw new Error("Error in creating purchase request");
            }
        };
    }
}
exports.RentalsContorller = RentalsContorller;
