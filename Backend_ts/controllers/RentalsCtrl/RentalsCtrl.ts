import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
// access to the database
import { ProductPreviewType } from '../../types/Product/ProductsTy';
import { BookItem, User, UserItem } from '../../models/DB_Functions/Set_Up/modelSetUp';
import { BookItemModel } from '../../models/typesOfModels/Items/BookModels/bookModel';
import { UserModel } from '../../models/typesOfModels/Users/userModels';

import { UserItemModel } from '../../models/typesOfModels/Items/UserItemModel';
import { EmptyResultError, where } from 'sequelize';
import { NotFoundError } from '../../utils/other/customError';
import { BookItemType } from '../../types/DBTypes/BookTypes/bookTypes';
import { RentalModel } from '../../models/typesOfModels/Rentals/RentalModel';
import { FullRentalPurchaseRequest } from '../../types/API_Types/Rental/RentalAPITypes';
import { UserItemType } from '../../types/DBTypes/RentalTypes/rentalType';


export class RentalsContorller {
    // Common Models for all functions
    private userItemModel = new UserItemModel();
    private bookItemModel = new BookItemModel();
    private rentalDetailsModel = new UserModel();
    private rentalModel = new RentalModel();

    public getAllCurrentlyListedItems = async (): Promise<ProductPreviewType[]> => {
        try {// from product/books get all books in location space x
            let userID = 15
            const { err, result: bookDetails } = await this.userItemModel.findAll({ where: { ownerID: userID }, rejectOnEmpty: false });
            const bookIDs = bookDetails.map((book) => {
                return book.dataValues.itemID!
            })
            const books = await this.bookItemModel.getObjsFromIDs(bookIDs)
            const bookPreview: ProductPreviewType[] = books.map((book) => {
                return {
                    itemID: book.id,
                    book: book.book,
                    ranking_of_book: book.rating
                }
            })
            return bookPreview;
        }
        catch (err: any) {
            console.error(err)
            throw new Error("Error in getting all items listed by user")
        }
    }

    public addNewItemListing = async (item: UserItemType): Promise<UserItem> => {
        try {
            const { err, result: userItem } = await this.userItemModel.addNew(item);
            return userItem;
        }
        catch (err: any) {
            console.error(err)
            throw new Error("Error in adding new item listing")
        }
    }

    public deleteItemListing = async (itemID: number): Promise<void> => {
        try {
            const userID = 10
            const { err, result: bookDetails } = await this.userItemModel.remove({ where: { itemID: itemID, ownerID: userID } });
        }
        catch (err: any) {
            console.error(err)
            throw new Error("Error in deleting item listing")
        }
    }

    public checkIfItemIsAvailable = async (options: { ownerID: number, itemID: number, quantity: number, startDate: Date, endDate: Date }
    ): Promise<boolean> => {
        try {
            const { ownerID, itemID, quantity, startDate, endDate } = options

            const clash = await this.rentalModel.checkIfUserItemDatesClash({ ownerID, itemID, startDate, endDate })
            if (clash) {
                console.log("Dates clash")
                throw new Error("Dates clash")
            }


            // check quantity
            const isEnoughQuant = await this.userItemModel.checkIfEnoughQuantity({ ownerID, itemID, quantity })
            if (!isEnoughQuant) {
                console.log("Not enough quantity")
                throw new Error("Not enough quantity")
            }

            // check if dates are available // more complicated/ have to search rentals and see if dates are available in each rental
            

            return true; // if all checks pass
        }
        catch (err: any) {
            console.error(err)
            throw new Error(`Error in checkIfItemIsAvailable:=> ${err.message}`)
        }
    }

    public createPurchaseRequest = async (purchaseReq: FullRentalPurchaseRequest): Promise<void> => {
        try {
            const { ownerID, renterID, startDate, endDate, rentalItems } = purchaseReq
            for (let rentalItem of rentalItems) {
                const params = { ownerID, itemID: rentalItem.itemID, quantity: rentalItem.quantity, startDate, endDate }
                const isAvailable = await this.checkIfItemIsAvailable(params)
                if (!isAvailable) {
                    throw new Error("Item is not available")
                }
            }

            const purchaseRequest = await this.rentalModel.addOrderWithItems(purchaseReq);
            // if item is available
            // create a purchase request

        }
        catch (err: any) {
            console.error(err)
            throw err
        }
    }

    public getPriceAndQuantity = async (options: { ownerID: number, itemID: number }): Promise<{ price: number, quantity: number }> => {
        try {
            const { ownerID, itemID } = options
            const { err, result: bookDetails } = await this.userItemModel.find({ where: { ownerID, itemID }, rejectOnEmpty: true });
            return { price: bookDetails.price, quantity: bookDetails.quantity }
        }
        catch (err: any) {
            if (err instanceof EmptyResultError) {
                throw new NotFoundError("Item not found")
            }
            console.error(err)
            throw new Error("Error in getting price and quantity")
        }
    }

}