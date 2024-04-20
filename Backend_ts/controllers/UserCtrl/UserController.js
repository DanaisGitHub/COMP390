"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContoller = void 0;
const userModels_1 = require("../../models/typesOfModels/Users/userModels");
const GenreModels_1 = require("../../models/typesOfModels/Items/BookModels/GenreModels/GenreModels");
const FormatModel_1 = require("../../models/typesOfModels/Items/BookModels/FormatModels/FormatModel");
const customError_1 = require("../../utils/other/customError");
const baseController_1 = require("../_baseController/baseController");
class UserContoller extends baseController_1.BaseController {
    constructor() {
        super(...arguments);
        // Common Models for all functions
        this.userModel = new userModels_1.UserModel();
        this.genreModel = new GenreModels_1.GenreModel();
        this.formatModel = new FormatModel_1.FormatModel();
        this.authorModel = new FormatModel_1.FormatModel();
        /**
         * Get all books in the location space of the user
         *
         * @param req maxDistance
         * @param res
         * @param next
         * @returns
         */
        this.getAllUserDetails = async (userID) => {
            var _a;
            try {
                // get from auth token
                const rawUser = await this.userModel.baseFindOneNotTyped({
                    where: { id: userID }, include: ['userPreference', 'bookPreference'], rejectOnEmpty: false
                });
                const user = rawUser.dataValues;
                console.log(user.bookPreference.dataValues.genrePreference);
                const genrePref = await this.genreModel.getAttributeNameFromIDs(user.bookPreference.dataValues.genrePreference);
                const authorPref = await this.authorModel.getAttributeNameFromIDs(user.bookPreference.dataValues.authorPreference);
                const formatPref = await this.formatModel.getAttributeNameFromIDs(user.bookPreference.dataValues.formatPreference);
                const processedUser = {
                    id: (_a = user.id) !== null && _a !== void 0 ? _a : -1,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userEmail: user.userEmail,
                    lat: user.lat,
                    lng: user.lng,
                    sex: user.sex,
                    birthDate: user.birthDate,
                    distanceRangeMin: user.userPreference.dataValues.distanceRangeMin,
                    distanceRangeMax: user.userPreference.dataValues.distanceRangeMax,
                    priceRangeMin: user.userPreference.dataValues.priceRangeMin,
                    priceRangeMax: user.userPreference.dataValues.priceRangeMax,
                    ratingRangeMin: user.userPreference.dataValues.ratingRangeMin,
                    ratingRangeMax: user.userPreference.dataValues.ratingRangeMax,
                    dateRangeMin: user.userPreference.dataValues.dateRangeMin,
                    dateRangeMax: user.userPreference.dataValues.dateRangeMax,
                    createdAt: user.createdAt,
                    authorPreference: authorPref,
                    genrePreference: genrePref,
                    formatPreference: formatPref,
                    publicationRangeMin: user.bookPreference.dataValues.publicationRangeMin,
                    publicationRangeMax: user.bookPreference.dataValues.publicationRangeMax,
                    bookLengthRangeMin: user.bookPreference.dataValues.bookLengthRangeMin,
                    bookLengthRangeMax: user.bookPreference.dataValues.bookLengthRangeMax,
                    password: user.password
                };
                console.log(processedUser);
                return processedUser;
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in getting user details");
            }
        };
        this.getBasicUserDetails = async (id) => {
            const { err, result: user } = await this.userModel.find({ where: { id }, rejectOnEmpty: true });
            const basicUser = {
                firstName: user.firstName,
                lastName: user.lastName,
                userEmail: user.userEmail,
                lat: user.lat,
                lng: user.lng
            };
            return basicUser;
        };
        this.changeUserDetails = async (UserDetails) => {
            try {
                await this.userModel.update(UserDetails, { where: { id: UserDetails.id } });
            }
            catch (err) {
                console.error(err);
                if (err instanceof customError_1.NotFoundError) {
                    throw err;
                }
                else {
                    throw new Error("Error in changing user details " + err.message);
                }
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
