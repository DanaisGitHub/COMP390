"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
const RentalsCtrl_1 = require("../../controllers/RentalsCtrl/RentalsCtrl");
const rentalsCtrl = new RentalsCtrl_1.RentalsContorller();
const router = (0, express_1.Router)();
router.get('/get-listed-items', async (req, res, next) => {
    try {
        //getBookFullDetails(req, res, next);
        const rental = await rentalsCtrl.getAllCurrentlyListedItems();
        res.status(200).json({ message: rental });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ err: err.message, message: null });
    }
});
router.post('/add-new-item-listing', async (req, res, next) => {
    try {
        const userItem = req.body.userItem;
        userItem.ownerID = 10;
        const rental = await rentalsCtrl.addNewItemListing(userItem);
        res.status(200).json({ message: `userItem is added` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ err: err.message, message: null });
    }
});
router.get('/delete-item-listing', async (req, res, next) => {
    try {
        const itemID = req.body.itemID;
        const rental = await rentalsCtrl.deleteItemListing(itemID);
        res.status(200).json({ message: `userItem is deleted` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ err: err.message, message: null });
    }
});
exports.default = router;
