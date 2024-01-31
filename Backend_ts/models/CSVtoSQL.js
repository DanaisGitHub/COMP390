"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVtoSQLBook = void 0;
const csvtojson_1 = __importDefault(require("csvtojson"));
const csvFilePath = '../Backend_py/DataSource/first10s.csv';
class CSVtoSQLBook {
    static async readRawCSVFile() {
        const csv = csvtojson_1.default;
        const jsonArray = await csv().fromFile(csvFilePath);
        return jsonArray;
    }
    static convertstringToArray(string) {
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
    static descriptionFilter(string) {
        string = string.replace(/[\[\]']+/g, ''); // remove brackets from string
        string = string.replace(/(^\s+|\s+$)+/g, ''); // removes whitespace aka trim()
        string = string.replace(/[\n]+/g, ''); // removes \n
        return string;
    }
    static convertValues(bookRawArray) {
        let returnValue = [];
        bookRawArray.forEach(rawBook => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            returnValue.push({
                book: rawBook.book,
                series: (_a = rawBook.series) !== null && _a !== void 0 ? _a : "",
                releaseNumber: Number.isNaN(parseInt(rawBook.releaseNumber)) ? -2 : (_b = parseInt(rawBook.releaseNumber)) !== null && _b !== void 0 ? _b : -1,
                author: (_c = rawBook.author) !== null && _c !== void 0 ? _c : "",
                description: (_d = this.descriptionFilter(rawBook.description)) !== null && _d !== void 0 ? _d : "",
                numPages: (_e = parseInt(rawBook.numPages)) !== null && _e !== void 0 ? _e : 0,
                format: (_f = this.convertstringToArray(rawBook.format)) !== null && _f !== void 0 ? _f : [],
                genres: (_g = this.convertstringToArray(rawBook.genres)) !== null && _g !== void 0 ? _g : [],
                publication: (_h = new Date(rawBook.publication)) !== null && _h !== void 0 ? _h : new Date("01-01-1970"),
                rating: (_j = parseFloat(rawBook.rating)) !== null && _j !== void 0 ? _j : 0.0,
                numberOfVoters: (_k = parseInt(rawBook.numberOfVoters)) !== null && _k !== void 0 ? _k : 0
            });
        });
        return returnValue;
    }
    static async run() {
        const rawBookArray = await this.readRawCSVFile();
        const bookArray = this.convertValues(rawBookArray);
        return bookArray;
    }
}
exports.CSVtoSQLBook = CSVtoSQLBook;
