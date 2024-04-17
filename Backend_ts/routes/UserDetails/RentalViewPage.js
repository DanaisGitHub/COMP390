"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
const router = (0, express_1.Router)();
router.get('/get-prev-rented-items', async (req, res, next) => {
    try {
        //getBookFullDetails(req, res, next);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ err: err, message: err.message });
    }
});
exports.default = router;
