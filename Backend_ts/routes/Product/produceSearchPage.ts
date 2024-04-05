import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';

import jwt from 'jsonwebtoken';

import path from 'path';
import fs from 'fs';
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const router = Router();

import { ProductPreview, ProductDetails } from '../../types/Product/ProductsTy';
import { ProductController } from '../../controllers/ProductCtrl/ProductCtril';

// well let controller deal with auth

const getRankedBooks = async (req: Req, res: Res, next: Next) => {
    try {

        const productController = new ProductController();
        const qlat = req.query.lat as string;
        const qlng = req.query.lng as string;
        const searchTerm = req.query.search as string;
        const maxDistance = req.query.maxDistance ?? Infinity as number;
        const minRating = req.query.minRating ?? 0 as number;
        const maxPrice = req.query.maxPrice ?? Infinity as number;

        const lat = parseFloat(qlat);
        const lng = parseFloat(qlng);
        // ... any other query params

        const books = {}
        // const books = await productController.getRankedBooks({ lat, lng, searchQuery: searchTerm, maxDistance, minRating, maxPrice });
        res.status(200).json({ books: books });
    } catch (err) {
        res.status(500).json({ message: "There was an error in get ranked books ROUTE", err: err })
    }
}

router.get('/get-full-book-details', async (req: Req, res: Res, next: Next) => { // findAll db not working here
    try {
        const productController = new ProductController();
        const bookDetails = await productController.getBookDetails(req, res, next);
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


export default router;