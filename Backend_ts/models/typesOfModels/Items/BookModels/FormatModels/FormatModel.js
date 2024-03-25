"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatModel = exports.BookFormatModel = void 0;
const modelSetUp_1 = require("../../../../DB_Functions/Set_Up/modelSetUp");
const baseModel_1 = require("../../../baseModel");
const bookModel_1 = require("../bookModel");
const customError_1 = require("../../../../../utils/other/customError");
const baseModel_2 = require("../../../baseModel");
class BookFormatModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.BookFormat);
        this.formatTable = new FormatModel();
    }
    async addBookFormatLink(bookName, formatName) {
        try {
            const bookTable = new bookModel_1.BookItemModel();
            await this.baseBookLink(bookName, formatName, this.formatTable, bookTable);
        }
        catch (err) {
            throw new customError_1.DatabaseError("BookFormatModel() FUNC ERROR " + err);
        }
    }
    async getAllBookFormatsForSpecficBook(formatId, returnIds = true) {
        try {
            const { err, result } = await this.baseFindAll({
                include: [{
                        where: { formatId: formatId },
                        attributes: []
                    }]
            });
            if (returnIds) {
                return { err, result: result === null || result === void 0 ? void 0 : result.map((format) => format.formatId) };
            }
            return {
                err, result: await Promise.all(result === null || result === void 0 ? void 0 : result.map(async (formatId) => {
                    const { err, result } = await this.formatTable.find({ where: { id: formatId.formatId }, rejectOnEmpty: true });
                    if (err) {
                        throw new customError_1.DatabaseError("getAllBookFormatsForSpecficBook()" + err);
                    }
                    return result;
                }))
            };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("getAllBookFormatsForSpecficBook()" + err);
        }
    }
}
exports.BookFormatModel = BookFormatModel;
class FormatModel extends baseModel_2.BaseAttributeModel {
    constructor() {
        super(modelSetUp_1.Format);
    }
}
exports.FormatModel = FormatModel;
