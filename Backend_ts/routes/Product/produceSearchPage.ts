import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';

import jwt from 'jsonwebtoken';

import path from 'path';
import fs from 'fs';

import { ProductPreviewType, ProductDetailsType } from '../../types/Product/ProductsTy';
import { ProductController } from '../../controllers/ProductCtrl/ProductCtril';
import { FullBook } from '../../types/API_Types/Book/BookApiTypes';
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const router = Router();

const productController = new ProductController();

// well let controller deal with auth

const getRankedBooks = async (req: Req, res: Res, next: Next) => {
    try {
        const lat = parseFloat(req.query.lat as string);// should give an auto location eg center of the Mannyeh
        const lng = parseFloat(req.query.lng as string);// should give an auto location eg center of the Mannyeh
        const searchQuery = req.query.searchQuery ? req.query.searchQuery as string : undefined ; // "" == string
        const maxDistance = !Number.isNaN(parseFloat(req.query.maxDistance as string)) ? parseFloat(req.query.maxDistance as string) : 10000
        const minRating = !Number.isNaN(parseFloat(req.query.minRating as string)) ? parseFloat(req.query.minRating as string) : 0
        const maxPrice = !Number.isNaN(parseFloat(req.query.maxPrice as string)) ? parseFloat(req.query.maxPrice as string) : 10000

        console.log(lat, lng, searchQuery, maxDistance, minRating, maxPrice)


        // ... any other query params
        const books: ProductPreviewType[] = await productController.getRankedBooks({ lat, lng, searchQuery, maxDistance, minRating, maxPrice }); // shuld be sending userID as well
        res.status(200).json({ message: books });
    } catch (err) {
        res.status(500).json({ message: "There was an error in get ranked books ROUTE", err: err })
    }
}

router.get('/get-full-book-details', async (req: Req, res: Res, next: Next) => { // findAll db not working here
    try {
        const productController = new ProductController();
        const bookID = parseInt(req.query.bookID as string);
        const bookDetails: FullBook = await productController.getBookDetails(bookID);
        res.status(200).json({ message: bookDetails })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err, message: null })
    }
})

router.get('/get-items-user-list', async (req: Req, res: Res, next: Next) => { //  findAll db not working here
    try {
        const productController = new ProductController();
        const bookDetails = await productController.getBookOwnedByUser(req, res, next);
        res.status(200).json({ message: bookDetails })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err, message: null })
    }
})

router.get('/get-ranked-books', getRankedBooks);

router.get('/hello', (req: Req, res: Res, next: Next) => {
    console.log("Hello World")
    res.status(200).json({ message: "Hello World" })
})


export default router;
