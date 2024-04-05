import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
// access to the database
import { ProductPreview, ProductDetails } from '../../types/Product/ProductsTy';
import { BookItem, User } from '../../models/DB_Functions/Set_Up/modelSetUp';
import { BookItemModel, FullBookDetail } from '../../models/typesOfModels/Items/BookModels/bookModel';
import { UserModel } from '../../models/typesOfModels/Users/userModels';

import { calculateDistance } from '../../utils/locationUtils';
import { UserItemModel } from '../../models/typesOfModels/Items/UserItemModel';
import {FullBook} from '../../types/API_Types/Book/BookApiTypes'


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
        searchQuery: string,
        maxDistance: number,
        minRating: number,
        maxPrice: number
    }, req: Req, res: Res, next: Next): Promise<ProductPreview[]> => {
        // from product/books get all books in location space x
        let userID = 1
        const { lat, lng, searchQuery: searchQuery, maxDistance, minRating, maxPrice } = options;
        const locationOfUser: { lat: number, lng: number } = { lat, lng };
        const rankedBooks = await this.bookModel.findAllBooksWithinRadiusAndSearchQuery({ locationOfUser, maxDistance, searchQuery, minRating, maxPrice });

        // SEND TO PYTHON FOR AI RANKING
        // return rankedBooks;
        return [];
    }



    public getBookDetails = async (req: Req, res: Res, next: Next): Promise<FullBook> => {
        // get book details
        let userID = 1// get from token
        const bookID = parseFloat(req.query.id as string ?? 1 as number);
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