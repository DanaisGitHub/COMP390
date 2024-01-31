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
const authModel_1 = require("../../models/typesOfModels/authModel");
const authUtils_1 = require("../../utils/authUtils");
const passport_2 = require("../../config/passport");
const errorController_1 = require("../errorController");
// constants
const pathToKey = path_1.default.join(__dirname, '..', '..', 'id_rsa_pub.pem');
const PUB_KEY = fs_1.default.readFileSync(pathToKey, 'utf8');
const db = new authModel_1.AuthModel();
const accessTime = 900000 * 4 * 24 * 30; // 15 days
const refreshTime = 900000 * 4 * 24 * 30; // 30 days
(0, passport_2.runPassport)(passport_1.default);
const app = (0, express_1.default)();
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.issueNewAccessToken = (res, payload) => {
    const newAccessToken = (0, authUtils_1.issueJWT)(payload);
    res.write("New access token issued");
    res.cookie("accessToken", newAccessToken, { maxAge: accessTime, httpOnly: true });
    return newAccessToken;
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
        return { err: null, result: decoded };
    }
    catch (err) {
        console.log(err);
        return { err: err.name, result: null };
    }
};
AuthController.extractAccessTokenFromReq = (req) => {
    var _b;
    const accessToken = req.cookies.accessToken || req.body.accessToken || ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split('')[1]); // should be checking if access token is in header Bearer
    if (accessToken === undefined) {
        console.log("No access token");
        return undefined;
    }
    console.log(accessToken);
    const { token } = accessToken;
    return token;
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
/**
 * Assuming Correct Authentification, logs user in by setting cookies and headers
 * @param res Response
 * @param payload the body of JWT
 */
AuthController.logUserIn = (res, payload) => {
    try {
        const refreshToken = (0, authUtils_1.issueJWT)({ id: payload }, "30d"); //Should we renew refresh token at each login
        const accessToken = _a.issueNewAccessToken(res, payload);
        res.cookie("refreshToken", refreshToken, { maxAge: refreshTime, httpOnly: true });
        res.setHeader('Authorization', 'Bearer ' + accessToken); // no header is being set
        console.log("Logged in");
        // for login issue couldn't we set cookie for user id and then use that to get user info
        res.status(200).json({ err: false, result: { token: accessToken.token, refreshToken: refreshToken } });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, result: null });
    }
};
AuthController.logUserOut = (res) => {
    try {
        res.clearCookie('accessToken', { maxAge: accessTime, httpOnly: true }); // if options are not exactly same as res.cookie then web browser won't clear
        res.removeHeader('Authorization'); // not working
        res.status(200).json({ err: false, result: "Logged out" });
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
        let user = req.body;
        user.birthDate = new Date();
        console.log(user);
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
    const id = req.body.id;
    const password = req.body.password;
    const refreshToken = (0, authUtils_1.issueJWT)({ id: id }, "30d");
    const { err, result } = await db.login({ email: id, rawPassword: password, refreshToken: refreshToken.token });
    if (err) { // err in login attempt
        console.log(err);
        res.status(400).json({ err: err, result: null });
    }
    else {
        _a.logUserIn(res, id);
    }
};
AuthController.logout = async (req, res, next) => {
    const accessToken = _a.extractAccessTokenFromReq(req); // should be checking if access token is in header Bearer
    if (accessToken === undefined) {
        console.log("No access token");
        res.status(400).json({ err: "no access token", result: null });
        return;
    }
    _a.logUserOut(res);
};
AuthController.autoLogin = async (req, res, next) => {
    try {
        const refreshToken = _a.extractRefreshTokenFromReq(req);
        if (refreshToken === undefined) {
            console.log("No refresh token");
            res.status(400).json({ err: "No refresh token", result: null });
            return;
        }
        // get new access token
        const refreshTokenBody = _a.extractTokenStateAndBody(refreshToken);
        const { id } = refreshTokenBody;
        _a.logUserIn(res, id);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err, result: null }); // not always true for err 500
    }
};
/**
 * When access token expires, this function is called to issue a new access token by validating the refresh Token (body of accessToken is on refresh token)
 * @param req Request
 * @param res Response
 * @param next Next
 * @returns stdReturn with new access token, if err, returns stdReturn with err
 */
AuthController.accessExpired = (req, res, next) => {
    try {
        let theResult = { err: null, result: null };
        const refreshToken = _a.extractRefreshTokenFromReq(req);
        if (refreshToken === undefined) {
            console.log("No refresh token");
            theResult.err = "No refresh token";
            return theResult;
        }
        const { err, result } = _a.extractTokenStateAndBody(refreshToken);
        if (err === "TokenExpiredError") {
            console.log("Refresh token expired");
            theResult.err = "Refresh token expired";
            return theResult;
        }
        if (err) {
            console.log(err);
            theResult.err = err;
            return theResult;
        }
        const { id } = result;
        const newAccessToken = (0, authUtils_1.issueJWT)({ id: id });
        theResult.result = newAccessToken;
        return theResult;
    }
    catch (err) {
        console.log(err);
        throw new Error(err);
    }
};
AuthController.deleteEverything = async (req, res, next) => {
    try {
        const result = await db.deleteEverything();
        res.json({ err: result.err, reuslt: result.result });
    }
    catch (err) {
        console.log(err);
        res.json({ err: true, result: err });
    }
};
app.use(errorController_1.errorHandler);
