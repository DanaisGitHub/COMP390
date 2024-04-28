
import StdReturn from "../../../../../types/baseTypes";
import { BookFormat, Format } from "../../../../DB_Functions/Set_Up/modelSetUp";
import { BaseModel } from "../../../baseModel";
import {  BookItemModel } from "../bookModel";
import { DatabaseError, NotFoundError } from "../../../../../utils/other/customError";
import { BaseAttributeModel } from "../../../baseModel";


export class BookFormatModel extends BaseModel<BookFormat> {
    private formatTable = new FormatModel();

    public constructor() {
        super(BookFormat)
    }

    public async addBookFormatLink(bookName: string, formatName: string): Promise<void> { //TODO: abstract to baseModel
        try {
            const bookTable = new BookItemModel();
            await this.baseBookLink(bookName, formatName, this.formatTable, bookTable);
        }
        catch (err) {
            throw new DatabaseError("BookFormatModel() FUNC ERROR " + err);
        }
    }

    public async getAllBookFormatsForSpecficBook(formatID: number, returnIDs = true): Promise<StdReturn<Format[] | number[]>> {
        try {
            const { err, result } = await this.baseFindAll({
                include: [{
                    where: { formatID: formatID },
                    attributes: []
                }]
            });
            if (returnIDs) {
                return { err, result: result?.map((format) => format.formatID) }
            }
            return {
                err, result: await Promise.all(result?.map(async (formatID) => {
                    const { err, result } = await this.formatTable.find({ where: { id: formatID.formatID }, rejectOnEmpty: true });
                    if (err) {
                        throw new DatabaseError("getAllBookFormatsForSpecficBook()" + err);
                    }
                    return result;
                }))
            }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("getAllBookFormatsForSpecficBook()" + err);
        }
    }
}

export class FormatModel extends BaseAttributeModel<Format> {
    public constructor() {
        super(Format)
    }
}