"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBookRatingModels = exports.BookPreferenceModel = exports.BookItemModel = void 0;
const CSVtoSQL_1 = require("../../../DB_Functions/Process/CSVtoSQL");
const customError_1 = require("../../../../utils/other/customError");
const baseModel_1 = require("../../baseModel");
const modelSetUp_1 = require("../../../DB_Functions/Set_Up/modelSetUp");
const userBookRatingFormula_1 = require("../../../DB_Functions/Process/userBookRatingFormula");
const AuthorModels_1 = require("./AuthorModels/AuthorModels");
const FormatModel_1 = require("./FormatModels/FormatModel");
const GenreModels_1 = require("./GenreModels/GenreModels");
const random_1 = require("../../../../utils/other/random");
const locationUtils_1 = require("../../../../utils/locationUtils");
class BookItemModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.BookItem);
    }
    async getFullBookDetailsForBookID(bookID, options) {
        try {
            const genreModel = new GenreModels_1.GenreModel();
            const formatModel = new FormatModel_1.FormatModel();
            const authorModel = new AuthorModels_1.AuthorModel();
            let fullBookDeails = await this.baseFindOneNotTyped({
                where: { id: bookID },
                include: [modelSetUp_1.BookAuthor, modelSetUp_1.BookFormat, modelSetUp_1.BookGenre],
                rejectOnEmpty: true
            });
            if (!fullBookDeails) {
                throw new customError_1.NotFoundError("Book not found");
            }
            const genresID = fullBookDeails.BookGenres.map((genre) => genre.genreID);
            const formatsID = fullBookDeails.BookFormats.map((format) => format.formatID);
            const authorsID = fullBookDeails.BookAuthors.map((author) => author.authorID);
            console.log(genresID);
            const genreNames = await genreModel.getAttributeNameFromIDs(genresID);
            const formatNames = await formatModel.getAttributeNameFromIDs(formatsID);
            const authorNames = await authorModel.getAttributeNameFromIDs(authorsID);
            fullBookDeails.genres = genreNames;
            fullBookDeails.format = formatNames;
            const fullBook = {
                id: fullBookDeails.id,
                book: fullBookDeails.book,
                author: authorNames[0],
                series: fullBookDeails.series,
                description: fullBookDeails.description,
                numPages: fullBookDeails.numPages,
                publication: fullBookDeails.publication,
                rating: fullBookDeails.rating,
                numOfVoters: fullBookDeails.numOfVoters,
                genres: genreNames,
                format: formatNames,
            };
            fullBookDeails.BookAuthors = [];
            fullBookDeails.BookGenres = [];
            fullBookDeails.BookFormats = [];
            //fullBookDeails.genres = await Promise.all(namedGenres);
            return fullBook;
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("getFullBookDetailsForBookID()" + err);
        }
    }
    async findAllBooksForIDs(bookIDs) {
        try {
            let books = [];
            for (let id in bookIDs) {
                const { err, result: book } = await this.baseFindOne({ where: { id }, rejectOnEmpty: false });
                if (!book) {
                    throw new customError_1.NotFoundError("Book not found");
                }
                books.push(book);
            }
            return books;
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("findAllBooksForIDs()" + err);
        }
    }
    async fullTextSearch(minRating, maxPrice, searchQuery) {
        try {
            const query = `SELECT 
            bk.id AS bookID, 
            bk.series, 
            bk.description, 
            bk.numPages, 
            bk.publication, 
            bk.rating AS preRating, 
            ui.price, 
            usr.lat, 
            usr.lng, 
            usr.id AS ownerID
          FROM 
            BookItems bk
          JOIN 
            UserItems ui ON bk.id = ui.ItemID
          JOIN 
            Users usr ON ui.OwnerID = usr.id
          WHERE 
            MATCH(bk.book, bk.description) AGAINST('${searchQuery}' IN NATURAL LANGUAGE MODE)
            AND bk.rating >= ${minRating}
            AND ui.price <= ${maxPrice}
          ORDER BY 
            bk.rating DESC, 
            ui.price ASC;`;
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
    async findAllBooksWithinRadiusAndSearchQuery(options) {
        try {
            let rankedBooks = [];
            const { locationOfUser, maxDistance, searchQuery, minRating, maxPrice } = options;
            const booksWithoutRadius = await this.fullTextSearch(minRating, maxPrice, searchQuery);
            const booksWithinRadius = booksWithoutRadius.filter(book => {
                (0, locationUtils_1.calculateDistance)(locationOfUser.lat, locationOfUser.lng, book.lat, book.lng)
                    <= maxDistance;
            });
            // SEND TO PYTHON FOR RANKING.
            rankedBooks = await this.pyRankBooks(booksWithinRadius);
            return rankedBooks;
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("findAllBooksWithinRadius()" + err);
        }
    }
    async getAllAuthorsForBookID(bookID) {
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
    async getAllGenresForBookID(bookID) {
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
                // cycle // lets do the same for UserItems
                const createRatingFunc = async (eachBook) => {
                    const book = eachBook.dataValues;
                    const userRating = await bookFormula.createUserRating(book);
                    const userBookRating = { userID: user.id, bookID: book.id, rating: userRating };
                    const { err, result } = await this.createUserRating(userBookRating);
                };
                const waiting = await bookModel.performOnAllRows(createRatingFunc);
                //let min, max;
                //const normaliseRating = async (eachRating: UserBookRating) => {
                //    const rating = eachRating.dataValues;
                //    min = await userRatingModel.getMinRating(rating.userID);
                //    max = await userRatingModel.getMaxRating(rating.userID);
                //    rating.rating = bookFormula.normaliseRating(rating.rating, min, max);
                //    await this.updateUserRating(rating, rating.userID, rating.bookID);
                //}
                //await userRatingModel.performOnAllRows(normaliseRating)
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
    async getUserRating(userID, bookID) {
        try {
            const { err, result } = await this.baseFindOne({ where: { userID, bookID }, rejectOnEmpty: true });
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new Error("Error in getUserRating");
        }
    }
    async updateUserRating(userRating, userID, bookID) {
        try {
            await this.baseUpdate(userRating, { where: { userID, bookID } });
        }
        catch (err) {
            console.log(err);
            throw new Error("Error in updateUserRating");
        }
    }
    async deleteUserRating(userID, bookID) {
        try {
            await this.baseDestroy({ where: { userID, bookID } });
        }
        catch (err) {
            console.log(err);
            throw new Error("Error in deleteUserRating");
        }
    }
    // public async normaliseAllRatings = async (userID: number): Promise<void> => {
    //     const bookModel = new BookItemModel()
    //     const userRatingModel = new UserBookRatingModels();
    //     let min, max ;
    //     const normaliseRating = async (eachRating: UserBookRating) => {
    //         const rating = eachRating.dataValues;
    //         min = await userRatingModel.getMinRating(rating.userID);
    //         max = await userRatingModel.getMaxRating(rating.userID);
    //         rating.rating = bookFormula.normaliseRating(rating.rating, min, max);
    //         await this.updateUserRating(rating, rating.userID, rating.bookID);
    //     }
    //     await userRatingModel.performOnAllRows(normaliseRating)
    // }
    /**
     * Gets the max rating for a whole table or for a specific user and or book
     *
     * @param userID
     * @param bookID
     * @returns
     */
    async getMaxRating(userID) {
        try {
            const options = userID ? { where: { userID } } : {};
            const result = await this.model.max("rating", options);
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
    async getMinRating(userID) {
        try {
            let found = false;
            let result = null;
            do {
                const options = userID ? { where: { userID } } : {};
                result = await this.model.min("rating", options);
                console.log("result: ", result);
                if (result === null) {
                    console.log(userID);
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
