import { AuthorType, BookAuthorType, BookFormatType, BookGenreType, BookPreferenceType, BookType, FormatType, GenreType, UserBookRatingType } from "../../../../types/DBTypes/BookTypes/bookTypes";
import { CSVtoSQLBook } from "../../../DB_Functions/Process/CSVtoSQL";
import { DatabaseError, NotFoundError } from "../../../../utils/other/customError";
import { BaseModel, BaseBookAttributesModel, BaseAttributeModel } from "../../baseModel";
import StdReturn from "../../../../types/baseTypes";
import { BookItem, BookAuthor, BookFormat, BookGenre, Genre, Format, Author, BookPreference, UserBookRating, User } from "../../../DB_Functions/Set_Up/modelSetUp";
import crypto from 'crypto';
import { CreateUserBookRatingFormula as RatingFormula } from '../../../DB_Functions/Process/userBookRatingFormula'
import { UserModel } from "../../Users/userModels";
import { where } from "sequelize";
import { BookAuthorModel, AuthorModel } from "./AuthorModels/AuthorModels";
import { BookFormatModel, FormatModel } from "./FormatModels/FormatModel";
import { BookGenreModel, GenreModel } from "./GenreModels/GenreModels";
import { randomDate, randomDateRange, randomNumber, randomRange } from '../../../../utils/other/random'
import { calculateDistance } from '../../../../utils/locationUtils'
import { ProductPreview } from "../../../../types/Product/ProductsTy";


export class BookItemModel extends BaseModel<BookItem> { // BookItem should really extend itemModel, and item 
    public constructor() {
        super(BookItem)
    }

    // public async getFullBookDetailsForBookId(bookID: number): Promise<StdReturn<BookItem>> {
    //     try {
    //         const { err, result:bookBasicDetails } = await this.baseFindOne({ where: { id: bookID }, rejectOnEmpty: true }); // we didn't do assossiations properly here
    //         bookBasicDetails.;
    //         const fullBookDetails = {
    //             id:,
    //             book_title: ,
    //             series:,
    //             description:,
    //             numPages:,
    //             publication:,
    //             preRating:,
    //             author:,
    //             genres:,
    //             format:,
                
    //         }
    //         return { err, result }
    //     }
    //     catch (err) {
    //         console.log(err)
    //         throw new DatabaseError("getAllBookDetailsForBookId()" + err);
    //     }
    // }

    private async fullTextSearch(searchQuery: string): Promise<BookItem[]> {
        try {
            const query = `SELECT * FROM bookitems WHERE MATCH(title, description) 
            AGAINST('${searchQuery}' IN NATURAL LANGUAGE MODE);`
            const result = await this.model.sequelize!.query(query); // maybe wrong, we need sequelize instance
            return result[0] as BookItem[]
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("fullTextSearch()" + err);
        }
    }

    private async pyRankBooks(books: BookItem[]): Promise<ProductPreview[]> {
        // send to python for ranking
        return [];
    }

    public async findAllBooksWithinRadiusAndSearchQuery(
        location: { lat: number, lng: number },
        maxDistance: number,
        searchQuery: string): Promise<ProductPreview[]> {
        try {
            const userModel = new UserModel()
            const serchedBooks = await this.fullTextSearch(searchQuery);
            const booksWithinRadius = serchedBooks.filter(async (book) => { // book might
                // find out who owns the book
                const { err, result: user } = await userModel.findByPkey(book.ownerId);
                const bookLat = user.dataValues.lat;
                const bookLong = user.dataValues.lng;
                const distance = calculateDistance(location.lat, location.lng, bookLat, bookLong);
                return distance <= maxDistance;
            })
            // now send to python for ranking
            const rankedBooks = await this.pyRankBooks(booksWithinRadius);
            return rankedBooks
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("findAllBooksWithinRadius()" + err);
        }
    }

    public async getAllAuthorsForBookId(bookID: number): Promise<StdReturn<number[]>> {
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

    public async getAllGenresForBookId(bookID: number): Promise<StdReturn<number[]>> {
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
     * NEEDS TESTING 
     * 
     * @param user 
     */
    public genRatingForAllBooks = async (user: User): Promise<void> => { //TODO: test
        try {
            const bookModel = new BookItemModel()
            const bookFormula = new RatingFormula(user);
            const userRatingModel = new UserBookRatingModels();


            // cycle 
            const createRatingFunc = async (eachBook: BookItem) => {
                const book = eachBook.dataValues;
                const userRating: number = await bookFormula.createUserRating(book!);
                const userBookRating: UserBookRatingType = { userId: user.id, bookId: book.id!, rating: userRating }
                const { err, result } = await this.createUserRating(userBookRating);
            }



            // cycle Books
            const waiting = await bookModel.performOnAllRows(createRatingFunc);



            let min = await userRatingModel.getMinRating(user.id);
            let max = await userRatingModel.getMaxRating(user.id);

            const normaliseRating = async (eachRating: UserBookRating) => {
                const rating = eachRating.dataValues;
                let min = await userRatingModel.getMinRating(rating.userId);
                let max = await userRatingModel.getMaxRating(rating.userId);
                rating.rating = bookFormula.normaliseRating(rating.rating, min, max);
                await this.updateUserRating(rating, rating.userId, rating.bookId);
            }

            await userRatingModel.performOnAllRows(normaliseRating)
        } catch (err) {
            console.log(err)
            throw new Error("Error in createOneRating")
        }
    }

    /**
     * Gets the max rating for a whole table or for a specific user and or book
     * 
     * @param userId 
     * @param bookId 
     * @returns 
     */
    public async getMaxRating(userId?: number): Promise<number> {
        try {
            const result = await this.model.max("rating", { where: { userId } });
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

    public async getMinRating(userId?: number): Promise<number> {
        try {
            let found = false;
            let result = null;
            do {
                result = await this.model.min("rating", { where: { userId } });
                console.log("result: ", result);
                if (result === null) {
                    console.log(userId)
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
