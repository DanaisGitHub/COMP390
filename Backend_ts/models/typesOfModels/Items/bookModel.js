"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookPreferenceModel = exports.AuthorModel = exports.FormatModel = exports.GenreModel = exports.BookGenreModel = exports.BookFormatModel = exports.BookAuthorModel = exports.BookItemModel = void 0;
const CSVtoSQL_1 = require("../../DB_Functions/Process/CSVtoSQL");
const customError_1 = require("../../../utils/customError");
const baseModel_1 = require("../baseModel");
const modelSetUp_1 = require("../../DB_Functions/Set_Up/modelSetUp");
const crypto_1 = __importDefault(require("crypto"));
const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
class BookItemModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.BookItem);
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
class BookAuthorModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.BookAuthor);
    }
    async addBookAuthorLink(bookName, authorName) {
        try {
            const authorTable = new AuthorModel();
            const bookTable = new BookItemModel();
            await this.baseBookLink(bookName, authorName, authorTable, bookTable);
        }
        catch (err) {
            throw new customError_1.DatabaseError("addBookAuthorLink() FUNC ERROR " + err);
        }
    }
}
exports.BookAuthorModel = BookAuthorModel;
class BookFormatModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.BookFormat);
    }
    async addBookFormatLink(bookName, formatName) {
        try {
            const formatTable = new FormatModel();
            const bookTable = new BookItemModel();
            await this.baseBookLink(bookName, formatName, formatTable, bookTable);
        }
        catch (err) {
            throw new customError_1.DatabaseError("BookFormatModel() FUNC ERROR " + err);
        }
    }
}
exports.BookFormatModel = BookFormatModel;
class BookGenreModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.BookGenre);
    }
    async addBookGenreLink(bookName, genreName) {
        try {
            const genreTable = new GenreModel();
            const bookTable = new BookItemModel();
            await this.baseBookLink(bookName, genreName, genreTable, bookTable);
        }
        catch (err) {
            throw new customError_1.DatabaseError("BookGenreModel() FUNC ERROR " + err);
        }
    }
}
exports.BookGenreModel = BookGenreModel;
class GenreModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.Genre);
    }
    async addGenre(genreName) {
        try {
            const { err, result } = await this.baseCreate({ name: genreName });
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("addGenre()" + err);
        }
    }
}
exports.GenreModel = GenreModel;
class FormatModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.Format);
    }
    async addFormat(formatName) {
        try {
            const { err, result } = await this.baseCreate({ name: formatName });
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("addFormat()" + err);
        }
    }
}
exports.FormatModel = FormatModel;
class AuthorModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.Author);
    }
    async addAuthor(genreName) {
        try {
            const { err, result } = await this.baseCreate({ name: genreName });
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("addAuthor()" + err);
        }
    }
}
exports.AuthorModel = AuthorModel;
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
                const bookPreference = {
                    userID,
                    authorPreference: [crypto_1.default.randomBytes(20).toString('hex'), crypto_1.default.randomBytes(20).toString('hex')],
                    genrePreference: [crypto_1.default.randomBytes(20).toString('hex'), crypto_1.default.randomBytes(20).toString('hex')],
                    formatPreference: [crypto_1.default.randomBytes(20).toString('hex'), crypto_1.default.randomBytes(20).toString('hex')],
                    publicationRange: { min: randomDate(new Date(1920, 1, 1), new Date(2004, 1, 1)), max: new Date() },
                    bookLengthRange: { min: Math.random() * 100, max: 100 }
                };
                const { err, result } = await this.createBookPreference(bookPreference);
            }
            catch (err) {
                console.log(err);
                throw new Error("Error in createRandomBookPreference");
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
