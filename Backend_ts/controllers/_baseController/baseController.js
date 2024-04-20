"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pathToKey = path_1.default.join(__dirname, '..', '..', 'id_rsa_pub.pem');
const PUB_KEY = fs_1.default.readFileSync(pathToKey, 'utf8');
/**
 * Base Controller
 */
class BaseController {
}
exports.BaseController = BaseController;
_a = BaseController;
BaseController.extractAccessTokenFromReq = (req) => {
    const accessToken = req.headers.authorization.split(' ')[1]; // should be checking if access token is in header Bearer
    if (accessToken === undefined) {
        console.log("No access token");
        return undefined;
    }
    const token = accessToken;
    return token;
};
BaseController.getPayloadFromAuthHeader = (req) => {
    try {
        const accessToken = _a.extractAccessTokenFromReq(req); // contains "bearer"
        if (accessToken === undefined) {
            throw new Error("No access token");
        }
        const decoded = jsonwebtoken_1.default.verify(accessToken, PUB_KEY); // should make not async// type error if not :any see what's going here
        return { id: parseInt(decoded.id), userEmail: decoded.userEmail };
    }
    catch (err) {
        console.log(err);
        throw new Error("There was an error");
    }
};
