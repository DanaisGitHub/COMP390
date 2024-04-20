// import modules
import passport from 'passport';
import passportjwt from "passport-jwt";
import bycrpt from 'bcrypt';
import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import * as jwt from "jsonwebtoken"
import type { JwtPayload } from "jsonwebtoken"
import express from 'express';

//import self-written files
import { AuthModel } from '../../models/typesOfModels/Users/authModel';
import { User } from '../../models/DB_Functions/Set_Up/modelSetUp';
import { issueJWT, authMiddleware } from '../../utils/auth/authUtils'
import { runPassport } from '../../config/passport'
import { TempUserType } from '../../types/DBTypes/UserTypes/userTypes'

import StdReturn from '../../types/baseTypes';
import { type } from 'os';

import { errorHandler, asyncErrorHandler } from '../errorController'
import { UserContoller } from '../UserCtrl/UserController';



// constants

const pathToKey = path.join(__dirname, '..', '..', '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync('C:/Users/DZera/Documents/UOL offine/COMP 390/Backend_ts/id_rsa_pub.pem', 'utf8'); // error
const db = new AuthModel();
const accessTime = 900000 * 4 * 24 * 30  // 15 days
const refreshTime = 900000 * 4 * 24 * 30 // 30 days
runPassport(passport);

const app = express();

export class AuthController extends UserContoller { // would be nice to use a singleton here 


    public static issueNewAccessToken = (payload: { id: number, userEmail: string }): { token: string; expires: string; } => {
        return issueJWT(payload)
    }

    /**
     * 
     * @param token the JWT token 
     * @returns body of token OR null for error
     */
    private static extractTokenStateAndBody = (token: string): jwt.JwtPayload => {
        try {
            const decoded: string | jwt.JwtPayload = jwt.verify(token, PUB_KEY);
            console.log(decoded)
            return decoded as jwt.JwtPayload
        }
        catch (err: any) {
            console.log(err)
            return { err: err.name, result: null }

        }
    }



    private static extractRefreshTokenFromReq = (req: Req): string | undefined => {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (refreshToken === undefined) {
            console.log("No refresh token")
            return undefined
        }
        console.log(refreshToken)
        const { token } = refreshToken
        return token
    }


    private static logUserOut = (res: Res) => {
        try {

        } catch (err) {
            console.log(err)
            res.status(500).json({ err: err, result: null })
        }
    }

    private static tokenState = (token: string) => {
        try {
            const decoded: string | jwt.JwtPayload = jwt.verify(token, PUB_KEY);
            console.log(decoded)
            return decoded
        } catch (err) {

        }
    }



    /**
     * Attempts to sign up user by checking if user already exists then if not adds user to database
     * @param req Request
     * @param res Response
     * @param next Next Function
     */
    public static signUp = async (req: Req, res: Res, next: Next) => {
        try {
            let user: TempUserType = req.body.user;
            const { err, result } = await db.signUp(user)
            if (err) {
                // should be sending more signigicant error
                console.log(err)
                console.log(result)
                res.status(400).json({ err: err, message: result })
            }
            res.status(200).json({ err: err, message: "Success" })
        }
        catch (err: any) {
            //need to somehow send error to error handler
            console.log(err)
            next(err)
        }
    }


    /**
     * Attempts to login user by checking password with whats on the database (+ checking if refresh Token is the same)
     * then if successful sends back access token and refresh token
     * @param req Request
     * @param res Response
     * @param next Next Function
     */
    public static login = async (req: Req, res: Res, next: Next) => {
        try {
            const userEmail: string = req.body.userEmail;
            const password: string = req.body.password;
            console.log(userEmail, password)
            const { err, result: user } = await db.login({ userEmail, rawPassword: password })
            if (err) {
                res.status(500).json({ err: err, result: null })
            }
            else {
                const accessToken = issueJWT({ id: user!.id, userEmail }, '1d')
                const refreshToken = issueJWT({ id: user!.id, userEmail }, '30d');
                res.setHeader('Authorization', 'Bearer ' + accessToken) // not working
                res.cookie("accessToken", accessToken, { maxAge: accessTime, httpOnly: true })
                res.cookie("refreshToken", refreshToken, { maxAge: refreshTime, httpOnly: true })
                console.log("Logged in")
                // for login issue couldn't we set cookie for user id and then use that to get user info
                res.status(200).json({ err: false, result: { accessToken: accessToken.token, refreshToken: refreshToken.token, id:user!.id } });
            }
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    public static logout = async (req: Req, res: Res, next: Next) => {
        try {
            const accessToken = this.extractAccessTokenFromReq(req)
            const { id, userEmail } = this.getPayloadFromAuthHeader(req) // should be checking if access token is in header Bearer
            console.log(id, userEmail)
            if (accessToken === undefined) {
                console.log("No access token")
                res.status(400).json({ err: "no access token", result: null })
                return;
            }
            res.clearCookie('accessToken', { maxAge: accessTime, httpOnly: true }) // if options are not exactly same as res.cookie then web browser won't clear
            res.removeHeader('Authorization'); // not working
            res.status(200).json({ err: false, result: "Logged out" });

        } catch (err) {
            console.error(err)
            next(err)
        }

    }
}
app.use(errorHandler)
