import { AuthorType, BookAuthorType, BookFormatType, BookGenreType, BookPreferenceType, BookType, FormatType, GenreType, UserBookRatingType } from "../../../types/bookTypes";
import { CSVtoSQLBook } from "../../DB_Functions/Process/CSVtoSQL";
import { DatabaseError, NotFoundError } from "../../../utils/customError";
import { BaseModel } from "../baseModel";
import StdReturn from "../../../types/baseTypes";
import { BookItem, BookAuthor, BookFormat, BookGenre, Genre, Format, Author, BookPreference, UserBookRating, User } from "../../DB_Functions/Set_Up/modelSetUp";
import crypto from 'crypto';
import { CreateUserBookRatingFormula as RatingFormula } from '../../DB_Functions/Process/userBookRatingFormula'
import { UserModel } from "../Users/userModels";

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

    public async getBookAuthors(bookID: number): Promise<StdReturn<number[]>> {
        try {
            const bookAuthorTable = new BookAuthorModel();
            const { err, result } = await bookAuthorTable.getAllBookAuthorsForSpecficBook(bookID);
            if (err) {
                throw new DatabaseError("getBookAuthors()" + err);
            }
            return { err, result: result.map((author) => author as number) }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("getBookAuthors()" + err);
        }
    }

    public async getBookFormats(bookID: number): Promise<StdReturn<number[]>> {
        try {
            const bookFormatTable = new BookFormatModel();
            const { err, result } = await bookFormatTable.getAllBookFormatsForSpecficBook(bookID);
            if (err) {
                throw new DatabaseError("getBookFormats()" + err);
            }
            return { err, result: result.map((format) => format as number) }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("getBookFormats()" + err);
        }
    }

    public async getBookGenres(bookID: number): Promise<StdReturn<number[]>> {
        try {
            const bookGenreTable = new BookGenreModel();
            const { err, result } = await bookGenreTable.getAllBookGenresForSpecficBook(bookID);
            if (err) {
                throw new DatabaseError("getBookGenres()" + err);
            }
            return { err, result: result.map((genre) => genre as number) }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("getBookGenres()" + err);
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

    public async getAllBookAuthorsForSpecficBook(bookID: number, returnIds = true): Promise<StdReturn<Author[] | number[]>> {
        try {
            const authorTable = new AuthorModel();
            const { err, result } = await this.baseFindAll({
                include: [{
                    model: BookAuthor,
                    where: { bookId: bookID },
                    attributes: []
                }]
            });
            if (returnIds) {
                return { err, result: result?.map((author) => author.authorId) }
            }

            return {
                err, result: await Promise.all(result?.map(async (author) => {
                    const { err, result } = await authorTable.find({ where: { id: author.authorId }, rejectOnEmpty: true });
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
                    model: BookFormat,
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

export class BookGenreModel extends BaseModel<BookGenre> {
    public constructor() {
        super(BookGenre)
    }

    private genreTable = new GenreModel();

    public async addBookGenreLink(bookName: string, genreName: string): Promise<void> { //TODO: abstract to baseModel
        try {
            const bookTable = new BookItemModel();
            await this.baseBookLink(bookName, genreName, this.genreTable, bookTable);
        }
        catch (err) {
            throw new DatabaseError("BookGenreModel() FUNC ERROR " + err);
        }
    }
    public async getAllBookGenresForSpecficBook(genreId: number, returnIds = true): Promise<StdReturn<Genre[] | number[]>> {
        try {
            const { err, result } = await this.baseFindAll({
                include: [{
                    model: BookGenre,
                    where: { genreId: genreId },
                    attributes: []
                }]
            });
            if (returnIds) {
                return { err, result: result?.map((genre) => genre.genreId) }
            }
            return {
                err, result: await Promise.all(result?.map(async (genre) => {
                    const { err, result } = await this.genreTable.find({ where: { id: genre.genreId }, rejectOnEmpty: true });
                    if (err) {
                        throw new DatabaseError("getAllBookGenresForSpecficBook()" + err);
                    }
                    return result;
                }))
            }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("getAllBookGenresForSpecficBook()" + err);
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

    public async createBookPreference(bookPref: BookPreferenceType): Promise<StdReturn<BookPreference>> {
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

    public getBookPreference = async (userID: number): Promise<StdReturn<BookPreference>> => {
        try {
            const { err, result } = await this.baseFindOne({ where: { userID }, rejectOnEmpty: true });
            return { err, result }
        } catch (err) {
            console.log(err)
            throw new Error("Error in getBookPreference")
        }
    }
}


export class UserBookRatingModels extends BaseModel<UserBookRating> {

    public constructor() {
        super(UserBookRating)
    }

    public async createUserRating(userRating: UserBookRatingType): Promise<StdReturn<UserBookRating>> {
        try {
            const { err, result } = await this.baseCreate(userRating);
            return { err, result }
        } catch (err) {
            console.log(err)
            throw new Error("Error in createUserRating")
        }
    }

    public async getUserRating(userId: number, bookId: number): Promise<StdReturn<UserBookRating>> {
        try {
            const { err, result } = await this.baseFindOne({ where: { userId, bookId }, rejectOnEmpty: true })
            return { err, result }
        } catch (err) {
            console.log(err)
            throw new Error("Error in getUserRating")
        }
    }

    public async updateUserRating(userRating: UserBookRatingType, userId: number, bookId: number): Promise<void> {
        try {
            await this.baseUpdate(userRating, { where: { userId, bookId } })
        } catch (err) {
            console.log(err)
            throw new Error("Error in updateUserRating")
        }
    }

    public async deleteUserRating(userId: number, bookId: number): Promise<void> {
        try {
            await this.baseDestroy({ where: { userId, bookId } })
        } catch (err) {
            console.log(err)
            throw new Error("Error in deleteUserRating")
        }
    }
    /**
     * NEEDS TESTING ]
     * 
     * @param user 
     */
    public genRatingForAllBooks = async (user: User): Promise<void> => { //TODO: test
        try {
            const bookModel = new BookItemModel()
            const bookFormula = new RatingFormula(user);

            // cycle 
            const limit = 100; // Number of rows to fetch per query
            let offset = 0;
            let books = [];
            let result: UserBookRating[] = []; // Declare a new variable to hold the result
            let book, rating; // Declare the 'rating' variable here
            // cycle Books
            do {
                const { err, result: books } = await bookModel.findMany({
                    limit, offset,
                    rejectOnEmpty: false
                });

                for (book in books) { // Assign value to 'rating' here
                    book = book as unknown as BookItem;
                    const userRating: number = await bookFormula.createUserRating(book);
                    const userBookRating: UserBookRatingType = { userId: user.id, bookId: book.id, rating: userRating }
                    const { err, result } = await this.createUserRating(userBookRating);
                }
            } while (books.length == limit); // Use rows.result.length instead of rows to check if there are more rows

            //cycle ratings for user
            do {
                const { err, result: ratings } = await this.findMany({
                    limit, offset,
                    rejectOnEmpty: false
                });
                for (rating in ratings) {
                    rating = rating as unknown as UserBookRating;
                    rating.rating = bookFormula.normaliseRating(rating.rating);
                }
            } while (result.length == limit);

        } catch (err) {
            console.log(err)
            throw new Error("Error in createOneRating")
        }
    }
}
