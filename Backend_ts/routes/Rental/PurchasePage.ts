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
        const purchaseRequestFromBody = req.body.purchaseReqest as FullRentalPurchaseRequest;
        const { ownerID, renterID, startDate, endDate, rentalItems } = purchaseRequestFromBody;

        for (const item of rentalItems) {
            const { itemID, quantity } = item;
            let available = await rentalCtrl.checkIfItemIsAvailable({ ownerID: 10, itemID, startDate, endDate, quantity });
            if (available) {
                res.status(400).json({ err: true, message: "Item is not available" });
            }
        }
        // if item is available
        // create a purchase request
        const purchaseRequest: FullRentalPurchaseRequest = {
            ownerID: 10,
            renterID,
            startDate,
            endDate,
            rentalItems
        }
        await rentalCtrl.createPurchaseRequest(purchaseRequest);

        res.status(200).json({ err: false, message: "Purchase request created" });
    }
    catch (err: any) {
        next(err); // 
        console.error(err);
        res.status(500).json({ err: err, message: err.message });
    }
});
export default router;