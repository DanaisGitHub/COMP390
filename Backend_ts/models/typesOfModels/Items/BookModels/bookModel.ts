import { AuthorType, BookAuthorType, BookFormatType, BookGenreType, BookPreferenceType, BookItemType, FormatType, GenreType, UserBookRatingType } from "../../../../types/DBTypes/BookTypes/bookTypes";
import { CSVtoSQLBook } from "../../../DB_Functions/Process/CSVtoSQL";
import { DatabaseError, NotFoundError } from "../../../../utils/other/customError";
import { BaseModel, BaseBookAttributesModel, BaseAttributeModel } from "../../baseModel";
import StdReturn from "../../../../types/baseTypes";
import { BookItem, BookAuthor, BookFormat, BookGenre, Genre, Format, Author, BookPreference, UserBookRating, User, UserItem } from "../../../DB_Functions/Set_Up/modelSetUp";
import crypto from 'crypto';
import { CreateUserBookRatingFormula as RatingFormula } from '../../../DB_Functions/Process/userBookRatingFormula'
import { UserModel } from "../../Users/userModels";
import { where } from "sequelize";
import { BookAuthorModel, AuthorModel } from "./AuthorModels/AuthorModels";
import { BookFormatModel, FormatModel } from "./FormatModels/FormatModel";
import { BookGenreModel, GenreModel } from "./GenreModels/GenreModels";
import { randomDate, randomDateRange, randomNumber, randomRange } from '../../../../utils/other/random'
import { calculateDistance } from '../../../../utils/locationUtils'
import { ProductDetailsType, ProductPreviewType } from "../../../../types/Product/ProductsTy";
import { UserItemModel } from "../UserItemModel";
import { FullBookDetails, FullBookDetail } from '../../../../types/API_Types/Book/BookApiTypes' // 
import getRankedBooks from '../../../../API/pyAPI';





export class BookItemModel extends BaseModel<BookItem> { // BookItem should really extend itemModel, and item 
    public constructor() {
        super(BookItem)
    }

    public async getFullBookDetailsForBookID(bookID: number, options?: { ownerID: number, rating: number }): Promise<any> {
        try {
            const [result, metadata] = await this.model.sequelize!.query(`	SELECT 
            b.id AS book_id,
            b.series,
            b.book,
            b.description,
            b.numPages,
            b.publication,
            b.rating,
            b.numOfVoters,
            GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') AS authors,
            GROUP_CONCAT(DISTINCT f.name SEPARATOR ', ') AS formats,
            GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres
        FROM 
            BookItems b
        LEFT JOIN BookAuthors ba ON b.id = ba.bookId
        LEFT JOIN Authors a ON ba.authorId = a.id
        LEFT JOIN BookFormats bf ON b.id = bf.bookId
        LEFT JOIN Formats f ON bf.formatId = f.id
        LEFT JOIN BookGenres bg ON b.id = bg.bookId
        LEFT JOIN Genres g ON bg.genreId = g.id
        WHERE b.id = ${bookID}`);
            const fullBook: FullBookDetails = result[0] as FullBookDetails;

            return fullBook;
        } catch (err: any) {
            console.log(err as Error)
            if (err instanceof NotFoundError) {
                throw err;
            }
            throw new DatabaseError("getFullBookDetailsForBookID()" + err.message);
        }
    }


    public async findAllBooksForIDs(bookIDs: number[]): Promise<BookItem[]> {
        try {
            let books: BookItem[] = [];
            for (let id in bookIDs) {
                const { err, result: book } = await this.baseFindOne({ where: { id }, rejectOnEmpty: false });
                if (!book) {
                    throw new NotFoundError("Book not found")
                }
                books.push(book);
            }
            return books;
        } catch (err) {
            console.log(err)
            throw new DatabaseError("findAllBooksForIDs()" + err);
        }
    }

    private async fullTextSearch(minRating: number, maxPrice: number, searchQuery: string | undefined): Promise<ProductPreviewType[]> {
        try {

            console.log("searchQuery: ", searchQuery)
            let search = searchQuery !== undefined ? `MATCH(bk.book, bk.description) AGAINST('${searchQuery}' IN NATURAL LANGUAGE MODE) AND ` : "";

            //= searchQuery.length !== 0 ? `MATCH(bk.book, bk.description) AGAINST('${searchQuery}' IN NATURAL LANGUAGE MODE) AND ` : "";
            // why does the query have so many types
            const query = `SELECT 
            bk.id AS bookID, 
            bk.series, 
            bk.book,
            bk.description, 
            bk.numPages, 
            bk.publication, 
            bk.rating AS preRating, 
            ui.price, 
            usr.lat, 
            usr.lng, 
            usr.id AS ownerID
          FROM 
            BookItems bk
          JOIN 
            UserItems ui ON bk.id = ui.ItemID
          JOIN 
            Users usr ON ui.OwnerID = usr.id
          WHERE 
            ${search} bk.rating >= ${minRating}
            AND ui.price <= ${maxPrice}
          ORDER BY 
            bk.rating DESC, 
            ui.price ASC;`
            const [result, metadata] = await this.model.sequelize!.query(query); // maybe wrong, we need sequelize instance

            // const books: ProductPreviewType[] = result[0].map((book: any) => {
            //     return {
            //         itemID: book.bookID,
            //         book: book.book,
            //         series: book.series,
            //         description: book.description,
            //         numPages: book.numPages,
            //         publication: book.publication,
            //         rating: book.preRating,
            //         price: book.price,
            //         lat: book.lat,
            //         lng: book.lng,
            //         ownerID: book.ownerID
            //     }
            // });

            const books: ProductPreviewType[] = result.map((book: any) => {
                return {
                    itemID: book.bookID,
                    book: book.book,
                    ranking_of_book: book.preRating,
                    lat: book.lat,
                    lng: book.lng,
                    ownerID: book.ownerID
                }
            });
            return books // no rating
        }
        catch (err: any) {
            console.error(err)
            throw new DatabaseError("fullTextSearch()" + err.message);
        }
    }



    public async getRankedBooksWithinRadiusAndSearchQuery(options: {
        lat: number,
        lng: number,
        maxDistance: number,
        searchQuery?: string,
        minRating: number,
        maxPrice: number,
        userID: number
        userSex: number,
    }): Promise<ProductPreviewType[]> {
        try {
            let rankedBooks: ProductPreviewType[] = [];
            const { lat, lng, maxDistance, searchQuery, minRating, maxPrice, userID, userSex } = options;

            const books: ProductPreviewType[] = await this.fullTextSearch(minRating, maxPrice, searchQuery ? searchQuery : undefined);
            const booksWithinRadius: ProductPreviewType[] = books.filter(book => {
                return calculateDistance(lat, lng, book.lat!, book.lng!)
                    <= maxDistance
            });
            let bookIDsNumber: number[] = booksWithinRadius.map(book => book.itemID);
            const bookTitles = booksWithinRadius.map(book => book.book);
            const bookIDsStr: string[] = bookIDsNumber.map(id => id.toString());
            if (bookIDsStr.length === 0) {
                return [];
            }
            //SEND TO PYTHON FOR RANKING.
            const rankings = await getRankedBooks(userID, userSex, bookIDsNumber, bookTitles);
            const booksWithinRandRanked = booksWithinRadius.map((book, index) => {
                return { ...book, ranking_we_think: parseFloat(rankings[index]) }
            });

            return booksWithinRandRanked
        }
        catch (err: any) {
            if (err instanceof NotFoundError) {
                console.error(err)
                throw err;
            }
            else if (err instanceof DatabaseError) {
                console.error(err)
                throw err;
            }
            else {
                console.error(err)
                throw new Error("getRankedBooksWithinRadiusAndSearchQuery()" + err.message);
            }
        }
    }

    public async getAllAuthorsForBookID(bookID: number): Promise<StdReturn<number[]>> {
        try {
            const bookAuthorTable = new BookAuthorModel();
            const { err, result } = await bookAuthorTable.getAllBookAttributesForSpecficBook(bookID);
            if (err) {
                throw new DatabaseError("getBookAuthors()" + err);
            }
            return { err, result: result.map((author: any) => author as number) }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("getBookAuthors()" + err);
        }
    }

    public async getAllGenresForBookID(bookID: number): Promise<StdReturn<number[]>> {
        try {
            const bookGenreTable = new BookGenreModel();
            const { err, result } = await bookGenreTable.getAllBookAttributesForSpecficBook(bookID);
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

    public async addBookItem(book: BookItemType): Promise<StdReturn<BookItem>> {
        try {
            book.publication = undefined;

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

    public createRandomBookPreference = async (userID: number): Promise<void> => { //TODO: Actually link 
        try {
            let authorPreference: Set<number> = new Set<number>();
            let genrePreference: Set<number> = new Set<number>();
            let formatPreference: Set<number> = new Set<number>();

            const authorUpper = await new AuthorModel().count({});
            const genreUpper = await new GenreModel().count({});
            const formatUpper = await new FormatModel().count({});
            const attributeArray = [authorUpper, genreUpper, formatUpper];
            const prefArray = [authorPreference, genrePreference, formatPreference];
            // random loop
            let numOfPref: number, dbUpperBound: number, i: number, j: number;
            for (i = 0; i < 3; i++) {
                numOfPref = Math.random() * attributeArray[i];// upto 10 random preferences
                for (j = 0; j < numOfPref; j++) {
                    dbUpperBound = attributeArray[i] - 1;
                    prefArray[i].add((Math.floor(Math.random() * dbUpperBound)) + 1);
                }
            }


            // random assignment // need upbound for assignment
            const { min: ranPublicationMin, max: ranPublicationMax } = randomDateRange(new Date(1920, 1, 1), new Date());
            const { min: ranlengthMin, max: ranlengthMax } = randomRange(0, 5000, false);

            const bookPreference: BookPreferenceType = {
                userID,
                authorPreference: Array.from(authorPreference),
                genrePreference: Array.from(genrePreference),
                formatPreference: Array.from(formatPreference),
                publicationRangeMin: ranPublicationMin,
                publicationRangeMax: ranPublicationMax,
                bookLengthRangeMin: ranlengthMin,
                bookLengthRangeMax: ranlengthMax

            }
            await this.createBookPreference(bookPreference);
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

    public async getUserRating(userID: number, bookID: number): Promise<StdReturn<UserBookRating>> {
        try {
            const { err, result } = await this.baseFindOne({ where: { userID, bookID }, rejectOnEmpty: true })
            return { err, result }
        } catch (err) {
            console.log(err)
            throw new Error("Error in getUserRating")
        }
    }

    public async updateUserRating(userRating: UserBookRatingType, userID: number, bookID: number): Promise<void> {
        try {
            await this.baseUpdate(userRating, { where: { userID, bookID } })
        } catch (err) {
            console.log(err)
            throw new Error("Error in updateUserRating")
        }
    }

    public async deleteUserRating(userID: number, bookID: number): Promise<void> {
        try {
            await this.baseDestroy({ where: { userID, bookID } })
        } catch (err) {
            console.log(err)
            throw new Error("Error in deleteUserRating")
        }
    }
    /**
     * NEEDS TESTING 
     * 
     * @param user 
     */
    public genRatingForAllBooks = async (user: User): Promise<void> => { //TODO: test
        try {
            const bookModel = new BookItemModel()
            const bookFormula = new RatingFormula(user);
            const userRatingModel = new UserBookRatingModels();
            // cycle // lets do the same for UserItems
            const createRatingFunc = async (eachBook: BookItem) => {
                const book = eachBook.dataValues;
                const userRating: number = await bookFormula.createUserRating(book!);
                const userBookRating: UserBookRatingType = { userID: user.id, bookID: book.id!, rating: userRating }
                const { err, result } = await this.createUserRating(userBookRating);
            }
            const waiting = await bookModel.performOnAllRows(createRatingFunc);
            //let min, max;
            //const normaliseRating = async (eachRating: UserBookRating) => {
            //    const rating = eachRating.dataValues;
            //    min = await userRatingModel.getMinRating(rating.userID);
            //    max = await userRatingModel.getMaxRating(rating.userID);
            //    rating.rating = bookFormula.normaliseRating(rating.rating, min, max);
            //    await this.updateUserRating(rating, rating.userID, rating.bookID);
            //}
            //await userRatingModel.performOnAllRows(normaliseRating)
        } catch (err) {
            console.log(err)
            throw new Error("Error in createOneRating")
        }
    }


    // public async normaliseAllRatings = async (userID: number): Promise<void> => {
    //     const bookModel = new BookItemModel()
    //     const userRatingModel = new UserBookRatingModels();
    //     let min, max ;
    //     const normaliseRating = async (eachRating: UserBookRating) => {
    //         const rating = eachRating.dataValues;
    //         min = await userRatingModel.getMinRating(rating.userID);
    //         max = await userRatingModel.getMaxRating(rating.userID);
    //         rating.rating = bookFormula.normaliseRating(rating.rating, min, max);
    //         await this.updateUserRating(rating, rating.userID, rating.bookID);
    //     }
    //     await userRatingModel.performOnAllRows(normaliseRating)


    // }

    /**
     * Gets the max rating for a whole table or for a specific user and or book
     * 
     * @param userID 
     * @param bookID 
     * @returns 
     */
    public async getMaxRating(userID?: number): Promise<number> {
        try {
            const options = userID ? { where: { userID } } : {};
            const result = await this.model.max("rating", options);
            //const some = await this.model.sync();

            if (result === null) {
                throw new NotFoundError("No max value found");
            }
            return result as number;
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("getMaxValue()" + err);
        }
    }

    public async getMinRating(userID?: number): Promise<number> {
        try {
            let found = false;
            let result = null;
            do {
                const options = userID ? { where: { userID } } : {};
                result = await this.model.min("rating", options);
                console.log("result: ", result);
                if (result === null) {
                    console.log(userID)
                    continue;
                }
                found = true;

            } while (found === false)

            return result as number;
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("getMinValue()" + err);
        }
    }
}



