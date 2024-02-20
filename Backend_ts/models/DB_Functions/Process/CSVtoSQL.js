"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVtoSQLBook = void 0;
// have a good feeling this needs to be file stream (Too big for memory)
const fs_1 = __importDefault(require("fs"));
const csvtojson_1 = __importDefault(require("csvtojson"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const csvFilePath = '../Backend_py/DataSource/first10s.csv';
const bookModel_1 = require("../../typesOfModels/Items/bookModel");
// need to do this as a stream
class ReadCSV {
    static async readAsync() {
        try {
            const csv = csvtojson_1.default;
            const csvStream = fs_1.default.createReadStream(csvFilePath, { encoding: 'utf8' }); // each row  // remove duplicates
            csvStream.pipe((0, csv_parser_1.default)())
                .on('data', async (row) => {
                await CSVtoSQLBook.processEachRow(row); // not read properly 
            })
                .on('end', function () {
                console.log('All Data loaded');
            });
        }
        catch (error) {
            console.log(error);
            throw new Error("Error in CSVtoSQLBook.readAsync " + error);
        }
    }
}
class CSVtoSQLBook {
    static dateProcessor(date) {
        const dateArray = date.split(" "); // ["January", "1,", "1980"]
        const year = dateArray[2];
        const newDate = new Date(year);
        return newDate;
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
        string = string.replace(/[\[\]']+/g, ''); // remove brackets from string // error
        string = string.replace(/(^\s+|\s+$)+/g, ''); // removes whitespace aka trim()
        string = string.replace(/[\n]+/g, ''); // removes \n
        return string;
    }
    static removeDuplicates(rawBook) {
        rawBook.format = Array.from(new Set(rawBook.format));
        rawBook.genres = Array.from(new Set(rawBook.genres));
        return rawBook;
    }
    static async convertValue(rawBook) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        try {
            let tempBookType = {
                book: (_a = rawBook.book) !== null && _a !== void 0 ? _a : "",
                series: (_b = rawBook.series) !== null && _b !== void 0 ? _b : "",
                author: (_c = rawBook.author) !== null && _c !== void 0 ? _c : "",
                description: (_d = this.cleanString(rawBook.description)) !== null && _d !== void 0 ? _d : "",
                numPages: (_e = parseInt(rawBook.numPages)) !== null && _e !== void 0 ? _e : 0,
                format: (_f = this.convertStringToArray(rawBook.format)) !== null && _f !== void 0 ? _f : [],
                genres: (_g = this.convertStringToArray(rawBook.genres)) !== null && _g !== void 0 ? _g : [],
                publication: (_h = this.dateProcessor(rawBook.publication)) !== null && _h !== void 0 ? _h : undefined,
                rating: Number.isNaN(parseFloat(rawBook.rating)) ? parseFloat(rawBook.rating) : 0.0 !== null && 0.0 !== void 0 ? 0.0 : 0.0,
                numOfVoters: (_j = parseInt(rawBook.numberOfVoters)) !== null && _j !== void 0 ? _j : 0
            };
            // tempBookType = CSVtoSQLBook.removeDuplicates(tempBookType);
            return tempBookType;
        } // for each new tempbook send a create request
        catch (error) {
            console.log(error);
            throw new Error("Error in CSVtoSQLBook.convertValue " + error);
        }
    }
    static async sendMetaData(book) {
        const genreModel = new bookModel_1.GenreModel();
        const formatModel = new bookModel_1.FormatModel();
        const authorModel = new bookModel_1.AuthorModel();
        const author = book.author;
        book.format.forEach(async (format) => {
            await formatModel.addFormat(format);
        });
        book.genres.forEach(async (genre) => {
            await genreModel.addGenre(genre); // will have thousands of genres stoted in memory
        });
        await authorModel.addAuthor(author);
    }
    static async sendMetaDataLinks(book) {
        const bookGenreModel = new bookModel_1.BookGenreModel();
        const bookFormatModel = new bookModel_1.BookFormatModel();
        const bookAuthorModel = new bookModel_1.BookAuthorModel();
        book = CSVtoSQLBook.removeDuplicates(book);
        book.format.forEach(async (format) => {
            await bookFormatModel.addBookFormatLink(book.book, format);
        });
        book.genres.forEach(async (genre) => {
            await bookGenreModel.addBookGenreLink(book.book, genre);
        });
        await bookAuthorModel.addBookAuthorLink(book.book, book.author);
    }
    static async processEachRow(bookRowRaw) {
        try {
            const bookItemModel = new bookModel_1.BookItemModel();
            const bookRow = await this.convertValue(bookRowRaw);
            await bookItemModel.addBookItem(bookRow);
            // get unique values for format, genres, and authors
            await this.sendMetaData(bookRow);
            await this.sendMetaDataLinks(bookRow);
        }
        catch (error) {
            console.log(error);
            throw new Error("Error in CSVtoSQLBook.convertValues " + error);
        }
    }
    //badCoding but it works
    static async run() {
        await ReadCSV.readAsync();
    }
}
exports.CSVtoSQLBook = CSVtoSQLBook;