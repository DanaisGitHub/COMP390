"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.UserPreferenceModel = void 0;
const modelSetUp_1 = require("../../DB_Functions/Set_Up/modelSetUp");
const baseModel_1 = require("../baseModel");
const bookModel_1 = require("../Items/bookModel");
const crypto_1 = __importDefault(require("crypto"));
const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
const randomRange = (min, max) => {
    const ran1 = Math.random() * (max - min) + min;
    const ran2 = Math.random() * (max - min) + min;
    if (ran1 > ran2) {
        return { min: ran2, max: ran1 };
    }
    else {
        return { min: ran1, max: ran2 };
    }
};
class UserPreferenceModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.UserPreference);
        this.createEmptyUserPreference = async (userID) => {
            try {
                const { err, result } = await this.baseCreate({ userID });
                return { err, result };
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in createUserPreference");
            }
        };
        this.createRandomUserPreference = async (userID) => {
            try {
                const userPreference = {
                    userID,
                    distanceRange: randomRange(0, 100),
                    priceRange: randomRange(0, 100),
                    ratingRange: randomRange(0, 100),
                    dateRange: { start: new Date(), end: new Date() }
                };
                const userPreferenceModel = new UserPreferenceModel();
                await userPreferenceModel.baseCreate(userPreference);
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in createRandomUserPreference");
            }
        };
        this.updateUserPreference = async (newUserPreference, userID) => {
            try {
                await this.baseUpdate(newUserPreference, { where: { userID } });
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in updateUserPreference" + err);
            }
        };
    }
}
exports.UserPreferenceModel = UserPreferenceModel;
class UserModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.User);
        this.createUser = async (userDetails) => {
            try {
                const bookPreference = new bookModel_1.BookPreferenceModel();
                const userPreference = new UserPreferenceModel(); // Pass the model argument
                const { err, result } = await this.baseCreate(userDetails);
                // creates a prefrance for the user with default values
                const bookPrefResult = await bookPreference.createRandomBookPreference(result.id);
                const userPrefResult = await userPreference.createRandomUserPreference(result.id);
                return { err, result };
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in createUser");
            }
        };
        this.randomDate = (start, end) => {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        };
        this.randomRange = (min, max) => {
            const ran1 = Math.random() * (max - min) + min;
            const ran2 = Math.random() * (max - min) + min;
            if (ran1 > ran2) {
                return { min: ran2, max: ran1 };
            }
            else {
                return { min: ran1, max: ran2 };
            }
        };
        // private createRandomUser = async (): Promise<StdReturn<User>> => {
        //     try {
        //         const userDetails: UserType = {
        //             userEmail: crypto.randomBytes(20).toString('hex') + "@test.com",
        //             password: "password",
        //             userName: crypto.randomBytes(20).toString('hex'),
        //             userAge: Math.floor(Math.random() * 100),
        //             birthDate: this.randomDate(new Date(1920, 1, 1), new Date(2004, 1, 1)),
        //         }
        //         const { err, result } = await this.createUser(userDetails);
        //         return { err, result }
        //     } catch (err) {
        //         console.log(err)
        //         throw new Error("Error in createRandomUser")
        //     }
        // }
        this.createRandomUser = async () => {
            try {
                const userDetails = {
                    firstName: crypto_1.default.randomBytes(10).toString('hex'),
                    lastName: crypto_1.default.randomBytes(10).toString('hex'),
                    userEmail: crypto_1.default.randomBytes(20).toString('hex') + "@test.com",
                    password: "password",
                    birthDate: this.randomDate(new Date(1920, 1, 1), new Date(2004, 1, 1)),
                };
                const { err, result } = await this.createUser(userDetails); // book and user pref created too
                return { err, result };
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in createRandomUser");
            }
        };
        this.createManyRandomUsers = async (amount) => {
            try {
                for (let i = 0; i < amount; i++) {
                    const { err, result } = await this.createRandomUser();
                    if (err) {
                        console.log(err);
                        throw new Error("Error in createManyRandomUsers");
                    }
                }
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in createManyRandomUsers");
            }
        };
    }
}
exports.UserModel = UserModel;
