"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBookRatingModels = exports.BookPreferenceModel = exports.BookItemModel = void 0;
const CSVtoSQL_1 = require("../../../DB_Functions/Process/CSVtoSQL");
const customError_1 = require("../../../../utils/other/customError");
const baseModel_1 = require("../../baseModel");
const modelSetUp_1 = require("../../../DB_Functions/Set_Up/modelSetUp");
const userBookRatingFormula_1 = require("../../../DB_Functions/Process/userBookRatingFormula");
const userModels_1 = require("../../Users/userModels");
const AuthorModels_1 = require("./AuthorModels/AuthorModels");
const FormatModel_1 = require("./FormatModels/FormatModel");
const GenreModels_1 = require("./GenreModels/GenreModels");
const random_1 = require("../../../../utils/other/random");
const locationUtils_1 = require("../../../../utils/locationUtils");
class BookItemModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.BookItem);
    }
    // public async getFullBookDetailsForBookId(bookID: number): Promise<StdReturn<BookItem>> {
    //     try {
    //         const { err, result:bookBasicDetails } = await this.baseFindOne({ where: { id: bookID }, rejectOnEmpty: true }); // we didn't do assossiations properly here
    //         bookBasicDetails.;
    //         const fullBookDetails = {
    //             id:,
    //             book_title: ,
    //             series:,
    //             description:,
    //             numPages:,
    //             publication:,
    //             preRating:,
    //             author:,
    //             genres:,
    //             format:,
    //         }
    //         return { err, result }
    //     }
    //     catch (err) {
    //         console.log(err)
    //         throw new DatabaseError("getAllBookDetailsForBookId()" + err);
    //     }
    // }
    async fullTextSearch(searchQuery) {
        try {
            const query = `SELECT * FROM bookitems WHERE MATCH(title, description) 
            AGAINST('${searchQuery}' IN NATURAL LANGUAGE MODE);`;
            const result = await this.model.sequelize.query(query); // maybe wrong, we need sequelize instance
            return result[0];
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("fullTextSearch()" + err);
        }
    }
    async pyRankBooks(books) {
        // send to python for ranking
        return [];
    }
    async findAllBooksWithinRadiusAndSearchQuery(location, maxDistance, searchQuery) {
        try {
            const userModel = new userModels_1.UserModel();
            const serchedBooks = await this.fullTextSearch(searchQuery);
            const booksWithinRadius = serchedBooks.filter(async (book) => {
                // find out who owns the book
                const { err, result: user } = await userModel.findByPkey(book.ownerId);
                const bookLat = user.dataValues.lat;
                const bookLong = user.dataValues.lng;
                const distance = (0, locationUtils_1.calculateDistance)(location.lat, location.lng, bookLat, bookLong);
                return distance <= maxDistance;
            });
            // now send to python for ranking
            const rankedBooks = await this.pyRankBooks(booksWithinRadius);
            return rankedBooks;
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("findAllBooksWithinRadius()" + err);
        }
    }
    async getAllAuthorsForBookId(bookID) {
        try {
            const bookAuthorTable = new AuthorModels_1.BookAuthorModel();
            const { err, result } = await bookAuthorTable.getAllBookAttributesForSpecficBook(bookID);
            if (err) {
                throw new customError_1.DatabaseError("getBookAuthors()" + err);
            }
            return { err, result: result.map((author) => author) };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("getBookAuthors()" + err);
        }
    }
    async getAllGenresForBookId(bookID) {
        try {
            const bookGenreTable = new GenreModels_1.BookGenreModel();
            const { err, result } = await bookGenreTable.getAllBookAttributesForSpecficBook(bookID);
            if (err) {
                throw new customError_1.DatabaseError("getBookGenres()" + err);
            }
            return { err, result: result.map((genre) => genre) };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("getBookGenres()" + err);
        }
    }
    async addBookItem(book) {
        try {
            const { err, result } = await this.baseCreate(book);
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("addBookItem()" + err);
        }
    }
    async addAllBookItems() {
        try {
            await CSVtoSQL_1.CSVtoSQLBook.run();
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("addBookItem()" + err);
        }
    }
}
exports.BookItemModel = BookItemModel;
class BookPreferenceModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.BookPreference);
        this.updateBookPreference = async (newBookPreference, userID) => {
            try {
                await this.baseUpdate(newBookPreference, { where: { userID } });
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in updateBookPreference" + err);
            }
        };
        this.createRandomBookPreference = async (userID) => {
            try {
                let authorPreference = new Set();
                let genrePreference = new Set();
                let formatPreference = new Set();
                const authorUpper = await new AuthorModels_1.AuthorModel().count({});
                const genreUpper = await new GenreModels_1.GenreModel().count({});
                const formatUpper = await new FormatModel_1.FormatModel().count({});
                const attributeArray = [authorUpper, genreUpper, formatUpper];
                const prefArray = [authorPreference, genrePreference, formatPreference];
                // random loop
                let numOfPref, dbUpperBound, i, j;
                for (i = 0; i < 3; i++) {
                    numOfPref = Math.random() * attributeArray[i]; // upto 10 random preferences
                    for (j = 0; j < numOfPref; j++) {
                        dbUpperBound = attributeArray[i] - 1;
                        prefArray[i].add((Math.floor(Math.random() * dbUpperBound)) + 1);
                    }
                }
                // random assignment // need upbound for assignment
                const { min: ranPublicationMin, max: ranPublicationMax } = (0, random_1.randomDateRange)(new Date(1920, 1, 1), new Date());
                const { min: ranlengthMin, max: ranlengthMax } = (0, random_1.randomRange)(0, 5000, false);
                const bookPreference = {
                    userID,
                    authorPreference: Array.from(authorPreference),
                    genrePreference: Array.from(genrePreference),
                    formatPreference: Array.from(formatPreference),
                    publicationRangeMin: ranPublicationMin,
                    publicationRangeMax: ranPublicationMax,
                    bookLengthRangeMin: ranlengthMin,
                    bookLengthRangeMax: ranlengthMax
                };
                await this.createBookPreference(bookPreference);
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in createRandomBookPreference");
            }
        };
        this.getBookPreference = async (userID) => {
            try {
                const { err, result } = await this.baseFindOne({ where: { userID }, rejectOnEmpty: true });
                return { err, result };
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in getBookPreference");
            }
        };
    }
    async createEmptyBookPreference(userID) {
        try {
            const newBookPreference = { userID };
            const { err, result } = await this.baseCreate(newBookPreference);
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("addBookPreference()" + err);
        }
    }
    async createBookPreference(bookPref) {
        try {
            const newBookPreference = bookPref;
            const { err, result } = await this.baseCreate(newBookPreference);
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("addBookPreference()" + err);
        }
    }
}
exports.BookPreferenceModel = BookPreferenceModel;
class UserBookRatingModels extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.UserBookRating);
        /**
         * NEEDS TESTING
         *
         * @param user
         */
        this.genRatingForAllBooks = async (user) => {
            try {
                const bookModel = new BookItemModel();
                const bookFormula = new userBookRatingFormula_1.CreateUserBookRatingFormula(user);
                const userRatingModel = new UserBookRatingModels();
                // cycle 
                const createRatingFunc = async (eachBook) => {
                    const book = eachBook.dataValues;
                    const userRating = await bookFormula.createUserRating(book);
                    const userBookRating = { userId: user.id, bookId: book.id, rating: userRating };
                    const { err, result } = await this.createUserRating(userBookRating);
                };
                // cycle Books
                const waiting = await bookModel.performOnAllRows(createRatingFunc);
                let min = await userRatingModel.getMinRating(user.id);
                let max = await userRatingModel.getMaxRating(user.id);
                const normaliseRating = async (eachRating) => {
                    const rating = eachRating.dataValues;
                    let min = await userRatingModel.getMinRating(rating.userId);
                    let max = await userRatingModel.getMaxRating(rating.userId);
                    rating.rating = bookFormula.normaliseRating(rating.rating, min, max);
                    await this.updateUserRating(rating, rating.userId, rating.bookId);
                };
                await userRatingModel.performOnAllRows(normaliseRating);
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in createOneRating");
            }
        };
    }
    async createUserRating(userRating) {
        try {
            const { err, result } = await this.baseCreate(userRating);
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new Error("Error in createUserRating");
        }
    }
    async getUserRating(userId, bookId) {
        try {
            const { err, result } = await this.baseFindOne({ where: { userId, bookId }, rejectOnEmpty: true });
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new Error("Error in getUserRating");
        }
    }
    async updateUserRating(userRating, userId, bookId) {
        try {
            await this.baseUpdate(userRating, { where: { userId, bookId } });
        }
        catch (err) {
            console.log(err);
            throw new Error("Error in updateUserRating");
        }
    }
    async deleteUserRating(userId, bookId) {
        try {
            await this.baseDestroy({ where: { userId, bookId } });
        }
        catch (err) {
            console.log(err);
            throw new Error("Error in deleteUserRating");
        }
    }
    /**
     * Gets the max rating for a whole table or for a specific user and or book
     *
     * @param userId
     * @param bookId
     * @returns
     */
    async getMaxRating(userId) {
        try {
            const result = await this.model.max("rating", { where: { userId } });
            //const some = await this.model.sync();
            if (result === null) {
                throw new customError_1.NotFoundError("No max value found");
            }
            return result;
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("getMaxValue()" + err);
        }
    }
    async getMinRating(userId) {
        try {
            let found = false;
            let result = null;
            do {
                result = await this.model.min("rating", { where: { userId } });
                console.log("result: ", result);
                if (result === null) {
                    console.log(userId);
                    continue;
                }
                found = true;
            } while (found === false);
            return result;
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("getMinValue()" + err);
        }
    }
}
exports.UserBookRatingModels = UserBookRatingModels;
