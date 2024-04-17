import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';

import jwt from 'jsonwebtoken';

import path from 'path';
import fs from 'fs';
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
import { RentalsContorller } from '../../controllers/RentalsCtrl/RentalsCtrl';
import { BookItemType } from '../../types/DBTypes/BookTypes/bookTypes';
import { UserItemType } from '../../types/DBTypes/RentalTypes/rentalType';

const rentalsCtrl = new RentalsContorller();
const router = Router();

router.get('/get-listed-items', async (req: Req, res: Res, next: Next) => { //  findAll db not working here
    try {
        //getBookFullDetails(req, res, next);
        const rental = await rentalsCtrl.getAllCurrentlyListedItems();
        res.status(200).json({ message: rental })


    } catch (err: any) {
        console.error(err)
        res.status(500).json({ err: err.message, message: null })
    }
})

router.post('/add-new-item-listing', async (req: Req, res: Res, next: Next) => { //  findAll db not working here
    try {
        const userItem = req.body.userItem as UserItemType;
        userItem.ownerID = 10;
        const rental = await rentalsCtrl.addNewItemListing(userItem);
        res.status(200).json({ message: `userItem is added` })
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ err: err.message, message: null })
    }
})

router.get('/delete-item-listing', async (req: Req, res: Res, next: Next) => { //  findAll db not working here
    try {
        const itemID = req.body.itemID as number;
        const rental = await rentalsCtrl.deleteItemListing(itemID);
        res.status(200).json({ message: `userItem is deleted` })
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ err: err.message, message: null })
    }
})

export default router;