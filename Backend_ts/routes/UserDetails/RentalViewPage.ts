import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
// const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
const router = Router();

router.get('/get-prev-rented-items', async (req: Req, res: Res, next: Next) => { //  findAll db not working here
    try {
        //getBookFullDetails(req, res, next);

    } catch (err:any) {
        console.error(err)
        res.status(500).json({ err: err, message: err.message })
    }
})

export default router;