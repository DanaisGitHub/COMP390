"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.issueJWT = exports.genPassword = exports.validPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jsonwebtoken_2 = require("jsonwebtoken");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("../config/passport");
const authController_1 = require("../controllers/auth/authController");
// constants
(0, passport_2.runPassport)(passport_1.default);
const pathToKey = path_1.default.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs_1.default.readFileSync(pathToKey, 'utf8');
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
const issueJWT = (user, expires = "5m") => {
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
    const signedToken = jsonwebtoken_1.default.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
    token = signedToken;
    return {
        token: token,
        expires: expiresIn
    };
};
exports.issueJWT = issueJWT;
const authMiddleware = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, async (err, user, info) => {
        // console.log(info);
        // console.log(user);
        if (err) {
            console.log(err);
            return next(err);
        }
        //  console.log(info);
        if (!user) {
            if (info instanceof jsonwebtoken_2.TokenExpiredError) {
                // heres a good place to run refresh token function
                const { err, result } = authController_1.AuthController.accessExpired(req, res, next);
                if (err) {
                    return res.status(401).json({ error: err, result: "Send Refresh Token Or Login Again" });
                }
                const payload = result;
                // need to somehow send a new access token back to user without calling res.s/end
                authController_1.AuthController.issueNewAccessToken(res, payload);
                // user doens't request again for action
                req.user = user;
                next();
            }
            else {
                return res.status(401).json({ error: 'Unauthorized', result: "Login Again" });
            }
        }
        req.user = user;
        next(); // if no error move onto next middleware func
    })(req, res, next);
};
exports.authMiddleware = authMiddleware;
