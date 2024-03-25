import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
// access to the database
import { ProductPreview, ProductDetails } from '../../types/Product/ProductsTy';
import { User } from '../../models/DB_Functions/Set_Up/modelSetUp';
import { BookItemModel } from '../../models/typesOfModels/Items/BookModels/bookModel';
import { UserModel } from '../../models/typesOfModels/Users/userModels';

import { calculateDistance } from '../../utils/locationUtils';


export class ProductController {
    // Common Models for all functions
    private bookModel = new BookItemModel();
    private userModel = new UserModel();


    /**
     * Get all books in the location space of the user
     * 
     * @param req maxDistance
     * @param res 
     * @param next 
     * @returns 
     */
    public getBooksRankedAndQueriedFromUserLocation = async (req: Req, res: Res, next: Next): Promise<ProductPreview[]> => {
        // from product/books get all books in location space x
        let userID = 1 // AUTH will decide this
        const maxDistance = (req.query.max_distance ?? 10) as number; // assume km
        const searchQuery = (req.query.search_query ?? '') as string; // assume
        const user = await User.findByPk(userID);
        if (!user) {
            throw new Error('User not found')
        }
        const locationOfUser: { lat: number, lng: number } = { lat: user.lat, lng: user.lng }; // need to change def
        // func (user, userLocation, maxDistance, searchQuery): books that match criteria
        const rankedBooks = await this.bookModel.findAllBooksWithinRadiusAndSearchQuery(locationOfUser, maxDistance, searchQuery);
        return rankedBooks;
    }

    public getBookDetails = async (req: Req, res: Res, next: Next): Promise<ProductDetails> => {
        // from product/books get all books in location space x
        let userID = 1 // AUTH will decide this
        const bookID = (req.query.book_id ?? -1) as number; // assume
        const ranking = req.query.ranking ?? 0 as number; // assume
        const user = await User.findByPk(userID);
        if (!user) {
            throw new Error('User not found')
        }
        // func (user, userLocation, maxDistance, searchQuery): books that match criteria
        const {err,result:bookDetails} = await this.bookModel.findByPkey(bookID);
        const bookDetailsRanked = { ...bookDetails, ranking: ranking } as ProductDetails;
        if (!bookDetails) {
            throw new Error('Book not found')
        }
        return bookDetails;
    }

}