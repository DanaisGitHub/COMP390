"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.UserPreferenceModel = void 0;
const modelSetUp_1 = require("../../DB_Functions/Set_Up/modelSetUp");
const baseModel_1 = require("../baseModel");
const bookModel_1 = require("../Items/BookModels/bookModel");
const crypto_1 = __importDefault(require("crypto"));
const random_1 = require("../../../utils/other/random");
const locationUtils_1 = require("../../../utils/locationUtils");
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
                const { min: distanceMin, max: distanceMax } = (0, random_1.randomRange)(0, 100);
                const { min: priceMin, max: priceMax } = (0, random_1.randomRange)(0, 1000);
                const { min: ratingMin, max: ratingMax } = (0, random_1.randomRange)(0, 5, true);
                const { min: dateMin, max: dateMax } = (0, random_1.randomDateRange)(new Date(1920, 1, 1), new Date(2020, 1, 1));
                const userPreference = {
                    userID,
                    distanceRangeMin: distanceMin,
                    distanceRangeMax: distanceMax,
                    priceRangeMin: priceMin,
                    priceRangeMax: priceMax,
                    ratingRangeMin: ratingMin,
                    ratingRangeMax: ratingMax,
                    dateRangeMin: dateMin,
                    dateRangeMax: dateMax
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
        this.getUserPreference = async (userID) => {
            try {
                const { err, result } = await this.baseFindOne({ where: { userID }, rejectOnEmpty: true });
                return { err, result };
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in getUserPreference");
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
                const userBookRatingModels = new bookModel_1.UserBookRatingModels();
                const { err, result: user } = await this.baseCreate(userDetails);
                // creates a prefrance for the user with default values
                const bookPrefResult = await bookPreference.createRandomBookPreference(user.id);
                const userPrefResult = await userPreference.createRandomUserPreference(user.id);
                const userBookRatingResult = await userBookRatingModels.genRatingForAllBooks(user);
                // need to create rating for each book
                return { err, result: user };
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in createUser");
            }
        };
        this.createRandomUser = async () => {
            try {
                const { lat, lng } = (0, locationUtils_1.generateRandomLatLng)(10);
                const userDetails = {
                    firstName: crypto_1.default.randomBytes(10).toString('hex'),
                    lastName: crypto_1.default.randomBytes(10).toString('hex'),
                    userEmail: crypto_1.default.randomBytes(20).toString('hex') + "@test.com",
                    password: "password",
                    birthDate: (0, random_1.randomDate)(new Date(1920, 1, 1), new Date(2004, 1, 1)),
                    sex: (0, random_1.randomNumber)(0, 1) === 0 ? false : true,
                    lat: lat,
                    lng: lng
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
        this.updateUser = async (newUserDetails, userID) => {
            try {
                await this.baseUpdate(newUserDetails, { where: { id: userID } });
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in updateUser");
            }
        };
        this.getUserPref = async (userID) => {
            try {
                const userPrefModel = new UserPreferenceModel();
                const { err, result } = await userPrefModel.getUserPreference(userID);
                return { err, result };
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in getUserPref");
            }
        };
        this.getUserBookPref = async (userID) => {
            try {
                const bookPrefModel = new bookModel_1.BookPreferenceModel();
                const { err, result } = await bookPrefModel.getBookPreference(userID);
                return { err, result };
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in getUserBookPref");
            }
        };
    }
}
exports.UserModel = UserModel;
