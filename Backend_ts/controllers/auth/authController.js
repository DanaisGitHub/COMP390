"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
// import modules
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const jwt = __importStar(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
//import self-written files
const authModel_1 = require("../../models/typesOfModels/Users/authModel");
const authUtils_1 = require("../../utils/auth/authUtils");
const passport_2 = require("../../config/passport");
const errorController_1 = require("../errorController");
const UserController_1 = require("../UserCtrl/UserController");
// constants
const pathToKey = path_1.default.join(__dirname, '..', '..', '..', 'id_rsa_pub.pem');
const PUB_KEY = fs_1.default.readFileSync('C:/Users/DZera/Documents/UOL offine/COMP 390/Backend_ts/id_rsa_pub.pem', 'utf8'); // error
const db = new authModel_1.AuthModel();
const accessTime = 900000 * 4 * 24 * 30; // 15 days
const refreshTime = 900000 * 4 * 24 * 30; // 30 days
(0, passport_2.runPassport)(passport_1.default);
const app = (0, express_1.default)();
class AuthController extends UserController_1.UserContoller {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.issueNewAccessToken = (payload) => {
    return (0, authUtils_1.issueJWT)(payload);
};
/**
 *
 * @param token the JWT token
 * @returns body of token OR null for error
 */
AuthController.extractTokenStateAndBody = (token) => {
    try {
        const decoded = jwt.verify(token, PUB_KEY);
        console.log(decoded);
        return decoded;
    }
    catch (err) {
        console.log(err);
        return { err: err.name, result: null };
    }
};
AuthController.extractRefreshTokenFromReq = (req) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (refreshToken === undefined) {
        console.log("No refresh token");
        return undefined;
    }
    console.log(refreshToken);
    const { token } = refreshToken;
    return token;
};
AuthController.logUserOut = (res) => {
    try {
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, result: null });
    }
};
AuthController.tokenState = (token) => {
    try {
        const decoded = jwt.verify(token, PUB_KEY);
        console.log(decoded);
        return decoded;
    }
    catch (err) {
    }
};
/**
 * Attempts to sign up user by checking if user already exists then if not adds user to database
 * @param req Request
 * @param res Response
 * @param next Next Function
 */
AuthController.signUp = async (req, res, next) => {
    try {
        let user = req.body.user;
        const { err, result } = await db.signUp(user);
        if (err) {
            // should be sending more signigicant error
            console.log(err);
            console.log(result);
            res.status(400).json({ err: err, message: result });
        }
        res.status(200).json({ err: err, message: "Success" });
    }
    catch (err) {
        //need to somehow send error to error handler
        console.log(err);
        next(err);
    }
};
/**
 * Attempts to login user by checking password with whats on the database (+ checking if refresh Token is the same)
 * then if successful sends back access token and refresh token
 * @param req Request
 * @param res Response
 * @param next Next Function
 */
AuthController.login = async (req, res, next) => {
    try {
        const userEmail = req.body.userEmail;
        const password = req.body.password;
        console.log(userEmail, password);
        const { err, result: user } = await db.login({ userEmail, rawPassword: password });
        if (err) {
            res.status(500).json({ err: err, result: null });
        }
        else {
            const accessToken = (0, authUtils_1.issueJWT)({ id: user.id, userEmail }, '1d');
            const refreshToken = (0, authUtils_1.issueJWT)({ id: user.id, userEmail }, '30d');
            res.setHeader('Authorization', 'Bearer ' + accessToken); // not working
            res.cookie("accessToken", accessToken, { maxAge: accessTime, httpOnly: true });
            res.cookie("refreshToken", refreshToken, { maxAge: refreshTime, httpOnly: true });
            console.log("Logged in");
            // for login issue couldn't we set cookie for user id and then use that to get user info
            res.status(200).json({ err: false, result: { accessToken: accessToken.token, refreshToken: refreshToken.token, id: user.id } });
        }
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};
AuthController.logout = async (req, res, next) => {
    try {
        const accessToken = _a.extractAccessTokenFromReq(req);
        const { id, userEmail } = _a.getPayloadFromAuthHeader(req); // should be checking if access token is in header Bearer
        console.log(id, userEmail);
        if (accessToken === undefined) {
            console.log("No access token");
            res.status(400).json({ err: "no access token", result: null });
            return;
        }
        res.clearCookie('accessToken', { maxAge: accessTime, httpOnly: true }); // if options are not exactly same as res.cookie then web browser won't clear
        res.removeHeader('Authorization'); // not working
        res.status(200).json({ err: false, result: "Logged out" });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};
app.use(errorController_1.errorHandler);
