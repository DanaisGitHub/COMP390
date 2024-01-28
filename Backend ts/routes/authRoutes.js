"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/auth/authController");
const authUtils_1 = require("../utils/authUtils");
// we are running into some refresh token issues, so access Token is going to be 15 days and refresh token is going to be 30 days
// Then a force logout will happen 
////////////////////////////////////////////////////////////////////////////////////
///auth/.test........
const router = (0, express_1.Router)();
const errorHandler = (err, req, res, next) => {
    console.log("There was an error", err);
    res.status(500).json({ err: err, result: null });
};
router.get('/error', (req, res, next) => {
    next(errorHandler); // in async function you can do next(errorHandler) but no need to do it in a sync function
});
// router.get('/findAll', async (req: Req, res: Res, next: Next) => { //works
//     try {
//         AuthFunctions.getAllUsers(req, res, next);
//     } catch (err) {
//         console.log(err)
//         res.json({ err: true, message: err })
//     }
// })
//added in 
router.post('/signUp', async (req, res, next) => {
    try {
        await authController_1.AuthController.signUp(req, res, next);
    }
    catch (err) {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + err);
        next(err);
        //res.status(500).json({ err: err, message: null })
    }
});
router.post('/login', async (req, res, next) => {
    try {
        authController_1.AuthController.login(req, res, next);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
router.post('/logout', authUtils_1.authMiddleware, async (req, res, next) => {
    try {
        authController_1.AuthController.logout(req, res, next);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
// router.post('/autoLogin', async (req: Req, res: Res, next: Next) => { // it think done
//     try {
//         AuthFunctions.autoLogin(req, res, next);
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json({ err: err, message: null })
//     }
// })
// router.post('/checkAccessToken', authMiddleware, async (req: Req, res: Res, next: Next) => { // it think done
//     try {
//         AuthFunctions.checkAccessToken(req, res, next);
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json({ err: err, message: null })
//     }
// })
router.post("/deleteEverything", async (req, res, next) => {
    try {
        authController_1.AuthController.deleteEverything(req, res, next);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, message: null });
    }
});
// router.get("/getEverything", async (req: Req, res: Res, next: Next) => { // works // Shouls we Really have this in production?
//     try {
//         AuthFunctions.getEverything(req, res, next);
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ err: err, message: null })
//     }
// });
// router.post("/deleteUser",authMiddleware, async (req: Req, res: Res, next: Next) => { // works // At some point Due to GDPR we will need to have this
//     try{
//         AuthFunctions.deleteUser(req, res, next);
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ err: err, message: null })
//     }
// });
// router.post('/resetPasswordRequest', async (req: Req, res: Res, next: Next) => { // works
//     try {
//         AuthFunctions.resetPassword(req, res, next);
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json({ err: err, message: null })
//     }
// }
// router.post('/resetPassword', async (req: Req, res: Res, next: Next) => { // works
//     try {
//         AuthFunctions.resetPassword(req, res, next);
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json({ err: err, message: null })
//     }
// })
router.use(errorHandler);
exports.default = router;
