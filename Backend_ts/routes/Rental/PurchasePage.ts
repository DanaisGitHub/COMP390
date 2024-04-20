import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { RentalsContorller } from '../../controllers/RentalsCtrl/RentalsCtrl';
import { RentalOrderType, RentalItemType, FullRentalPurchaseRequest } from '../../types/API_Types/Rental/RentalAPITypes';
import { authMiddleware, getPayloadFromAuthHeader } from '../../utils/auth/authUtils';
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const router = Router();
const rentalCtrl = new RentalsContorller();

// well let controller deal with auth

router.post('/purchase-request', authMiddleware, async (req: Req, res: Res, next: Next) => {
    try {
        const ownerID = parseInt(req.body.ownerID);
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        const rentalItems: RentalItemType[] = req.body.rentalItems;
        const { id, userEmail } = getPayloadFromAuthHeader(req)
        const purchaseRequest: FullRentalPurchaseRequest = {
            ownerID,
            renterID: id,
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
            res.status(400).json({ err: err.message, message: err.message });
        }
        console.error(err);
        res.status(500).json({ err: err.message, message: err.message });
    }
});

router.get('/getPrice&Quantity', authMiddleware, async (req: Req, res: Res, next: Next) => {
    try {
        const ownerID = parseInt(req.query.ownerID as string);
        const itemID = parseInt(req.query.itemID as string);

        const message = await rentalCtrl.getPriceAndQuantity({ ownerID, itemID });
        res.status(200).json({ err: false, message });
    }
    catch (err: any) {
        next(err);
        console.error(err);
        res.status(500).json({ err: err.message, message: { price: -1, quantity: -1 } });
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