"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const modelSetUp_1 = require("../modelSetUp");
const baseModel_1 = require("./baseModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
// pre-processing & storage goes in here
class AuthModel extends baseModel_1.BaseModel {
    constructor() {
        super(...arguments);
        this.user = modelSetUp_1.User; // not specified which user just all Users
        this.signUp = async (userDetails) => {
            // check to see if already exists
            // check data is correct (should use validator software)
            try {
                let isUser = await this.findUserByEmail(userDetails.userEmail); // 2 db searches when we could do 1
                if (isUser.result !== null) {
                    //user does exists
                    console.log("User " + userDetails.userEmail + " Exsits");
                    return { err: "User '" + userDetails.userEmail + "' Exsits", result: null };
                }
                const salt = await bcrypt_1.default.genSalt(10);
                userDetails.password = await bcrypt_1.default.hash(userDetails.password, salt);
                const { err, result } = await this.baseCreate(this.user, userDetails);
                return { err: null, result: result };
            }
            catch (err) {
                console.log(err);
                throw new Error("AuthModel signUp() -----> " + err);
            }
        };
        this.login = async (obj) => {
            try {
                const { err, result } = await this.findUserByEmail(obj.email);
                if (err) {
                    console.log(`Error in login ${err}`);
                    return { err: err, result: null }; // I don't think this ever runs
                }
                if (result === null) {
                    //not found, already console.logged
                    return { err: "User Not Found", result: null };
                }
                const user = result;
                await this.baseUpdate(user, { refreshToken: obj.refreshToken });
                const passwordMatch = await this.comparePasswords(obj.rawPassword, user.password);
                if (!passwordMatch.result) {
                    console.log("passwords don't match");
                    return { err: "Passwords don't match", result: null };
                }
                return { err: null, result: result };
            }
            catch (err) {
                console.log(err);
                throw new Error("Login error");
            }
        };
        this.findUserByEmail = async (email) => {
            try {
                const { err, result } = await this.findOne(this.user, { where: { "userEmail": email } });
                if (result === null) {
                    console.log(err);
                    return { err: "User Not Found", result: null };
                }
                return { err: err, result: result };
            }
            catch (err) {
                console.log(err);
                throw new Error(`authModel findUserByEmai catch err ----> ${err}}`);
            }
        };
        this.deleteEverything = async () => {
            try {
                await this.user.destroy({ where: {} });
                return { err: null, result: "Everything from db is delete" };
            }
            catch (err) {
                console.log(err);
                throw new Error("Problem when trying to delete everything");
            }
        };
        this.createHash = async (rawPassword) => {
            try {
                const salt = await bcrypt_1.default.genSalt(10);
                const hashedPassword = await bcrypt_1.default.hash(rawPassword, salt);
                return { err: null, result: hashedPassword };
            }
            catch (err) {
                console.log(err);
                throw new Error("Error when hashing password");
            }
        };
        this.comparePasswords = async (rawPassword, hashedPassword) => {
            try {
                const result = await bcrypt_1.default.compare(rawPassword, hashedPassword);
                return { err: null, result: result };
            }
            catch (err) {
                console.log(err);
                throw new Error("Couldn't compare passwords");
            }
        };
        // 
        this.isRefreshTokenSame = async (obj) => {
            try {
                const { id, refreshToken } = obj;
                console.log(id);
                const { err, result } = await this.findUserByEmail(id);
                const user = result;
                console.log("err =" + err);
                if (err) {
                    console.log(err);
                    throw new Error(`Couldn't check if refresh tokens are the same: ${err}`);
                }
                if (user.refreshToken === null) {
                    console.log("User doesnt have a refresh token");
                    return { err: true, result: false };
                }
                if (refreshToken !== user.refreshToken) {
                    return { err: true, result: false };
                }
                return { err: false, result: true };
            }
            catch (err) {
                console.log(err);
                throw new Error(`coudn't check refresh tokens at this time ${err}`);
            }
        };
        // public emailToken = async (email: string): Promise<StdReturn> => {
        //     try {
        //     }
        //     catch (err:any) {
        //         console.log(err)
        //         throw new Error(`Couldn't email token at this time ${err}`)
        //     }
        // }
        // public getEverything = async (): Promise<StdReturn> => {
        //     try {
        //         let allDatabaseResults = {
        //             users: [],
        //             userLogs: [],
        //             excerises: [],
        //             foodData: [],
        //             customFoodData: []
        //         }
        //         const allUsers = await this.findAll(User, {});
        //         const allUserLogs = await this.findAll(UserLogs, {});
        //         const allExcerises = await this.findAll(Excerises, {});
        //         const allFoodData = await this.findAll(FoodData, {});
        //         const allCustomFoodData = await this.findAll(CustomFoodData, {});
        //         allDatabaseResults.users = allUsers.result;
        //         allDatabaseResults.userLogs = allUserLogs.result;
        //         allDatabaseResults.excerises = allExcerises.result;
        //         allDatabaseResults.foodData = allFoodData.result;
        //         allDatabaseResults.customFoodData = allCustomFoodData.result;
        //         return { err: null, result: allDatabaseResults }
        //     } catch (err) {
        //         console.log(err)
        //         throw new Error("Problem when trying to find all");
        //     }
        // }
    }
}
exports.AuthModel = AuthModel;
