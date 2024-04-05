"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
const router = (0, express_1.Router)();
// well let controller deal with auth
router.get('/purchase-request', (req, res, next) => {
    try {
        const quantity = req.query.quantity;
        const price = req.query.price;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate; // turn into date object
        // check if item meets requirements
        if (false) {
            res.status(400).json({ err: " ", message: "Item is not available" });
        }
        // if item is available
        // create a purchase request
    }
    catch (err) {
        next(err); // 
        res.status(500).json({ err: err, message: err.message });
    }
});
exports.default = router;
