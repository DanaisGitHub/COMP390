import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import passport from 'passport';
import { Request as Req, Response as Res, NextFunction as Next } from 'express';

import { runPassport } from '../config/passport'

import { AuthController} from '../controllers/auth/authController';

// constants

runPassport(passport);



const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

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

export const issueJWT = (user: any, expires:string = "5m") => { // could we do access and refresh with difference time vars ....
    let id = user.id;
    let token;

    const expiresIn = expires;

    // if (refresh) {
    //     expiresIn = '30d';
    //     let id = user.id + "!";// makes sure refresh token cannot be used as access token
    // }
    // else {
    //     expiresIn = '15d'; // no longer using refresh token really
    // }

    const payload = {
        id: id,
        iat: Math.floor(Date.now() / 1000),
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

    token = signedToken;

    return {
        token: token,
        expires: expiresIn
    }
}

export const authMiddleware = (req: Req, res: Res, next: Next) => { // if Token expired need to send back login again / give me your refresh token
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        // console.log(info);
        // console.log(user);
        if (err) {
            console.log(err)
            return next(err);
        }
        //  console.log(info);
        if (!user) {
            if (info instanceof TokenExpiredError) {
                // heres a good place to run refresh token function
                const {err,result} = AuthController.accessExpired(req, res, next)
                if (err){
                    return res.status(401).json({ error: err, result: "Send Refresh Token Or Login Again" });
                }
                const payload = result;
                // need to somehow send a new access token back to user without calling res.s/end
                AuthController.issueNewAccessToken(res,payload);
                // user doens't request again for action
                req.user = user;
                next();
                
            
            } else {
                return res.status(401).json({ error: 'Unauthorized', result: "Login Again" });
            }
        }
        req.user = user;
        next(); // if no error move onto next middleware func
    })(req, res, next);
};