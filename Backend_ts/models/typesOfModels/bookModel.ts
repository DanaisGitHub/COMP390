import { AuthorType, BookAuthorType, BookFormatType, BookGenreType, BookType, FormatType, GenreType } from "../../types/bookTypes";
import { CSVtoSQLBook } from "../CSVtoSQL";
import { DatabaseError, NotFoundError } from "../../utils/customError";
import { BaseModel } from "./baseModel";
import StdReturn from "../../types/baseTypes";
import { BookItem, BookAuthor, BookFormat, BookGenre, Genre, Format, Author } from "../modelSetUp";




export class BookItemModel extends BaseModel<BookItem> {
    public constructor() {
        super(BookItem)
    }

    public async addBooksAndLinks(): Promise<StdReturn<BookItem[]>> {
        try {
            const bookItemDetails: BookType[] = await CSVtoSQLBook.run();
            const { err, result } = await this.baseCreateMany(bookItemDetails, { returning: true })
            // next functions
            await this.addGenreLink();
            await this.addFormatLink();
            await this.addAuthorLink();
            return { err, result };
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("addNewBookItem()" + err);
        }
    }

    private async addGenreLink(): Promise<void> {
        const genreTable = new GenreModel();
        const bookGenreTable = new BookGenreModel();

        // create all genres
        await genreTable.createAllGenres();
        await bookGenreTable.addManyNewBookGenreLinks();
    }

    public async addFormatLink(): Promise<void> {
        const formatTable = new FormatModel();
        const bookFormatTable = new BookFormatModel();

        // create all formats
        await formatTable.createAllFormats();
       await bookFormatTable.addManyNewBookFormatLinks();
    }

    public async addAuthorLink(): Promise<void> {
        const authorTable = new AuthorModel();
        const bookAuthorTable = new BookAuthorModel();

        // create all formats
        await authorTable.createAllAuthor();
        await bookAuthorTable.addManyNewBookAuthorLinks(); 
    }


}

export class BookAuthorModel extends BaseModel<BookAuthor> {

    public constructor() {
        super(BookAuthor)
    }
    private bookAuthorLink = new Map<string, AuthorType[]>();

    public setBookAuthorLink(bookAuthorLink: Map<string, string[]>): void {
        bookAuthorLink.forEach((value, key) => {
            const linkArray = value.map((name) => {
                return { name }
            })
            this.bookAuthorLink.set(key, linkArray as AuthorType[]);
        })
    }

    public async addManyNewBookAuthorLinks(): Promise<void> {
        try {
            this.setBookAuthorLink(CSVtoSQLBook.getBookAuthorLink());
            if (this.bookAuthorLink.size == 0) {
                throw new DatabaseError("implenentBookAuthorLink() bookAuthorLink is empty");
            }
            for (const [bookName, authors] of this.bookAuthorLink) {
                for (const author of authors) {
                    await this.implenentBookGenreLink(bookName, author);
                }
            }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("addManyNewBookAuthorLinks()" + err);
        }
    }

    private async implenentBookGenreLink(bookName: string, { id, name }: AuthorType): Promise<void> { //TODO: abstract to baseModel
        try {
            const table = new AuthorModel();
            const bookTable = new BookItemModel();

            if (this.bookAuthorLink.has(bookName)) {
                // find book name
                // get book Id
                const bookResult = await bookTable.find({ where: { book: bookName }, rejectOnEmpty: true });
                let bookId: number = bookResult.result.id;
                if (bookResult.err) {
                    throw new DatabaseError("implenentBookAuthorLink() " + bookResult.err);
                }

                // find genre name
                // get genre Id
                const { err, result } = await table.find({ where: { name }, rejectOnEmpty: true });
                if (err) {
                    throw new DatabaseError("implenentBookAuthorLink() " + err);
                }
                const authorId = result.id;

                // create new BookGenre
                const newBookAuthor: BookAuthorType = { bookId, authorId };
                const createBookGenreResult = await this.baseCreate(newBookAuthor);
                if (createBookGenreResult.err) {
                    throw new DatabaseError("implenentBookAuthorLink() " + createBookGenreResult.err);
                }
            }
            else {
                throw new NotFoundError("implenentBookAuthorLink() " + bookName + " not found in bookAuthorLink");
            }
        }
        catch (err) {
            throw new DatabaseError("implenentBookAuthorLink() " + err);
        }
    }
}


type LinkTypes = FormatType | GenreType | AuthorType;


const setLink = <T extends LinkTypes>(link: Map<string, string[]>): Map<string, T[]> => {
    const linkSet = new Map<string, T[]>();
    link.forEach((value, key) => {
        const linkArray = value.map((name) => {
            return { name }
        })
        linkSet.set(key, linkArray as T[]);
    })
    return linkSet;
}


export class BookFormatModel extends BaseModel<BookFormat> {
    public constructor() {
        super(BookFormat)
    }

    private bookFormatLink = new Map<string, FormatType[]>(); // book name, genre[]

    public setBookFormatLink(bookFormatLink: Map<string, string[]>): void { // converts string[] to GenreType[]
        this.bookFormatLink = setLink<FormatType>(bookFormatLink);
    }

    public async addManyNewBookFormatLinks(): Promise<void> {
        try {
            this.setBookFormatLink(CSVtoSQLBook.getBookFormatLink());
            if (this.bookFormatLink.size == 0) {
                throw new DatabaseError("implenentBookFormatLink() bookFormatLink is empty");
            }
            for (const [bookName, genres] of this.bookFormatLink) {
                for (const genre of genres) {
                    await this.implenentBookFormatLink(bookName, genre);
                }
            }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("addManyNewBookFormatLinks()" + err);
        }
    }

    private async implenentBookFormatLink(bookName: string, { id, name }: FormatType): Promise<void> { //TODO: abstract to baseModel
        try {
            const table = new FormatModel();
            const bookTable = new BookItemModel();

            if (this.bookFormatLink.has(bookName)) {
                // find book name
                // get book Id
                const bookResult = await bookTable.find({ where: { book: bookName }, rejectOnEmpty: true });
                let bookId: number = bookResult.result.id;
                if (bookResult.err) {
                    throw new DatabaseError("implenentBookFormatLink() " + bookResult.err);
                }

                // find genre name
                // get genre Id
                const { err, result } = await table.find({ where: { name }, rejectOnEmpty: true });
                if (err) {
                    throw new DatabaseError("implenentBookFormatLink() " + err);
                }
                const formatId = result.id;

                // create new BookGenre
                const newBookGenre: BookFormatType = { bookId, formatId };
                const createBookGenreResult = await this.baseCreate(newBookGenre);
                if (createBookGenreResult.err) {
                    throw new DatabaseError("implenentBookFormatLink() " + createBookGenreResult.err);
                }
            }
            else {
                throw new NotFoundError("implenentBookFormatLink() " + bookName + " not found in bookFormatLink");
            }
        }
        catch (err) {
            throw new DatabaseError("implenentBookFormatLink() FUNC ERROR " + err);
        }
    }

}

export class BookGenreModel extends BaseModel<BookGenre> {
    public constructor() {
        super(BookGenre)
    }

    private bookGenreLink = new Map<string, GenreType[]>(); // book name, genre[]

    public setBookGenreLink(bookGenreLink: Map<string, string[]>): void { // converts string[] to GenreType[]
        this.bookGenreLink = setLink<GenreType>(bookGenreLink);
    }


    public async addManyNewBookGenreLinks(): Promise<void> {
        try {
            this.setBookGenreLink(CSVtoSQLBook.getBookGenreLink());
            if (this.bookGenreLink.size == 0) {
                throw new DatabaseError("implenentBookGenreLink() bookGenreLink is empty");
            }
            for (const [bookName, genres] of this.bookGenreLink) {
                for (const genre of genres) {
                    await this.implenentBookGenreLink(bookName, genre);
                }
            }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("addManyNewBookGenreLinks()" + err);
        }
    }

    private async implenentBookGenreLink(bookName: string, { id, name }: GenreType): Promise<void> { //TODO: abstract to baseModel
        try {
            const table = new GenreModel();
            const bookTable = new BookItemModel();

            if (this.bookGenreLink.has(bookName)) {
                // find book name
                // get book Id
                const bookResult = await bookTable.find({ where: { book: bookName }, rejectOnEmpty: true });
                let bookId: number = bookResult.result.id;
                if (bookResult.err) {
                    throw new DatabaseError("implenentBookGenreLink() " + bookResult.err);
                }

                // find genre name
                // get genre Id
                const { err, result } = await table.find({ where: { name }, rejectOnEmpty: true });
                if (err) {
                    throw new DatabaseError("implenentBookGenreLink() " + err);
                }
                const genreId = result.id;

                // create new BookGenre
                const newBookGenre: BookGenreType = { bookId, genreId };
                const createBookGenreResult = await this.baseCreate(newBookGenre);
                if (createBookGenreResult.err) {
                    throw new DatabaseError("implenentBookGenreLink() " + createBookGenreResult.err);
                }
            }
            else {
                throw new NotFoundError("implenentBookGenreLink() " + bookName + " not found in bookGenreLink");
            }
        }
        catch (err) {
            throw new DatabaseError("implenentBookGenreLink() " + err);
        }
    }
}

export class GenreModel extends BaseModel<Genre> {
    public constructor() {
        super(Genre)
    }

    private uniqueGenres: GenreType[] = [];

    public setUniqueGenres(set: string[]): void {
        set.forEach((name) => {
            this.uniqueGenres.push({ name })
        })
    }

    public async createAllGenres(): Promise<StdReturn<Genre[]>> {
        try {
            this.setUniqueGenres(CSVtoSQLBook.getUniqueGenres());
            if (this.uniqueGenres.length == 0) {
                throw new DatabaseError("createAllGenres() uniqueGenres is empty");
            }
            const { err, result } = await this.baseCreateMany(this.uniqueGenres, { returning: true });
            return { err, result }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("createAllGenres()" + err);
        }
    }
}

export class FormatModel extends BaseModel<Format> {

    public constructor() {
        super(Format)
    }

    private uniqueFormats: FormatType[] = [];

    public setUniqueFormats(set: string[]): void {
        set.forEach((name) => {
            this.uniqueFormats.push({ name })
        })
    }

    public async createAllFormats(): Promise<StdReturn<Format[]>> {
        try {
            this.setUniqueFormats(CSVtoSQLBook.getUniqueFormats());
            if (this.uniqueFormats.length == 0) {
                throw new DatabaseError("createAllFormats() uniqueFormats is empty");
            }
            const { err, result } = await this.baseCreateMany(this.uniqueFormats, { returning: true });
            return { err, result }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("createAllFormats()" + err);
        }
    }
}

export class AuthorModel extends BaseModel<Author> {
    public constructor() {
        super(Author)
    }

    private uniqueAuthor: AuthorType[] = [];

    public setUniqueAuthor(set: string[]): void {
        set.forEach((name) => {
            this.uniqueAuthor.push({ name })
        })
    }

    public async createAllAuthor(): Promise<StdReturn<Author[]>> {
        try {
            this.setUniqueAuthor(CSVtoSQLBook.getUniqueAuthors());
            if (this.uniqueAuthor.length == 0) {
                throw new DatabaseError("createAllAuthor() uniqueAuthor is empty");
            }
            const { err, result } = await this.baseCreateMany(this.uniqueAuthor, { returning: true });
            return { err, result }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("createAllAuthor()" + err);
        }
    }
}

