"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreModel = exports.BookGenreModel = void 0;
const modelSetUp_1 = require("../../../../DB_Functions/Set_Up/modelSetUp");
const baseModel_1 = require("../../../baseModel");
const bookModel_1 = require("../bookModel");
const customError_1 = require("../../../../../utils/other/customError");
class BookGenreModel extends baseModel_1.BaseBookAttributesModel {
    constructor() {
        super(modelSetUp_1.BookGenre);
        this.genreTable = new GenreModel();
    }
    async addBookGenreLink(bookName, genreName) {
        try {
            const bookTable = new bookModel_1.BookItemModel();
            await this.baseBookLink(bookName, genreName, this.genreTable, bookTable);
        }
        catch (err) {
            throw new customError_1.DatabaseError("BookGenreModel() FUNC ERROR " + err);
        }
    }
}
exports.BookGenreModel = BookGenreModel;
class GenreModel extends baseModel_1.BaseAttributeModel {
    constructor() {
        super(modelSetUp_1.Genre);
    }
}
exports.GenreModel = GenreModel;
