"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorModel = exports.FormatModel = exports.GenreModel = exports.BookGenreModel = exports.BookFormatModel = exports.BookAuthorModel = exports.BookItemModel = void 0;
const CSVtoSQL_1 = require("../CSVtoSQL");
const customError_1 = require("../../utils/customError");
const baseModel_1 = require("./baseModel");
const modelSetUp_1 = require("../modelSetUp");
class BookItemModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.BookItem);
    }
    async addBooksAndLinks() {
        try {
            const bookItemDetails = await CSVtoSQL_1.CSVtoSQLBook.run();
            const { err, result } = await this.baseCreateMany(bookItemDetails, { returning: true });
            // next functions
            await this.addGenreLink();
            await this.addFormatLink();
            await this.addAuthorLink();
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("addNewBookItem()" + err);
        }
    }
    async addGenreLink() {
        const genreTable = new GenreModel();
        const bookGenreTable = new BookGenreModel();
        // create all genres
        await genreTable.createAllGenres();
        await bookGenreTable.addManyNewBookGenreLinks();
    }
    async addFormatLink() {
        const formatTable = new FormatModel();
        const bookFormatTable = new BookFormatModel();
        // create all formats
        await formatTable.createAllFormats();
        await bookFormatTable.addManyNewBookFormatLinks();
    }
    async addAuthorLink() {
        const authorTable = new AuthorModel();
        const bookAuthorTable = new BookAuthorModel();
        // create all formats
        await authorTable.createAllAuthor();
        await bookAuthorTable.addManyNewBookAuthorLinks();
    }
}
exports.BookItemModel = BookItemModel;
class BookAuthorModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.BookAuthor);
        this.bookAuthorLink = new Map();
    }
    setBookAuthorLink(bookAuthorLink) {
        bookAuthorLink.forEach((value, key) => {
            const linkArray = value.map((name) => {
                return { name };
            });
            this.bookAuthorLink.set(key, linkArray);
        });
    }
    async addManyNewBookAuthorLinks() {
        try {
            this.setBookAuthorLink(CSVtoSQL_1.CSVtoSQLBook.getBookAuthorLink());
            if (this.bookAuthorLink.size == 0) {
                throw new customError_1.DatabaseError("implenentBookAuthorLink() bookAuthorLink is empty");
            }
            for (const [bookName, authors] of this.bookAuthorLink) {
                for (const author of authors) {
                    await this.implenentBookGenreLink(bookName, author);
                }
            }
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("addManyNewBookAuthorLinks()" + err);
        }
    }
    async implenentBookGenreLink(bookName, { id, name }) {
        try {
            const table = new AuthorModel();
            const bookTable = new BookItemModel();
            if (this.bookAuthorLink.has(bookName)) {
                // find book name
                // get book Id
                const bookResult = await bookTable.find({ where: { book: bookName }, rejectOnEmpty: true });
                let bookId = bookResult.result.id;
                if (bookResult.err) {
                    throw new customError_1.DatabaseError("implenentBookAuthorLink() " + bookResult.err);
                }
                // find genre name
                // get genre Id
                const { err, result } = await table.find({ where: { name }, rejectOnEmpty: true });
                if (err) {
                    throw new customError_1.DatabaseError("implenentBookAuthorLink() " + err);
                }
                const authorId = result.id;
                // create new BookGenre
                const newBookAuthor = { bookId, authorId };
                const createBookGenreResult = await this.baseCreate(newBookAuthor);
                if (createBookGenreResult.err) {
                    throw new customError_1.DatabaseError("implenentBookAuthorLink() " + createBookGenreResult.err);
                }
            }
            else {
                throw new customError_1.NotFoundError("implenentBookAuthorLink() " + bookName + " not found in bookAuthorLink");
            }
        }
        catch (err) {
            throw new customError_1.DatabaseError("implenentBookAuthorLink() " + err);
        }
    }
}
exports.BookAuthorModel = BookAuthorModel;
const setLink = (link) => {
    const linkSet = new Map();
    link.forEach((value, key) => {
        const linkArray = value.map((name) => {
            return { name };
        });
        linkSet.set(key, linkArray);
    });
    return linkSet;
};
class BookFormatModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.BookFormat);
        this.bookFormatLink = new Map(); // book name, genre[]
    }
    setBookFormatLink(bookFormatLink) {
        this.bookFormatLink = setLink(bookFormatLink);
    }
    async addManyNewBookFormatLinks() {
        try {
            this.setBookFormatLink(CSVtoSQL_1.CSVtoSQLBook.getBookFormatLink());
            if (this.bookFormatLink.size == 0) {
                throw new customError_1.DatabaseError("implenentBookFormatLink() bookFormatLink is empty");
            }
            for (const [bookName, genres] of this.bookFormatLink) {
                for (const genre of genres) {
                    await this.implenentBookFormatLink(bookName, genre);
                }
            }
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("addManyNewBookFormatLinks()" + err);
        }
    }
    async implenentBookFormatLink(bookName, { id, name }) {
        try {
            const table = new FormatModel();
            const bookTable = new BookItemModel();
            if (this.bookFormatLink.has(bookName)) {
                // find book name
                // get book Id
                const bookResult = await bookTable.find({ where: { book: bookName }, rejectOnEmpty: true });
                let bookId = bookResult.result.id;
                if (bookResult.err) {
                    throw new customError_1.DatabaseError("implenentBookFormatLink() " + bookResult.err);
                }
                // find genre name
                // get genre Id
                const { err, result } = await table.find({ where: { name }, rejectOnEmpty: true });
                if (err) {
                    throw new customError_1.DatabaseError("implenentBookFormatLink() " + err);
                }
                const formatId = result.id;
                // create new BookGenre
                const newBookGenre = { bookId, formatId };
                const createBookGenreResult = await this.baseCreate(newBookGenre);
                if (createBookGenreResult.err) {
                    throw new customError_1.DatabaseError("implenentBookFormatLink() " + createBookGenreResult.err);
                }
            }
            else {
                throw new customError_1.NotFoundError("implenentBookFormatLink() " + bookName + " not found in bookFormatLink");
            }
        }
        catch (err) {
            throw new customError_1.DatabaseError("implenentBookFormatLink() FUNC ERROR " + err);
        }
    }
}
exports.BookFormatModel = BookFormatModel;
class BookGenreModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.BookGenre);
        this.bookGenreLink = new Map(); // book name, genre[]
    }
    setBookGenreLink(bookGenreLink) {
        this.bookGenreLink = setLink(bookGenreLink);
    }
    async addManyNewBookGenreLinks() {
        try {
            this.setBookGenreLink(CSVtoSQL_1.CSVtoSQLBook.getBookGenreLink());
            if (this.bookGenreLink.size == 0) {
                throw new customError_1.DatabaseError("implenentBookGenreLink() bookGenreLink is empty");
            }
            for (const [bookName, genres] of this.bookGenreLink) {
                for (const genre of genres) {
                    await this.implenentBookGenreLink(bookName, genre);
                }
            }
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("addManyNewBookGenreLinks()" + err);
        }
    }
    async implenentBookGenreLink(bookName, { id, name }) {
        try {
            const table = new GenreModel();
            const bookTable = new BookItemModel();
            if (this.bookGenreLink.has(bookName)) {
                // find book name
                // get book Id
                const bookResult = await bookTable.find({ where: { book: bookName }, rejectOnEmpty: true });
                let bookId = bookResult.result.id;
                if (bookResult.err) {
                    throw new customError_1.DatabaseError("implenentBookGenreLink() " + bookResult.err);
                }
                // find genre name
                // get genre Id
                const { err, result } = await table.find({ where: { name }, rejectOnEmpty: true });
                if (err) {
                    throw new customError_1.DatabaseError("implenentBookGenreLink() " + err);
                }
                const genreId = result.id;
                // create new BookGenre
                const newBookGenre = { bookId, genreId };
                const createBookGenreResult = await this.baseCreate(newBookGenre);
                if (createBookGenreResult.err) {
                    throw new customError_1.DatabaseError("implenentBookGenreLink() " + createBookGenreResult.err);
                }
            }
            else {
                throw new customError_1.NotFoundError("implenentBookGenreLink() " + bookName + " not found in bookGenreLink");
            }
        }
        catch (err) {
            throw new customError_1.DatabaseError("implenentBookGenreLink() " + err);
        }
    }
}
exports.BookGenreModel = BookGenreModel;
class GenreModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.Genre);
        this.uniqueGenres = [];
    }
    setUniqueGenres(set) {
        set.forEach((name) => {
            this.uniqueGenres.push({ name });
        });
    }
    async createAllGenres() {
        try {
            this.setUniqueGenres(CSVtoSQL_1.CSVtoSQLBook.getUniqueGenres());
            if (this.uniqueGenres.length == 0) {
                throw new customError_1.DatabaseError("createAllGenres() uniqueGenres is empty");
            }
            const { err, result } = await this.baseCreateMany(this.uniqueGenres, { returning: true });
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("createAllGenres()" + err);
        }
    }
}
exports.GenreModel = GenreModel;
class FormatModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.Format);
        this.uniqueFormats = [];
    }
    setUniqueFormats(set) {
        set.forEach((name) => {
            this.uniqueFormats.push({ name });
        });
    }
    async createAllFormats() {
        try {
            this.setUniqueFormats(CSVtoSQL_1.CSVtoSQLBook.getUniqueFormats());
            if (this.uniqueFormats.length == 0) {
                throw new customError_1.DatabaseError("createAllFormats() uniqueFormats is empty");
            }
            const { err, result } = await this.baseCreateMany(this.uniqueFormats, { returning: true });
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("createAllFormats()" + err);
        }
    }
}
exports.FormatModel = FormatModel;
class AuthorModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.Author);
        this.uniqueAuthor = [];
    }
    setUniqueAuthor(set) {
        set.forEach((name) => {
            this.uniqueAuthor.push({ name });
        });
    }
    async createAllAuthor() {
        try {
            this.setUniqueAuthor(CSVtoSQL_1.CSVtoSQLBook.getUniqueAuthors());
            if (this.uniqueAuthor.length == 0) {
                throw new customError_1.DatabaseError("createAllAuthor() uniqueAuthor is empty");
            }
            const { err, result } = await this.baseCreateMany(this.uniqueAuthor, { returning: true });
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("createAllAuthor()" + err);
        }
    }
}
exports.AuthorModel = AuthorModel;
