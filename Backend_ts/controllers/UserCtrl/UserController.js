"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContoller = void 0;
const bookModel_1 = require("../../models/typesOfModels/Items/BookModels/bookModel");
const userModels_1 = require("../../models/typesOfModels/Users/userModels");
const bookModel_2 = require("../../models/typesOfModels/Items/BookModels/bookModel");
const GenreModels_1 = require("../../models/typesOfModels/Items/BookModels/GenreModels/GenreModels");
const FormatModel_1 = require("../../models/typesOfModels/Items/BookModels/FormatModels/FormatModel");
class UserContoller {
    constructor() {
        // Common Models for all functions
        this.bookModel = new bookModel_1.BookItemModel();
        this.userModel = new userModels_1.UserModel();
        this.genreModel = new GenreModels_1.GenreModel();
        this.formatModel = new FormatModel_1.FormatModel();
        this.authorModel = new FormatModel_1.FormatModel();
        this.userPreferenceModel = new userModels_1.UserPreferenceModel();
        this.bookPreferenceModel = new bookModel_2.BookPreferenceModel();
        /**
         * Get all books in the location space of the user
         *
         * @param req maxDistance
         * @param res
         * @param next
         * @returns
         */
        this.getAllUserDetails = async () => {
            var _a;
            try {
                // get from auth token
                const userID = 4;
                const user = await this.userModel.baseFindOneNotTyped({ where: { id: userID }, include: ['userPreference', 'bookPreference'], raw: true, rejectOnEmpty: true });
                console.log(user);
                const genrePref = await this.genreModel.getAttributeNameFromIDs(user['bookPreference.genrePreference']);
                console.log("genrePref", genrePref);
                const authorPref = await this.authorModel.getAttributeNameFromIDs(user['bookPreference.authorPreference']);
                const formatPref = await this.formatModel.getAttributeNameFromIDs(user['bookPreference.formatPreference']);
                const processedUser = {
                    id: (_a = user.id) !== null && _a !== void 0 ? _a : -1,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userEmail: user.userEmail,
                    lat: user.lat,
                    lng: user.lng,
                    sex: user.sex,
                    birthDate: user.birthDate,
                    distanceRangeMin: user['userPreference.distanceRangeMin'],
                    distanceRangeMax: user['userPreference.distanceRangeMax'],
                    priceRangeMin: user['userPreference.priceRangeMin'],
                    priceRangeMax: user['userPreference.priceRangeMax'],
                    ratingRangeMin: user['userPreference.ratingRangeMin'],
                    ratingRangeMax: user['userPreference.ratingRangeMax'],
                    dateRangeMin: user['userPreference.dateRangeMin'],
                    dateRangeMax: user['userPreference.dateRangeMax'],
                    createdAt: user.createdAt,
                    authorPreference: authorPref,
                    genrePreference: genrePref,
                    formatPreference: formatPref,
                    publicationRangeMin: user['bookPreference.publicationRangeMin'],
                    publicationRangeMax: user['bookPreference.publicationRangeMax'],
                    bookLengthRangeMin: user['bookPreference.bookLengthRangeMin'],
                    bookLengthRangeMax: user['bookPreference.bookLengthRangeMax'],
                    password: user.password
                };
                return processedUser;
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in getting user details");
            }
        };
        this.changeUserDetails = async (UserDetails) => {
            try {
                const userID = 4;
                const newUserDetails = {
                    firstName: UserDetails.firstName,
                    lastName: UserDetails.lastName,
                    userEmail: UserDetails.userEmail,
                    lat: UserDetails.lat,
                    lng: UserDetails.lng,
                    birthDate: UserDetails.birthDate,
                    sex: true,
                    password: UserDetails.password,
                };
                const newUserPreference = {
                    distanceRangeMin: UserDetails.distanceRangeMin,
                    distanceRangeMax: UserDetails.distanceRangeMax,
                    priceRangeMin: UserDetails.priceRangeMin,
                    priceRangeMax: UserDetails.priceRangeMax,
                    ratingRangeMin: UserDetails.ratingRangeMin,
                    ratingRangeMax: UserDetails.ratingRangeMax,
                    dateRangeMin: UserDetails.dateRangeMin,
                    dateRangeMax: UserDetails.dateRangeMax,
                };
                const newBookPreference = {
                    // authorPreference: UserDetails.authorPreference,
                    // genrePreference: UserDetails.genrePreference,
                    // formatPreference: UserDetails.formatPreference,
                    publicationRangeMin: UserDetails.publicationRangeMin,
                    publicationRangeMax: UserDetails.publicationRangeMax,
                    bookLengthRangeMin: UserDetails.bookLengthRangeMin,
                    bookLengthRangeMax: UserDetails.bookLengthRangeMax,
                };
                const { err, result: user } = await this.userModel.find({ where: { id: userID }, rejectOnEmpty: true });
                const { err: err1, result: userPreference } = await this.userPreferenceModel.find({ where: { userID: userID }, rejectOnEmpty: true });
                const { err: err2, result: bookPreference } = await this.bookPreferenceModel.find({ where: { userID: userID }, rejectOnEmpty: true });
                await user.update(newUserDetails);
                await userPreference.update(newUserPreference);
                await bookPreference.update(newBookPreference);
                return;
            }
            catch (err) {
                console.log(err);
            }
        };
        this.deleteUserDetails = async (req, res, next) => {
            try {
                const userID = 4;
                const { err, result: user } = await this.userModel.find({ where: { id: userID }, rejectOnEmpty: true });
                await user.destroy(); // should have cascade effect
                // const {err:err1,result:userPreference} = await this.userPreferenceModel.find({ where: { userID: userID }, rejectOnEmpty: true })
                // await userPreference.destroy()
                // const {err:err2,result:bookPreference} = await this.bookPreferenceModel.find({ where: { userID: userID }, rejectOnEmpty: true })
                // await bookPreference.destroy()
            }
            catch (err) {
                console.error(err);
                throw new Error("Error in deleting user details");
            }
        };
    }
}
exports.UserContoller = UserContoller;
