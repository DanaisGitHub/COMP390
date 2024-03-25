
import StdReturn from "../../../../../types/baseTypes";
import { BookFormat, Format } from "../../../../DB_Functions/Set_Up/modelSetUp";
import { BaseModel } from "../../../baseModel";
import {  BookItemModel } from "../bookModel";
import { DatabaseError, NotFoundError } from "../../../../../utils/other/customError";
import { BaseAttributeModel } from "../../../baseModel";


export class BookFormatModel extends BaseModel<BookFormat> {
    public constructor() {
        super(BookFormat)
    }

    private formatTable = new FormatModel();

    public async addBookFormatLink(bookName: string, formatName: string): Promise<void> { //TODO: abstract to baseModel
        try {
            const bookTable = new BookItemModel();
            await this.baseBookLink(bookName, formatName, this.formatTable, bookTable);
        }
        catch (err) {
            throw new DatabaseError("BookFormatModel() FUNC ERROR " + err);
        }
    }

    public async getAllBookFormatsForSpecficBook(formatId: number, returnIds = true): Promise<StdReturn<Format[] | number[]>> {
        try {
            const { err, result } = await this.baseFindAll({
                include: [{
                    where: { formatId: formatId },
                    attributes: []
                }]
            });
            if (returnIds) {
                return { err, result: result?.map((format) => format.formatId) }
            }
            return {
                err, result: await Promise.all(result?.map(async (formatId) => {
                    const { err, result } = await this.formatTable.find({ where: { id: formatId.formatId }, rejectOnEmpty: true });
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