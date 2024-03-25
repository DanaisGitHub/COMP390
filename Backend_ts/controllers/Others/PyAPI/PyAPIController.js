"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userModels_1 = require("../../../models/typesOfModels/Users/userModels");
const bookModel_1 = require("../../../models/typesOfModels/Items/BookModels/bookModel");
class PyAPIController {
    constructor() {
        this.getAllUserData = async (req, res, next) => {
            try {
                let pyUsers = [];
                const userModel = new userModels_1.UserModel();
                const bookPreferenceModel = new bookModel_1.BookPreferenceModel();
                const { err, result: users } = await userModel.getAll();
                if (err)
                    throw new Error(err);
                console.log(users);
                for (let user of users) {
                    let { err, result: bookPref } = await bookPreferenceModel.getBookPreference(user.id);
                    let pyUser = {
                        id: user.id,
                        birthDate: user.birthDate,
                        bookPreference: bookPref
                    };
                    pyUsers.push(pyUser);
                }
                return pyUsers;
            }
            catch (err) {
                throw new Error(err);
            }
        };
        this.getAllBookData = async (req, res, next) => {
            try {
            }
            catch (err) {
            }
        };
    }
}
exports.default = PyAPIController;
