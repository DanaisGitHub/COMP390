
import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

const pathToKey = path.join(__dirname, '..', '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

/**
 * Base Controller 
 */
export abstract class BaseController {
    
    public  static extractAccessTokenFromReq = (req: Req): string | undefined => {
        const accessToken = req.headers.authorization!.split(' ')[1]  // should be checking if access token is in header Bearer
        if (accessToken === undefined) {
            console.log("No access token")
            return undefined
        }
        const token  = accessToken
        return token
    }

    public static getPayloadFromAuthHeader = (req: Req): { id: number, userEmail: string } => { // need to change to header
        try {
            const accessToken = this.extractAccessTokenFromReq(req) // contains "bearer"
            if (accessToken === undefined) {
                throw new Error("No access token")
            }
            const decoded: any = jwt.verify(accessToken, PUB_KEY); // should make not async// type error if not :any see what's going here
            return { id: parseInt(decoded.id), userEmail: decoded.userEmail }
        }
        catch (err) {
            console.log(err)
            
            throw new Error("There was an error")
        }
    }
}