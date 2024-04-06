import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { RentalsContorller } from '../../controllers/RentalsCtrl/RentalsCtrl';
import { RentalOrderType, RentalItemType, FullRentalPurchaseRequest } from '../../types/API_Types/Rental/RentalAPITypes';
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const router = Router();
const rentalCtrl = new RentalsContorller();

// well let controller deal with auth

router.get('/purchase-request', async (req: Req, res: Res, next: Next) => {
    try {
        const ownerID = parseInt(req.body.purchaseRequest.ownerID);
        const startDate = new Date(req.body.purchaseRequest.startDate);
        const endDate = new Date(req.body.purchaseRequest.endDate);
        const rentalItems: RentalItemType[] = req.body.purchaseRequest.rentalItems;
        console.log(rentalItems);


        // for (const item of rentalItems) {
        //     const { itemID, quantity } = item;
        //     let available = await rentalCtrl.checkIfItemIsAvailable({ ownerID, itemID, startDate, endDate, quantity });
        //     if (available) {
        //         res.status(400).json({ err: true, message: "Item is not available" });
        //     }
        // }
        //if item is available
        // create a purchase request
        const purchaseRequest: FullRentalPurchaseRequest = {
            ownerID,
            renterID: 10,
            startDate,
            endDate,
            rentalItems
        }
        await rentalCtrl.createPurchaseRequest(purchaseRequest);

        res.status(200).json({ err: false, message: "Purchase request created" });
    }
    catch (err: any) {
        next(err); // 
        if (err.message === "Item is not available") {
            res.status(400).json({ err: true, message: err.message });
        }
        console.error(err);
        res.status(500).json({ err: err, message: err.message });
    }
});

export default router;

// {
//     "purchaseRequest": {
//         "ownerID": 8,
//         "renterID": 1,
//         "startDate": "04/04/2024",
//         "endDate": "04/05/2024",
//         "rentalItems": [
//             {
//                 "itemID": 19,
//                 "quantity": 1
//             }
//         ]
//     }
// }