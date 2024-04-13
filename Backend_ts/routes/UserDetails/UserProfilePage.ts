import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';

import jwt from 'jsonwebtoken';

import path from 'path';
import fs from 'fs';
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const router = Router();

import { UserContoller } from '../../controllers/UserCtrl/UserController';
import { ProcessedUserType, UptUserType } from '../../types/API_Types/User/UserApiTypes';

// URL = currently /user /userProfilePage

const userCtrl = new UserContoller();

router.get('/get-full-user-details', async (req: Req, res: Res, next: Next) => { //  findAll db not working here
    try {

        // user id comes from token
        const user = await userCtrl.getAllUserDetails();
        res.status(200).json({ message: user })
    } catch (err: any) {
        console.log(err)
        res.status(500).json({ err: err.message, message: null })
    }
})

router.get('/get-basic-user-details', async (req: Req, res: Res, next: Next) => { //  findAll db not working here
    try {
        const basicUser = await userCtrl.getBasicUserDetails();
        res.status(200).json({ message: basicUser })
    } catch (err: any) {
        console.log(err)
        res.status(500).json({ err: err.message, message: null })
    }
})




router.post('/change-user-details', async (req: Req, res: Res, next: Next) => { //  findAll db not working here
    try {
        const userDetails: UptUserType = req.body.userDetails as UptUserType;
        await userCtrl.changeUserDetails(userDetails);
        res.status(200).json({ message: "User Details Changed" })
    } catch (err: any) {
        console.log(err)
        res.status(500).json({ err: err.message, message: null })
    }
})


export default router;