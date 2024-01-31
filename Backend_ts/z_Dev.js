"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csvtojson_1 = __importDefault(require("csvtojson"));
const csvFilePath = '../Backend_py/DataSource/first10s.csv';
const csvFile = async () => {
    const csv = csvtojson_1.default;
    const jsonArray = await csv().fromFile(csvFilePath);
    return jsonArray;
};
const convertstringToArray = (string) => {
    let array = [];
    string = string.replace(/[\[\]']+/g, ''); // remove brackets from string
    string = string.replace(/['"]+/g, ''); // remove quotes from string
    string = string.replace(/(^\s+|\s+$)+/g, '');
    array = string.split(',');
    for (let i = 0; i < array.length; i++) {
        array[i] = array[i].trim();
    }
    return array;
};
const descriptionFilter = (string) => {
    string = string.replace(/[\[\]']+/g, ''); // remove brackets from string
    string = string.replace(/(^\s+|\s+$)+/g, ''); // removes whitespace aka trim()
    string = string.replace(/[\n]+/g, ''); // removes \n
    return string;
};
const convertValues = (bookRawArray) => {
    let returnValue = [];
    bookRawArray.forEach(rawBook => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        returnValue.push({
            book: rawBook.book,
            series: (_a = rawBook.series) !== null && _a !== void 0 ? _a : "",
            releaseNumber: Number.isNaN(parseInt(rawBook.releaseNumber)) ? -2 : (_b = parseInt(rawBook.releaseNumber)) !== null && _b !== void 0 ? _b : -1,
            author: (_c = rawBook.author) !== null && _c !== void 0 ? _c : "",
            description: (_d = descriptionFilter(rawBook.description)) !== null && _d !== void 0 ? _d : "",
            numPages: (_e = parseInt(rawBook.numPages)) !== null && _e !== void 0 ? _e : 0,
            format: (_f = convertstringToArray(rawBook.format)) !== null && _f !== void 0 ? _f : [],
            genres: (_g = convertstringToArray(rawBook.genres)) !== null && _g !== void 0 ? _g : [],
            publication: (_h = new Date(rawBook.publication)) !== null && _h !== void 0 ? _h : new Date("01-01-1970"),
            rating: (_j = parseFloat(rawBook.rating)) !== null && _j !== void 0 ? _j : 0.0,
            numberOfVoters: (_k = parseInt(rawBook.numberOfVoters)) !== null && _k !== void 0 ? _k : 0
        });
    });
    return returnValue;
};
csvFile().then((data) => {
    console.log(convertValues(data));
}).catch((error) => {
    console.log(error);
});
