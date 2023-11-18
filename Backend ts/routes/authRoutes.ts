import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';

import { AuthController as AuthFunctions } from '../controllers/auth/authController';
import { authMiddleware } from '../utils/authUtils';

// we are running into some refresh token issues, so access Token is going to be 15 days and refresh token is going to be 30 days
// Then a force logout will happen 


////////////////////////////////////////////////////////////////////////////////////
///auth/.test........

const router = Router();

const errorHandler = (err: any, req: Req, res: Res, next: Next) => {
    console.log("There was an error", err)
    res.status(500).json({ err: `There was a fatal an error`, result: null })
}

router.get('/error', (req: Req, res: Res, next: Next) => {// how you error handle
    next(errorHandler); // in async function you can do next(errorHandler) but no need to do it in a sync function
})

// router.get('/findAll', async (req: Req, res: Res, next: Next) => { //works
//     try {
//         AuthFunctions.getAllUsers(req, res, next);
//     } catch (err) {
//         console.log(err)
//         res.json({ err: true, message: err })
//     }
// })

//added in 
router.post('/signUp', async (req: Req, res: Res, next: Next) => { // semi works need to check all casses+ should be try catches 
    try {
        AuthFunctions.signUp(req, res, next);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err: err, message: null })
        next(err)
    }
})

router.post('/login', async (req: Req, res: Res, next: Next) => { // NEED TO CHECK WHEN BUILT FRONT END PROPERLY
    try {
        AuthFunctions.login(req, res, next);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err: err, message: null })
    }
})

router.post('/logout', authMiddleware, async (req: Req, res: Res, next: Next) => { // it think done
    try {

        AuthFunctions.logout(req, res, next);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err: err, message: null })
    }
})

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

router.post("/deleteEverything", async (req: Req, res: Res, next: Next) => { // works // Shouls we Really have this in production?
    try {
        AuthFunctions.deleteEverything(req, res, next);
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err, message: null })
    }
})

router.get("/getEverything", async (req: Req, res: Res, next: Next) => { // works // Shouls we Really have this in production?
    try {
        AuthFunctions.getEverything(req, res, next);
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err, message: null })
    }
});

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
export default router;