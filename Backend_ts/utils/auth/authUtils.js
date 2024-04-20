"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayloadFromAuthHeader = exports.extractAccessTokenFromReq = exports.authMiddleware = exports.issueJWT = exports.genPassword = exports.validPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jsonwebtoken_2 = require("jsonwebtoken");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_3 = __importDefault(require("jsonwebtoken"));
const passport_2 = require("../../config/passport");
// constants
(0, passport_2.runPassport)(passport_1.default);
const pathToPrivKey = path_1.default.join(__dirname, '..', '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs_1.default.readFileSync(pathToPrivKey, 'utf8');
const pathToPubKey = path_1.default.join(__dirname, '..', '..', 'id_rsa_pub.pem');
const PUB_KEY = fs_1.default.readFileSync(pathToPubKey, 'utf8');
const validPassword = (password, hash, salt) => {
    var hashVerify = crypto_1.default.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
};
exports.validPassword = validPassword;
const genPassword = (password) => {
    var salt = crypto_1.default.randomBytes(32).toString('hex');
    var genHash = crypto_1.default.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return {
        salt: salt,
        hash: genHash
    };
};
exports.genPassword = genPassword;
const issueJWT = (user, expires = "1d") => {
    const { id, userEmail } = user;
    const expiresIn = expires;
    const payload = {
        id: id,
        userEmail: userEmail,
        iat: Math.floor(Date.now() / 1000),
    };
    const signedToken = jsonwebtoken_1.default.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
    const token = signedToken;
    return {
        token,
        expires: expiresIn
    };
};
exports.issueJWT = issueJWT;
const authMiddleware = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (!user) {
            if (info instanceof jsonwebtoken_2.TokenExpiredError) {
                return res.status(401).json({ error: 'Token expired', result: "Login Again" });
            }
            else {
                return res.status(401).json({ error: 'Unauthorized', result: "Login Again" });
            }
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.authMiddleware = authMiddleware;
const extractAccessTokenFromReq = (req) => {
    const accessToken = req.headers.authorization.split(' ')[1]; // should be checking if access token is in header Bearer
    if (accessToken === undefined) {
        console.log("No access token");
        return undefined;
    }
    const token = accessToken;
    return token;
};
exports.extractAccessTokenFromReq = extractAccessTokenFromReq;
const getPayloadFromAuthHeader = (req) => {
    try {
        const accessToken = (0, exports.extractAccessTokenFromReq)(req); // contains "bearer"
        if (accessToken === undefined) {
            throw new Error("No access token");
        }
        const decoded = jsonwebtoken_3.default.verify(accessToken, PUB_KEY); // should make not async// type error if not :any see what's going here
        return { id: parseInt(decoded.id), userEmail: decoded.userEmail };
    }
    catch (err) {
        console.log(err);
        throw new Error("There was an error");
    }
};
exports.getPayloadFromAuthHeader = getPayloadFromAuthHeader;
