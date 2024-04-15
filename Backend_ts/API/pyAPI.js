"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = exports.get = void 0;
const axios_1 = __importDefault(require("axios"));
const pythonAPI = 'http://127.0.0.1:5000/';
const get = async (url) => {
    try {
        const response = await axios_1.default.get(url);
        return response.data;
    }
    catch (err) {
        console.error(err);
        throw new Error(`Error in get ${err.message}`);
    }
};
exports.get = get;
const post = async (url, data) => {
    try {
        const response = await axios_1.default.post(url, data);
        return response.data;
    }
    catch (err) {
        console.error(err);
        throw new Error(`Error in post ${err.message}`);
    }
};
exports.post = post;
async function getRankedBooks(userID, userSex, bookIDs, bookTitles) {
    try {
        const data = {
            user_id: userID,
            sex: userSex,
            book_id: bookIDs,
            book_title: bookTitles
        };
        const url = `${pythonAPI}`;
        return await (0, exports.post)(url, data);
    }
    catch (err) {
        console.error(err);
        throw new Error(`Error in getting PYTHON  ${err.message}`);
    }
}
exports.default = getRankedBooks;
