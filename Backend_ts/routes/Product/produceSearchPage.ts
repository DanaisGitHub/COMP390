import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';

import jwt from 'jsonwebtoken';

import path from 'path';
import fs from 'fs';
const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const router = Router();

import {ProductPreview,ProductDetails} from '../../types/Product/ProductsTy';
import {ProductController} from '../../controllers/ProductCtrl/ProductCtril';



const getRankedBooks = async (req: Req, res: Res, next: Next) => {
    try {
        const productController = new ProductController();
        const books = await productController.getBooksRankedAndQueriedFromUserLocation(req, res, next);
        res.status(200).json({ books: books });
    } catch (err) {
        res.status(500).json({ message: "There was an error", err: err })
    }
}

const getBookDetails = async (req: Req, res: Res, next: Next) => {
    try {
        const productController = new ProductController();
        const bookDetails = await productController.getBookDetails(req, res, next);
        res.status(200).json({ message: "This is the data from the python API" })
    } catch (err) {
        res.status(500).json({ message: "There was an error", err: err })
    }
}