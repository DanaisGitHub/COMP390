import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
// access to the database
import { ProductPreviewType, ProductDetailsType } from '../../types/Product/ProductsTy';
import { BookItem, User } from '../../models/DB_Functions/Set_Up/modelSetUp';
import { BookItemModel } from '../../models/typesOfModels/Items/BookModels/bookModel';
import { UserModel } from '../../models/typesOfModels/Users/userModels';

import { calculateDistance } from '../../utils/locationUtils';
import { UserItemModel } from '../../models/typesOfModels/Items/UserItemModel';
import { FullBook } from '../../types/API_Types/Book/BookApiTypes'
import { NotFoundError } from '../../utils/other/customError';


export class ProductController {
    // Common Models for all functions
    private bookModel = new BookItemModel();
    private userModel = new UserModel();
    private userItemsModel = new UserItemModel();
    /**
     * Get all books in the location space of the user
     * 
     * @param req maxDistance
     * @param res 
     * @param next 
     * @returns 
     */
    public getRankedBooks = async (options: {
        lat: number,
        lng: number,
        searchQuery?: string,
        maxDistance: number,
        minRating: number,
        maxPrice: number
    }): Promise<ProductPreviewType[]> => {
        // from product/books get all books in location space x
        let userID = 1
        const { err, result: user } = await this.userModel.findByPkey(userID);
        if (err) throw new NotFoundError('User not found');
        const userSex: number = !user.sex ? 0 : 1;
        const { lat, lng, searchQuery, maxDistance, minRating, maxPrice } = options;
        const rankedBookPrevs: ProductPreviewType[] = await this.bookModel.getRankedBooksWithinRadiusAndSearchQuery({
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
    }



    public getBookDetails = async (bookID: number): Promise<FullBook> => {
        // get book details
        let userID = 1// get from token
        const bookDetails = await this.bookModel.getFullBookDetailsForBookID(bookID);
        return bookDetails;
    }

    public getBookOwnedByUser = async (req: Req, res: Res, next: Next): Promise<any[]> => {
        // get book details
        let userID = 1
        const { err, result: bookDetails } = await this.userItemsModel.findAll({ where: { ownerID: userID }, rejectOnEmpty: true });
        const bookIDs = bookDetails.map((book: any) => book.itemID);

        const bookPreview = await this.bookModel.findAllBooksForIDs(bookIDs);
        console.log(bookPreview)
        return bookPreview;
    }

}