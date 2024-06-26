"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RentalsCtrl_1 = require("../../controllers/RentalsCtrl/RentalsCtrl");
const authUtils_1 = require("../../utils/auth/authUtils");
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
const router = (0, express_1.Router)();
const rentalCtrl = new RentalsCtrl_1.RentalsContorller();
// well let controller deal with auth
router.post('/purchase-request', authUtils_1.authMiddleware, async (req, res, next) => {
    try {
        const ownerID = parseInt(req.body.ownerID);
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        const rentalItems = req.body.rentalItems;
        const { id, userEmail } = (0, authUtils_1.getPayloadFromAuthHeader)(req);
        const purchaseRequest = {
            ownerID,
            renterID: id,
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
            res.status(400).json({ err: err.message, message: err.message });
        }
        console.error(err);
        res.status(500).json({ err: err.message, message: err.message });
    }
});
router.get('/getPrice&Quantity', authUtils_1.authMiddleware, async (req, res, next) => {
    try {
        const ownerID = parseInt(req.query.ownerID);
        const itemID = parseInt(req.query.itemID);
        const message = await rentalCtrl.getPriceAndQuantity({ ownerID, itemID });
        res.status(200).json({ err: false, message });
    }
    catch (err) {
        next(err);
        console.error(err);
        res.status(500).json({ err: err.message, message: { price: -1, quantity: -1 } });
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
