"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPassport = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// SQL 
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const authModel_1 = require("../models/typesOfModels/Users/authModel");
const db = new authModel_1.AuthModel();
const pathToKey = path_1.default.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs_1.default.readFileSync(pathToKey, 'utf8');
const localStrategy = new passport_local_1.Strategy(// don't really know what this does
async (userEmail, password, done) => {
    try {
        const user = await db.findUserByEmail(userEmail); //dont think i need 
        if (!user) {
            return done(null, false);
        }
        const isValid = await db.comparePasswords(password, user.password);
        if (!isValid) {
            return done(null, false);
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
});
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorthims: ['RS256'],
    ignoreExpiration: false
};
// if user cannot be found then this crashes 
const strategy = new passport_jwt_1.Strategy(options, async (payload, done) => {
    try {
        const { err, result } = await db.isAlreadyAUserObj(payload.id); // I have defined as email here, need to change it 
        if (err) {
            done(err);
            console.log("in stratergy err or not found not found  :" + err);
            return done(err);
        }
        else if (!result) {
            return done(null, false); //not found
        }
        else {
            return done(null, result); // found
        }
    }
    catch (err) {
        console.log("In strategy couldn't log user in: " + err);
        // done(err) // should we put this in there
        throw new Error("In strategy couldn't log user in: " + err);
    }
});
const runPassport = async (passport) => {
    await passport.use(localStrategy);
    await passport.use(strategy);
};
exports.runPassport = runPassport;
