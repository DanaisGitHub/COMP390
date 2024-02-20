import { AuthorType, BookAuthorType, BookFormatType, BookGenreType, BookPreferenceType, BookType, FormatType, GenreType } from "../../../types/bookTypes";
import { CSVtoSQLBook } from "../../DB_Functions/Process/CSVtoSQL";
import { DatabaseError, NotFoundError } from "../../../utils/customError";
import { BaseModel } from "../baseModel";
import StdReturn from "../../../types/baseTypes";
import { BookItem, BookAuthor, BookFormat, BookGenre, Genre, Format, Author, BookPreference } from "../../DB_Functions/Set_Up/modelSetUp";
import crypto from 'crypto';

const randomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export class BookItemModel extends BaseModel<BookItem> {
    public constructor() {
        super(BookItem)
    }

    public async addBookItem(book: BookType): Promise<StdReturn<BookItem>> {
        try {
            const { err, result } = await this.baseCreate(book);
            return { err, result }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("addBookItem()" + err);
        }
    }

    public async addAllBookItems(): Promise<void> {
        try {
            await CSVtoSQLBook.run();
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("addBookItem()" + err);
        }
    }
}

export class BookAuthorModel extends BaseModel<BookAuthor> {

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
}

export class BookFormatModel extends BaseModel<BookFormat> {
    public constructor() {
        super(BookFormat)
    }

    public async addBookFormatLink(bookName: string, formatName: string): Promise<void> { //TODO: abstract to baseModel
        try {
            const formatTable = new FormatModel();
            const bookTable = new BookItemModel();
            await this.baseBookLink(bookName, formatName, formatTable, bookTable);
        }
        catch (err) {
            throw new DatabaseError("BookFormatModel() FUNC ERROR " + err);
        }
    }
}

export class BookGenreModel extends BaseModel<BookGenre> {
    public constructor() {
        super(BookGenre)
    }

    public async addBookGenreLink(bookName: string, genreName: string): Promise<void> { //TODO: abstract to baseModel
        try {
            const genreTable = new GenreModel();
            const bookTable = new BookItemModel();
            await this.baseBookLink(bookName, genreName, genreTable, bookTable);
        }
        catch (err) {
            throw new DatabaseError("BookGenreModel() FUNC ERROR " + err);
        }
    }
}

export class GenreModel extends BaseModel<Genre> {
    public constructor() {
        super(Genre)
    }

    public async addGenre(genreName: string): Promise<StdReturn<Genre>> {
        try {
            const { err, result } = await this.baseCreate({ name: genreName });
            return { err, result }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("addGenre()" + err);
        }
    }
}

export class FormatModel extends BaseModel<Format> {

    public constructor() {
        super(Format)
    }

    public async addFormat(formatName: string): Promise<StdReturn<Format>> {
        try {

            const { err, result } = await this.baseCreate({ name: formatName });
            return { err, result }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("addFormat()" + err);
        }
    }
}

export class AuthorModel extends BaseModel<Author> {
    public constructor() {
        super(Author)
    }

    public async addAuthor(genreName: string): Promise<StdReturn<Author>> {
        try {
            const { err, result } = await this.baseCreate({ name: genreName });
            return { err, result }

        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("addAuthor()" + err);
        }
    }
}


export class BookPreferenceModel extends BaseModel<BookPreference> {
    public constructor() {
        super(BookPreference)
    }

    public async createEmptyBookPreference(userID: number): Promise<StdReturn<BookPreference>> {
        try {
            const newBookPreference: BookPreferenceType = { userID };
            const { err, result } = await this.baseCreate(newBookPreference);
            return { err, result }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("addBookPreference()" + err);
        }
    }

    public async createBookPreference(bookPref:BookPreferenceType ): Promise<StdReturn<BookPreference>> {
        try {
            const newBookPreference: BookPreferenceType = bookPref;
            const { err, result } = await this.baseCreate(newBookPreference);
            return { err, result }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("addBookPreference()" + err);
        }
    }

    public updateBookPreference = async (newBookPreference: BookPreferenceType, userID: number): Promise<void> => {
        try {
            await this.baseUpdate(newBookPreference, { where: { userID } })
        } catch (err) {
            console.log(err)
            throw new Error("Error in updateBookPreference" + err)
        }
    }

    public createRandomBookPreference = async (userID: number): Promise<void> => {
        try {
            const bookPreference: BookPreferenceType = {
                userID,
                authorPreference: [crypto.randomBytes(20).toString('hex'), crypto.randomBytes(20).toString('hex')],
                genrePreference: [crypto.randomBytes(20).toString('hex'), crypto.randomBytes(20).toString('hex')],
                formatPreference: [crypto.randomBytes(20).toString('hex'), crypto.randomBytes(20).toString('hex')],
                publicationRange: { min: randomDate(new Date(1920, 1, 1), new Date(2004, 1, 1)), max: new Date() },
                bookLengthRange: { min: Math.random() * 100, max: 100 }
            }
            const { err, result } = await this.createBookPreference(bookPreference);
        } catch (err) {
            console.log(err)
            throw new Error("Error in createRandomBookPreference")
        }
    }
}
