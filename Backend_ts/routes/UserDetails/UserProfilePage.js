"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
const router = (0, express_1.Router)();
const UserController_1 = require("../../controllers/UserCtrl/UserController");
const authUtils_1 = require("../../utils/auth/authUtils");
// URL = currently /user /userProfilePage
const userCtrl = new UserController_1.UserContoller();
router.get('/get-full-user-details', authUtils_1.authMiddleware, async (req, res, next) => {
    try {
        const { id: userID, userEmail } = (0, authUtils_1.getPayloadFromAuthHeader)(req);
        const user = await userCtrl.getAllUserDetails(userID);
        res.status(200).json({ message: user });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message, message: null });
    }
});
router.get('/get-basic-user-details', authUtils_1.authMiddleware, async (req, res, next) => {
    try {
        const { id: userID, userEmail } = (0, authUtils_1.getPayloadFromAuthHeader)(req);
        const basicUser = await userCtrl.getBasicUserDetails(userID);
        res.status(200).json({ message: basicUser });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message, message: null });
    }
});
router.post('/change-user-details', authUtils_1.authMiddleware, async (req, res, next) => {
    try {
        const userDetails = req.body.userDetails;
        userDetails.id = (0, authUtils_1.getPayloadFromAuthHeader)(req).id;
        await userCtrl.changeUserDetails(userDetails);
        res.status(200).json({ message: "User Details Changed" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message, message: null });
    }
});
exports.default = router;
