"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pathToKey = path_1.default.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs_1.default.readFileSync(pathToKey, 'utf8');
const testController_1 = __importDefault(require("../controllers/test/testController"));
const router = (0, express_1.Router)();
const ctrl = new testController_1.default();
// we are running into some refresh token issues, so access Token is going to be 15 days and refresh token is going to be 30 days
// Then a force logout will happen 
const getUserIdFromHeader = (req, res) => {
    try {
        const bearerAccessToken = req.headers.authorization; // contains "bearer"
        if (bearerAccessToken === undefined || bearerAccessToken === null || bearerAccessToken === "") {
            console.log("No access token");
            throw new Error("No access token in cookies");
        }
        const accessToken = bearerAccessToken.split(" ")[1];
        console.log(accessToken);
        const decoded = jsonwebtoken_1.default.verify(accessToken, PUB_KEY); // should make not async// type error if not :any see what's going here
        return decoded.id;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: "There was an error trying to get the user id from cookies" });
        throw new Error("There was an error");
    }
};
const errorHandler = (err, req, res, next) => {
    console.log("There was an error", err);
    if (err) {
        res.json({ message: "There was a fatal an error", error: err });
    }
};
///////Some how the middlware need to know what user is logged in and then pass that user to the controller
//////////////////////////Read////////////////////////////
router.post('/add-new-item', async (req, res, next) => {
    try {
        ctrl.createItem(req, res, next);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
router.get('/get-One', async (req, res, next) => {
    try {
        ctrl.getOneItem(req, res, next);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
router.get('/getManyBasedOnPrice', async (req, res, next) => {
    try {
        ctrl.getManyItems(req, res, next);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
router.post('/update', async (req, res, next) => {
    try {
        ctrl.updateItem(req, res, next);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
router.post('/remove', async (req, res, next) => {
    try {
        ctrl.removeItem(req, res, next);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
router.post('/add-csv', async (req, res, next) => {
    try {
        ctrl.addCSVItems(req, res, next);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
// router.get('/getAllLogs', authMiddleware, async (req: Req, res: Res, next: Next) => { //  findAll db not working here
//     try {
//         foodClass.getAllUserLogs(req, res, next);
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ err: err, message: null })
//     }
// })
// router.get('/getUserDetails', authMiddleware, async (req: Req, res: Res, next: Next) => { //works
//     try {
//         const user = getUserIdFromHeader(req, res);
//         foodClass.getUserDetails(req, res, next);
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ err: err, message: null })
//     }
// })
// ////////////////////////Update////////////////////////////
// router.put('/changeUserDetails', authMiddleware, async (req: Req, res: Res, next: Next) => { // semi works need to check all casses+ should be try catches 
//     try {
//         const user = getUserIdFromHeader(req, res);
//         foodClass.changeUserDetails(req, res, next);
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json({ err: err, message: null })
//     }
// })
// //////////////////////Create/////////////////////////////
// router.post('/addExercise', authMiddleware, async (req: Req, res: Res, next: Next) => { // NEED TO CHECK WHEN BUILT FRONT END PROPERLY
//     try {
//         foodClass.addExcerise(req, res, next);
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ err: err, message: null })
//     }
// })
// router.post('/addCustomFood', authMiddleware, async (req: Req, res: Res, next: Next) => { // works
//     try {
//         foodClass.addCustomFoodData(req, res, next);
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ err: err, message: null })
//     }
// })
// router.post('/addFood', authMiddleware, async (req: Req, res: Res, next: Next) => { // works
//     try {
//         foodClass.addFoodData(req, res, next);
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json({ err: err, message: null })
//     }
// })
router.use(errorHandler);
exports.default = router;
