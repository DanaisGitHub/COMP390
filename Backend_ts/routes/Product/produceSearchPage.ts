import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';

import jwt from 'jsonwebtoken';

import path from 'path';
import fs from 'fs';

import { ProductPreviewType, ProductDetailsType } from '../../types/Product/ProductsTy';
import { ProductController } from '../../controllers/ProductCtrl/ProductCtril';
import { FullBook } from '../../types/API_Types/Book/BookApiTypes';
import { authMiddleware, getPayloadFromAuthHeader } from '../../utils/auth/authUtils';
import { get } from 'http';
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const router = Router();

const productController = new ProductController();

// well let controller deal with auth

router.get('/get-full-book-details', authMiddleware, async (req: Req, res: Res, next: Next) => { // findAll db not working here
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

router.get('/get-items-user-list', authMiddleware, async (req: Req, res: Res, next: Next) => { //  findAll db not working here
    try {
        const productController = new ProductController();
        const { id: userID, userEmail } = getPayloadFromAuthHeader(req)
        const bookDetails = await productController.getBookOwnedByUser(userID);
        res.status(200).json({ message: bookDetails })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err, message: null })
    }
})

router.get('/get-ranked-books', authMiddleware, async (req: Req, res: Res, next: Next) => {
    try {
        const lat = parseFloat(req.query.lat as string);// should give an auto location eg center of the Mannyeh
        const lng = parseFloat(req.query.lng as string);// should give an auto location eg center of the Mannyeh
        const searchQuery = req.query.searchQuery ? req.query.searchQuery as string : undefined; // "" == string
        const maxDistance = !Number.isNaN(parseFloat(req.query.maxDistance as string)) ? parseFloat(req.query.maxDistance as string) : 10000
        const minRating = !Number.isNaN(parseFloat(req.query.minRating as string)) ? parseFloat(req.query.minRating as string) : 0
        const maxPrice = !Number.isNaN(parseFloat(req.query.maxPrice as string)) ? parseFloat(req.query.maxPrice as string) : 10000
        const { id: userID, userEmail } = getPayloadFromAuthHeader(req)


        // ... any other query params
        const books: ProductPreviewType[] = await productController.getRankedBooks({ lat, lng, searchQuery, maxDistance, minRating, maxPrice, userID }); // shuld be sending userID as well
        res.status(200).json({ message: books });
    } catch (err) {
        res.status(500).json({ message: "There was an error in get ranked books ROUTE", err: err })
    }
});

router.get('/get-user-location', authMiddleware, async (req: Req, res: Res, next: Next) => {
    try {
        const { id: userID, userEmail } = getPayloadFromAuthHeader(req)
        const userLocation = await productController.getUserLocation(userID);
        res.status(200).json({lng:userLocation.lng, lat:userLocation.lat})
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err, message: null })
    }
})



export default router;
