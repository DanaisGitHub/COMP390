"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserBookRatingFormula2 = exports.CreateUserBookRatingFormula = void 0;
const userModels_1 = require("../../typesOfModels/Users/userModels");
const bookModel_1 = require("../../typesOfModels/Items/BookModels/bookModel");
const GenreModels_1 = require("../../typesOfModels/Items/BookModels/GenreModels/GenreModels");
const FormatModel_1 = require("../../typesOfModels/Items/BookModels/FormatModels/FormatModel");
const AuthorModels_1 = require("../../typesOfModels/Items/BookModels/AuthorModels/AuthorModels");
// TODO: 1) Add userRating Table to db 
// 2) Perform create user rating for each user
// 3) before moving to next user normalise scores
class CreateUserBookRatingFormula {
    constructor(user) {
        this.lowestScore = 40000;
        this.highestScore = -40000;
        this.user = user;
    }
    getLowestScore() {
        return this.lowestScore;
    }
    getHighestScore() {
        return this.highestScore;
    }
    // 1 keep track of non-normalised scores
    // 2 only at then end with last lowest and hightest Score normalise scores
    /**
     * For each book, calulate the user rating
     *
     * @param book the book
     * @returns the user rating
     */
    async createUserRating(book) {
        try {
            let score = 1;
            const userModel = new userModels_1.UserModel();
            const bookModel = new bookModel_1.BookItemModel();
            const genreModel = new GenreModels_1.GenreModel();
            const formatModel = new FormatModel_1.FormatModel();
            const authorModel = new AuthorModels_1.AuthorModel();
            const bookPrefModel = new bookModel_1.BookPreferenceModel();
            const userPrefModel = new userModels_1.UserPreferenceModel();
            // Book Meta-Data
            // book.id = undefined
            //const bookFormatsArrReturn = await bookModel.getBookFormats(book.id!);// book.id = undefined
            //const bookAuthorsArrReturn = await bookModel.getBookAuthors(book.id!);// book.id = undefined
            // get user preference
            const userPrefReturn = await userPrefModel.getUserPreference(this.user.id);
            // get book preference
            const { err: bookPrefErr, result: bookPref } = await bookPrefModel.getBookPreference(this.user.id); // wrong id
            const userFormatsPref = bookPref.formatPreference;
            const userAuthorsPref = bookPref.authorPreference; // TODO: author match using arrs
            if (bookPrefErr) {
                throw new Error("Error in createUserRating");
            }
            const userPref = userPrefReturn.result;
            // Rating Impact
            const randomImpact = Math.random();
            const ratingImpact = Math.log10(book.numOfVoters + 1);
            score += book.rating * ratingImpact * randomImpact;
            // REMEMBER bookPref = bookPreference set by user
            const userBookGenrePrefArr = bookPref.genrePreference; // 
            const { err, result: bookGenresArr } = await bookModel.getAllGenresForBookID(book.id); //just getting the same number/id mutliple times eg [1,1,1,1,1,1,1,1]
            //console.log("bookGenresArrReturn: ", bookGenresArr);
            bookGenresArr.map(async (genrePref) => {
                const { err, result: genre } = await genreModel.find({ where: { id: genrePref }, rejectOnEmpty: true }); // ensures genre exists
                if (userBookGenrePrefArr.includes(genre.id)) {
                    score += 1;
                }
            });
            const userBookAuthorPrefArr = bookPref.authorPreference; //
            const { err: authorErr, result: bookAuthorsArr } = await bookModel.getAllAuthorsForBookID(book.id);
            bookAuthorsArr.map(async (authorPref) => {
                const { err, result: author } = await authorModel.find({ where: { id: authorPref }, rejectOnEmpty: true });
                if (userBookAuthorPrefArr.includes(author.id)) {
                    score += 1;
                }
            });
            if (this.lowestScore === 40000) {
                this.lowestScore = score;
            }
            if (this.highestScore === -40000) {
                this.highestScore = score;
            }
            if (this.lowestScore > score) {
                this.lowestScore = score;
            }
            if (this.highestScore < score) {
                this.highestScore = score;
            }
            if (score === Infinity || score === -Infinity) {
                score = 0;
            }
            return score ? score : 0;
        }
        catch (err) {
            console.log(err);
            throw new Error("Error in createUserRating");
        }
    }
    normaliseRating(x, min, max) {
        console.log("x: ", x);
        console.log("min: ", min);
        console.log("max: ", max);
        const result = ((x - min) / (max - min) * 5).toFixed(2);
        if (result === Infinity || result === -Infinity) {
            return 0;
        }
        return result;
    }
}
exports.CreateUserBookRatingFormula = CreateUserBookRatingFormula;
class CreateUserBookRatingFormula2 {
    normaliseRating(x, min, max) {
        console.log("x: ", x);
        console.log("min: ", min);
        console.log("max: ", max);
        const result = ((x - min) / (max - min) * 5).toFixed(2);
        if (result === Infinity || result === -Infinity) {
            return 0;
        }
        if (result >= 5) {
            return 5;
        }
        if (result <= 0) {
            return 0;
        }
        return result;
    }
}
exports.CreateUserBookRatingFormula2 = CreateUserBookRatingFormula2;
