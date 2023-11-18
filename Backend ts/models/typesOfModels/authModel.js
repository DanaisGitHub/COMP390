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
            let isUser = await this.isAlreadyAUserBool(userDetails.id); // 2 db searches when we could do 1
            if (isUser) {
                //user does exists
                console.log("User Exsits");
                return { err: "User Exsits", result: null };
            }
            const salt = await bcrypt_1.default.genSalt(10);
            userDetails.password = await bcrypt_1.default.hash(userDetails.password, salt);
            const { err, result } = await this.create(this.user, userDetails);
            if (err) {
                console.log(err);
                throw Error("Could't save details");
            }
            else {
                return { err: null, result: result };
            }
        };
        // -1 means not found, -2 means passwords incorrect
        this.login = async (obj) => {
            try {
                const { err, result } = await this.findByPkey(this.user, obj.email);
                if (err) {
                    console.log(`Couldn't find user ${err}`);
                    return { err: err, result: null }; // I don't think this ever runs
                }
                if (result === null) {
                    //not found, already console.logged
                    return { err: true, result: -1 };
                }
                const user = result;
                await this.update(user, { refreshToken: obj.refreshToken });
                const passwordMatch = await this.comparePasswords(obj.rawPassword, user.password);
                if (!passwordMatch.result) {
                    console.log("passwords don't match");
                    return { err: "Passwords don't match", result: -2 };
                }
                return { err: null, result: result };
            }
            catch (err) {
                console.log(err);
                throw new Error("Login error");
            }
        };
        this.isAlreadyAUserObj = async (primaryKey) => {
            try {
                const { err, result } = await this.findByPkey(this.user, primaryKey);
                if (err) {
                    throw new Error(`Problem when trying to find user ) ${err}}`);
                    return { err: err, result: result };
                }
                if (result === null) {
                    return { err: err, result: result };
                }
                else {
                    return { err: err, result: result };
                }
            }
            catch (err) {
                console.log(err);
                throw new Error(`Problem when trying to find user ) ${err}}`);
            }
        };
        this.isAlreadyAUserBool = async (primaryKey) => {
            try {
                const { err, result } = await this.findByPkey(this.user, primaryKey);
                if (err) {
                    return false;
                }
                if (result === null) {
                    return false;
                }
                else {
                    return true;
                }
            }
            catch (err) {
                console.log(err);
                throw new Error("Problem when trying to find user isAlreadyAUserBool");
            }
        };
        this.deleteEverything = async () => {
            try {
                await this.user.destroy({ where: {} });
                await modelSetUp_1.UserLogs.destroy({ where: {} });
                await modelSetUp_1.Excerises.destroy({ where: {} });
                await modelSetUp_1.FoodData.destroy({ where: {} });
                await modelSetUp_1.CustomFoodData.destroy({ where: {} });
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
                const { err, result } = await this.isAlreadyAUserObj(id);
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
        this.getEverything = async () => {
            try {
                let allDatabaseResults = {
                    users: [],
                    userLogs: [],
                    excerises: [],
                    foodData: [],
                    customFoodData: []
                };
                const allUsers = await this.findAll(modelSetUp_1.User, {});
                const allUserLogs = await this.findAll(modelSetUp_1.UserLogs, {});
                const allExcerises = await this.findAll(modelSetUp_1.Excerises, {});
                const allFoodData = await this.findAll(modelSetUp_1.FoodData, {});
                const allCustomFoodData = await this.findAll(modelSetUp_1.CustomFoodData, {});
                allDatabaseResults.users = allUsers.result;
                allDatabaseResults.userLogs = allUserLogs.result;
                allDatabaseResults.excerises = allExcerises.result;
                allDatabaseResults.foodData = allFoodData.result;
                allDatabaseResults.customFoodData = allCustomFoodData.result;
                return { err: null, result: allDatabaseResults };
            }
            catch (err) {
                console.log(err);
                throw new Error("Problem when trying to find all");
            }
        };
    }
}
exports.AuthModel = AuthModel;
