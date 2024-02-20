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
import { issueJWT, authMiddleware } from '../../utils/authUtils'
import { runPassport } from '../../config/passport'
import { TempUserType } from '../../types/userType'

import StdReturn from '../../types/baseTypes';
import { type } from 'os';

import {errorHandler, asyncErrorHandler} from '../errorController'




// constants
const pathToKey = path.join(__dirname, '..', '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
const db = new AuthModel();
const accessTime = 900000 * 4 * 24 * 30  // 15 days
const refreshTime = 900000 * 4 * 24 * 30 // 30 days
runPassport(passport);

const app = express();

export class AuthController { // would be nice to use a singleton here 


    public static issueNewAccessToken = (res: Res, payload: any): { token: string; expires: string; } => {
        const newAccessToken = issueJWT(payload)
        res.write("New access token issued")
        res.cookie("accessToken", newAccessToken, { maxAge: accessTime, httpOnly: true })
        return newAccessToken
    }

    /**
     * 
     * @param token the JWT token 
     * @returns body of token OR null for error
     */
    private static extractTokenStateAndBody = (token: string): StdReturn => {
        try {
            const decoded: string | jwt.JwtPayload = jwt.verify(token, PUB_KEY);
            console.log(decoded)
            return { err: null, result: decoded }
        }
        catch (err: any) {
            console.log(err)
            return { err: err.name, result: null }

        }
    }

    private static extractAccessTokenFromReq = (req: Req): string | undefined => {
        const accessToken = req.cookies.accessToken || req.body.accessToken || req.headers.authorization?.split('')[1] // should be checking if access token is in header Bearer
        if (accessToken === undefined) {
            console.log("No access token")
            return undefined
        }
        console.log(accessToken)
        const { token } = accessToken
        return token
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

    /**
     * Assuming Correct Authentification, logs user in by setting cookies and headers
     * @param res Response
     * @param payload the body of JWT
     */
    private static logUserIn = (res: Res, payload: String) => {
        try {
            const refreshToken = issueJWT({ id: payload }, "30d");//Should we renew refresh token at each login
            const accessToken = this.issueNewAccessToken(res, payload)
            res.cookie("refreshToken", refreshToken, { maxAge: refreshTime, httpOnly: true })
            res.setHeader('Authorization', 'Bearer ' + accessToken) // no header is being set
            console.log("Logged in")
            // for login issue couldn't we set cookie for user id and then use that to get user info
            res.status(200).json({ err: false, result: { token: accessToken.token, refreshToken: refreshToken } });
        } catch (err) {
            console.log(err)
            res.status(500).json({ err: err, result: null })
        }

    }

    private static logUserOut = (res: Res) => {
        try {
            res.clearCookie('accessToken', { maxAge: accessTime, httpOnly: true }) // if options are not exactly same as res.cookie then web browser won't clear
            res.removeHeader('Authorization'); // not working
            res.status(200).json({ err: false, result: "Logged out" });
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
            let user: TempUserType = req.body
            user.birthDate = new Date();
            console.log(user)

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
        const id: string = req.body.id;
        const password: string = req.body.password;
        const refreshToken = issueJWT({ id: id }, "30d");

        const { err, result } = await db.login({ email: id, rawPassword: password, refreshToken: refreshToken.token })
        if (err) { // err in login attempt
            console.log(err)
            res.status(400).json({ err: err, result: null })
        }
        else {
            this.logUserIn(res, id)

        }
    }

    public static logout = async (req: Req, res: Res, next: Next) => {
        const accessToken = this.extractAccessTokenFromReq(req) // should be checking if access token is in header Bearer
        if (accessToken === undefined) {
            console.log("No access token")
            res.status(400).json({ err: "no access token", result: null })
            return;
        }
        this.logUserOut(res)
    }



    public static autoLogin = async (req: Req, res: Res, next: Next) => {
        try {
            const refreshToken: string | undefined = this.extractRefreshTokenFromReq(req);
            if (refreshToken === undefined) {
                console.log("No refresh token")
                res.status(400).json({ err: "No refresh token", result: null })
                return;
            }


            // get new access token
            const refreshTokenBody: string | jwt.JwtPayload = this.extractTokenStateAndBody(refreshToken);

            const { id } = refreshTokenBody as jwt.JwtPayload;

            this.logUserIn(res, id)

        } catch (err: any) {
            console.log(err)
            res.status(500).json({ err: err, result: null }) // not always true for err 500
        }

    }


    /**
     * When access token expires, this function is called to issue a new access token by validating the refresh Token (body of accessToken is on refresh token)
     * @param req Request
     * @param res Response
     * @param next Next
     * @returns stdReturn with new access token, if err, returns stdReturn with err
     */
    public static accessExpired = (req: Req, res: Res, next: Next): StdReturn => {
        try {

            let theResult: StdReturn = { err: null, result: null }
            const refreshToken: string | undefined = this.extractRefreshTokenFromReq(req);
            if (refreshToken === undefined) {
                console.log("No refresh token")
                theResult.err = "No refresh token"
                return theResult;
            }

            const { err, result }: StdReturn = this.extractTokenStateAndBody(refreshToken);
            if (err === "TokenExpiredError") {
                console.log("Refresh token expired")
                theResult.err = "Refresh token expired"
                return theResult;
            }
            if (err) {
                console.log(err)
                theResult.err = err
                return theResult;
            }

            const { id } = result as jwt.JwtPayload;

            const newAccessToken = issueJWT({ id: id })
            theResult.result = newAccessToken
            return theResult;


        } catch (err: any) {
            console.log(err)
            throw new Error(err)
        }

    }

    public static deleteEverything = async (req: Req, res: Res, next: Next) => {
        try {
            const result = await db.deleteEverything();
            res.json({ err: result.err, reuslt: result.result })
        } catch (err) {
            console.log(err)
            res.json({ err: true, result: err })
        }
    }

    // public static getEverything = async (req: Req, res: Res, next: Next) => {
    //     try {
    //         const result = await db.getEverything();
    //         res.status(200).json({ err: result.err, reuslt: result.result })
    //     } catch (err) {
    //         console.log(err)
    //         res.status(500).json({ err: true, result: err })
    //     }
    // }

    // public static getAllUsers = async (req: Req, res: Res, next: Next) => {
    //     try {
    //         const result = await db.devFindAll();
    //         res.json({ err: false, message: result })
    //     } catch (err) {
    //         console.log(err)
    //         res.json({ err: true, message: err })
    //     }
    // }

}
app.use(errorHandler)
