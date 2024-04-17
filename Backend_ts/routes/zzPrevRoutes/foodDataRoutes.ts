// import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
// import { authMiddleware } from '../../utils/auth/authUtils'

// import FoodClass from '../../controllers/Others/food/foodController';
// import { User } from '../models/modelSetUp';
// import jwt from 'jsonwebtoken';

// import path from 'path';
// import fs from 'fs';
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


// const router = Router();

// const foodClass: FoodClass = new FoodClass(); // this is not a good solution as it won't work with multiple users


// // we are running into some refresh token issues, so access Token is going to be 15 days and refresh token is going to be 30 days
// // Then a force logout will happen 



// const getUserIdFromHeader = (req: Req, res: Res): string => { // need to change to header
//     try {
//         const bearerAccessToken = req.headers.authorization // contains "bearer"
//         if (bearerAccessToken === undefined || bearerAccessToken === null || bearerAccessToken === "") {
//             console.log("No access token")
//             throw new Error("No access token in cookies")
//         }
//         const accessToken = bearerAccessToken.split(" ")[1];
//         console.log(accessToken)
//         const decoded: any = jwt.verify(accessToken, PUB_KEY); // should make not async// type error if not :any see what's going here
//         return decoded.id
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json({ err: err, message: "There was an error trying to get the user id from cookies" })
//         throw new Error("There was an error")
//     }
// }


// const errorHandler = (err: any, req: Req, res: any, next: any) => {
//     console.log("There was an error", err)
//     if (err) {
//         res.json({ message: "There was a fatal an error", error: err })
//     }
// }

// ///////Some how the middlware need to know what user is logged in and then pass that user to the controller

// //////////////////////////Read////////////////////////////
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


// router.use(errorHandler);
// export default router;