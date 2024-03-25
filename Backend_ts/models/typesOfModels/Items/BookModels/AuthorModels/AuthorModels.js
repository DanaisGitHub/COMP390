"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorModel = exports.BookAuthorModel = void 0;
const modelSetUp_1 = require("../../../../DB_Functions/Set_Up/modelSetUp");
const baseModel_1 = require("../../../baseModel");
const bookModel_1 = require("../bookModel");
const customError_1 = require("../../../../../utils/other/customError");
const baseModel_2 = require("../../../baseModel");
class BookAuthorModel extends baseModel_1.BaseBookAttributesModel {
    constructor() {
        super(modelSetUp_1.BookAuthor);
    }
    async addBookAuthorLink(bookName, authorName) {
        try {
            const authorTable = new AuthorModel();
            const bookTable = new bookModel_1.BookItemModel();
            await this.baseBookLink(bookName, authorName, authorTable, bookTable);
        }
        catch (err) {
            throw new customError_1.DatabaseError("addBookAuthorLink() FUNC ERROR " + err);
        }
    }
    async getAllBookAuthorsForSpecficBook(bookId, returnIds = true) {
        try {
            const authorTable = new AuthorModel();
            const { err, result } = await this.baseFindAll({
                include: [{
                        where: { bookId },
                        attributes: []
                    }]
            });
            if (returnIds) {
                return { err, result: result === null || result === void 0 ? void 0 : result.map((author) => author.authorId) };
            }
            return {
                err, result: await Promise.all(result === null || result === void 0 ? void 0 : result.map(async (author) => {
                    const { err, result } = await authorTable.find({ where: { id: author.authorId }, rejectOnEmpty: true });
                    if (err) {
                        throw new customError_1.DatabaseError("getAllBookAuthorsForSpecficBook()" + err);
                    }
                    return result;
                }))
            };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("getBookAuthors()" + err);
        }
    }
}
exports.BookAuthorModel = BookAuthorModel;
class AuthorModel extends baseModel_2.BaseAttributeModel {
    constructor() {
        super(modelSetUp_1.Author);
    }
}
exports.AuthorModel = AuthorModel;
