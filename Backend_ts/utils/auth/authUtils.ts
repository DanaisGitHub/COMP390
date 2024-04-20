import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import passport from 'passport';
import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import jwt from 'jsonwebtoken';

import { runPassport } from '../../config/passport'

import { AuthController } from '../../controllers/auth/authController';

// constants

runPassport(passport);



const pathToPrivKey = path.join(__dirname, '..', '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToPrivKey, 'utf8');

const pathToPubKey = path.join(__dirname, '..', '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');

export const validPassword = (password: any, hash: any, salt: any) => {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

export const genPassword = (password: any) => {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash
    };
}

export const issueJWT = (user: { id: number, userEmail: string }, expires: string = "1d") => { // could we do access and refresh with difference time vars ....
    const { id, userEmail } = user;
    const expiresIn = expires;
    const payload = {
        id: id,// user database id
        userEmail: userEmail,
        iat: Math.floor(Date.now() / 1000),
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

    const token = signedToken;

    return {
        token,
        expires: expiresIn
    }
}

export const authMiddleware = (req: Req, res: Res, next: Next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.log(err)
            return next(err);
        }
        if (!user) {
            if (info instanceof TokenExpiredError) {
                return res.status(401).json({ error: 'Token expired', result: "Login Again" });
            } else {
                return res.status(401).json({ error: 'Unauthorized', result: "Login Again" });
            }
        }
        req.user = user;
        next();
    })(req, res, next);
};

export const extractAccessTokenFromReq = (req: Req): string | undefined => {
    const accessToken = req.headers.authorization!.split(' ')[1]  // should be checking if access token is in header Bearer
    if (accessToken === undefined) {
        console.log("No access token")
        return undefined
    }
    const token = accessToken
    return token
}

export const getPayloadFromAuthHeader = (req: Req): { id: number, userEmail: string } => { // need to change to header
    try {
        const accessToken = extractAccessTokenFromReq(req) // contains "bearer"
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