"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
const pyAPI_1 = __importDefault(require("../../../../API/pyAPI"));
class BookItemModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.BookItem);
    }
    async getFullBookDetailsForBookID(bookID, options) {
        try {
            const [result, metadata] = await this.model.sequelize.query(`	SELECT 
            b.id AS book_id,
            b.series,
            b.book,
            b.description,
            b.numPages,
            b.publication,
            b.rating,
            b.numOfVoters,
            GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') AS authors,
            GROUP_CONCAT(DISTINCT f.name SEPARATOR ', ') AS formats,
            GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres
        FROM 
            BookItems b
        LEFT JOIN BookAuthors ba ON b.id = ba.bookId
        LEFT JOIN Authors a ON ba.authorId = a.id
        LEFT JOIN BookFormats bf ON b.id = bf.bookId
        LEFT JOIN Formats f ON bf.formatId = f.id
        LEFT JOIN BookGenres bg ON b.id = bg.bookId
        LEFT JOIN Genres g ON bg.genreId = g.id
        WHERE b.id = ${bookID}`);
            const fullBook = result[0];
            return fullBook;
        }
        catch (err) {
            console.log(err);
            if (err instanceof customError_1.NotFoundError) {
                throw err;
            }
            throw new customError_1.DatabaseError("getFullBookDetailsForBookID()" + err.message);
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
            console.log("searchQuery: ", searchQuery);
            let search = searchQuery !== undefined ? `MATCH(bk.book, bk.description) AGAINST('${searchQuery}' IN NATURAL LANGUAGE MODE) AND ` : "";
            //= searchQuery.length !== 0 ? `MATCH(bk.book, bk.description) AGAINST('${searchQuery}' IN NATURAL LANGUAGE MODE) AND ` : "";
            // why does the query have so many types
            const query = `SELECT 
            bk.id AS bookID, 
            bk.series, 
            bk.book,
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
            ${search} bk.rating >= ${minRating}
            AND ui.price <= ${maxPrice}
          ORDER BY 
            bk.rating DESC, 
            ui.price ASC
            LIMIT 50;`;
            const [result, metadata] = await this.model.sequelize.query(query); // maybe wrong, we need sequelize instance
            // const books: ProductPreviewType[] = result[0].map((book: any) => {
            //     return {
            //         itemID: book.bookID,
            //         book: book.book,
            //         series: book.series,
            //         description: book.description,
            //         numPages: book.numPages,
            //         publication: book.publication,
            //         rating: book.preRating,
            //         price: book.price,
            //         lat: book.lat,
            //         lng: book.lng,
            //         ownerID: book.ownerID
            //     }
            // });
            const books = result.map((book) => {
                return {
                    itemID: book.bookID,
                    book: book.book,
                    ranking_of_book: book.preRating,
                    lat: book.lat,
                    lng: book.lng,
                    ownerID: book.ownerID
                };
            });
            return books; // no rating
        }
        catch (err) {
            console.error(err);
            throw new customError_1.DatabaseError("fullTextSearch()" + err.message);
        }
    }
    async getRankedBooksWithinRadiusAndSearchQuery(options) {
        try {
            let rankedBooks = [];
            const { lat, lng, maxDistance, searchQuery, minRating, maxPrice, userID, userSex } = options;
            const books = await this.fullTextSearch(minRating, maxPrice, (searchQuery ? searchQuery : undefined));
            const booksWithinRadius = books.filter(book => {
                return (0, locationUtils_1.calculateDistance)(lat, lng, book.lat, book.lng)
                    <= maxDistance;
            });
            let bookIDsNumber = booksWithinRadius.map(book => book.itemID);
            const bookTitles = booksWithinRadius.map(book => book.book);
            const bookIDsStr = bookIDsNumber.map(id => id.toString());
            if (bookIDsStr.length === 0) {
                return [];
            }
            //SEND TO PYTHON FOR RANKING.
            const rankings = await (0, pyAPI_1.default)(userID, userSex, bookIDsNumber, bookTitles);
            const booksWithinRandRanked = booksWithinRadius.map((book, index) => {
                return Object.assign(Object.assign({}, book), { ranking_we_think: parseFloat(rankings[index]) });
            });
            return booksWithinRandRanked;
        }
        catch (err) {
            if (err instanceof customError_1.NotFoundError) {
                console.error(err);
                throw err;
            }
            else if (err instanceof customError_1.DatabaseError) {
                console.error(err);
                throw err;
            }
            else {
                console.error(err);
                throw new Error("getRankedBooksWithinRadiusAndSearchQuery()" + err.message);
            }
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
            book.publication = undefined;
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
