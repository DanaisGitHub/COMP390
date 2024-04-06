"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RentalsCtrl_1 = require("../../controllers/RentalsCtrl/RentalsCtrl");
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
const router = (0, express_1.Router)();
const rentalCtrl = new RentalsCtrl_1.RentalsContorller();
// well let controller deal with auth
router.get('/purchase-request', async (req, res, next) => {
    try {
        const ownerID = parseInt(req.body.purchaseRequest.ownerID);
        const startDate = new Date(req.body.purchaseRequest.startDate);
        const endDate = new Date(req.body.purchaseRequest.endDate);
        const rentalItems = req.body.purchaseRequest.rentalItems;
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
        const purchaseRequest = {
            ownerID,
            renterID: 10,
            startDate,
            endDate,
            rentalItems
        };
        await rentalCtrl.createPurchaseRequest(purchaseRequest);
        res.status(200).json({ err: false, message: "Purchase request created" });
    }
    catch (err) {
        next(err); // 
        if (err.message === "Item is not available") {
            res.status(400).json({ err: true, message: err.message });
        }
        console.error(err);
        res.status(500).json({ err: err, message: err.message });
    }
});
exports.default = router;
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
