import StdReturn from "../../../../../types/baseTypes";
import { BookAuthor, Author, BookFormat, Format } from "../../../../DB_Functions/Set_Up/modelSetUp";
import { BaseBookAttributesModel, BaseModel } from "../../../baseModel";
import { BookItemModel } from "../bookModel";
import { DatabaseError, NotFoundError } from "../../../../../utils/other/customError";
import { BaseAttributeModel } from "../../../baseModel";

export class BookAuthorModel extends BaseBookAttributesModel<BookAuthor> {

    public constructor() {
        super(BookAuthor)
    }

    public async addBookAuthorLink(bookName: string, authorName: string): Promise<void> { //TODO: abstract to baseModel
        try {
            const authorTable = new AuthorModel();
            const bookTable = new BookItemModel();
            await this.baseBookLink(bookName, authorName, authorTable, bookTable);
        }
        catch (err) {
            throw new DatabaseError("addBookAuthorLink() FUNC ERROR " + err);
        }
    }

    public async getAllBookAuthorsForSpecficBook(bookID: number, returnIDs = true): Promise<StdReturn<Author[] | number[]>> {// ERROR: BookAuthor is not associated to BookAuthor!
        try {
            const authorTable = new AuthorModel();
            const { err, result } = await this.baseFindAll({
                include: [{
                    where: { bookID },
                    attributes: []
                }]
            });
            if (returnIDs) {
                return { err, result: result?.map((author) => author.authorID) }
            }

            return {
                err, result: await Promise.all(result?.map(async (author) => {
                    const { err, result } = await authorTable.find({ where: { id: author.authorID }, rejectOnEmpty: true });
                    if (err) {
                        throw new DatabaseError("getAllBookAuthorsForSpecficBook()" + err);
                    }
                    return result;
                }))
            }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("getBookAuthors()" + err);
        }
    }
}

export class AuthorModel extends BaseAttributeModel<Author> {
    public constructor() {
        super(Author)
    }
}

