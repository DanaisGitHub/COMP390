"use strict";
// have a good feeling this needs to be file stream (Too big for memory)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVtoSQLBook = void 0;
const csvtojson_1 = __importDefault(require("csvtojson"));
const csvFilePath = '../Backend_py/DataSource/first10s.csv';
const bookModel_1 = require("./typesOfModels/bookModel");
class ReadCSV {
    static async readaSync() {
        const csv = csvtojson_1.default;
        const jsonArray = await csv().fromFile(csvFilePath);
        return jsonArray;
    }
    static convertStringToArray(string) {
        let array = [];
        string = string.replace(/[\[\]']+/g, ''); // remove brackets from string
        string = string.replace(/['"]+/g, ''); // remove quotes from string
        string = string.replace(/(^\s+|\s+$)+/g, '');
        array = string.split(',');
        for (let i = 0; i < array.length; i++) {
            array[i] = array[i].trim();
        }
        return array;
    }
    static cleanString(string) {
        string = string.replace(/[\[\]']+/g, ''); // remove brackets from string
        string = string.replace(/(^\s+|\s+$)+/g, ''); // removes whitespace aka trim()
        string = string.replace(/[\n]+/g, ''); // removes \n
        return string;
    }
} // might make singleton
class CSVtoSQLBook {
    static setIntoArray(set) {
        const array = Array.from(set).map((str) => {
            return str;
        });
        return array;
    }
    static convertValues(bookRawArray) {
        let returnValue = [];
        bookRawArray.forEach(rawBook => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const tempBookType = {
                book: (_a = rawBook.book) !== null && _a !== void 0 ? _a : "",
                series: (_b = rawBook.series) !== null && _b !== void 0 ? _b : "",
                releaseNumber: Number.isNaN(parseInt(rawBook.releaseNumber)) ? -2 : (_c = parseInt(rawBook.releaseNumber)) !== null && _c !== void 0 ? _c : -1,
                author: (_d = rawBook.author) !== null && _d !== void 0 ? _d : "",
                description: (_e = ReadCSV.cleanString(rawBook.description)) !== null && _e !== void 0 ? _e : "",
                numPages: (_f = parseInt(rawBook.numPages)) !== null && _f !== void 0 ? _f : 0,
                format: (_g = ReadCSV.convertStringToArray(rawBook.format)) !== null && _g !== void 0 ? _g : [],
                genres: (_h = ReadCSV.convertStringToArray(rawBook.genres)) !== null && _h !== void 0 ? _h : [],
                publication: (_j = new Date(rawBook.publication)) !== null && _j !== void 0 ? _j : new Date("01-01-1970"),
                rating: Number.isNaN(parseFloat(rawBook.rating)) ? parseFloat(rawBook.rating) : 0 !== null && 0 !== void 0 ? 0 : 0.0,
                numberOfVoters: (_k = parseInt(rawBook.numberOfVoters)) !== null && _k !== void 0 ? _k : 0
            };
            returnValue.push(tempBookType);
            // get unique values for format, genres, and authors
            tempBookType.format.forEach((format) => {
                this.uniqueFormats.add(format);
                console.log(format);
            });
            tempBookType.genres.forEach((genre) => {
                this.uniqueGenres.add(genre);
            });
            this.uniqueAuthors.add(tempBookType.author);
            this.bookGenreLink.set(tempBookType.book, tempBookType.genres); // starting the link to the other tables
            this.bookFormatLink.set(tempBookType.book, tempBookType.format);
            this.bookAuthorLink.set(tempBookType.book, [tempBookType.author]);
        });
        return returnValue;
    }
    // getters
    static getUniqueFormats() {
        return this.setIntoArray(this.uniqueFormats);
    }
    static getUniqueGenres() {
        return this.setIntoArray(this.uniqueGenres);
    }
    static getUniqueAuthors() {
        return this.setIntoArray(this.uniqueAuthors);
    }
    static getBookFormatLink() {
        return this.bookFormatLink;
    }
    static getBookGenreLink() {
        return this.bookGenreLink;
    }
    static getBookAuthorLink() {
        return this.bookAuthorLink;
    }
    //badCoding but it works
    static setGenreLink() {
        const genreModel = new bookModel_1.GenreModel();
        const bookGenreModel = new bookModel_1.BookGenreModel();
        genreModel.setUniqueGenres(this.getUniqueGenres());
        bookGenreModel.setBookGenreLink(this.getBookGenreLink());
    }
    static setFormatLink() {
        const formatModel = new bookModel_1.FormatModel();
        const bookFormatModel = new bookModel_1.BookFormatModel();
        formatModel.setUniqueFormats(this.getUniqueFormats());
        bookFormatModel.setBookFormatLink(this.getBookFormatLink());
    }
    static setAuthorLink() {
        const authorModel = new bookModel_1.AuthorModel();
        const bookAuthorModel = new bookModel_1.BookAuthorModel();
        authorModel.setUniqueAuthor(this.getUniqueAuthors());
        bookAuthorModel.setBookAuthorLink(this.getBookAuthorLink());
    }
    static async run() {
        const rawBookArray = await ReadCSV.readaSync();
        const bookArray = this.convertValues(rawBookArray);
        this.setGenreLink();
        this.setFormatLink();
        this.setAuthorLink();
        return bookArray;
    }
}
exports.CSVtoSQLBook = CSVtoSQLBook;
CSVtoSQLBook.uniqueFormats = new Set();
CSVtoSQLBook.uniqueGenres = new Set();
CSVtoSQLBook.uniqueAuthors = new Set();
CSVtoSQLBook.bookFormatLink = new Map();
CSVtoSQLBook.bookGenreLink = new Map();
CSVtoSQLBook.bookAuthorLink = new Map();
