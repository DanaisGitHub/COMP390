import { TempUserType, UserPreferenceType } from '../../../types/DBTypes/UserTypes/userTypes';
import { BookItemType, BookPreferenceType } from '../../../types/DBTypes/BookTypes/bookTypes';
import { UserModel, UserPreferenceModel } from '../../typesOfModels/Users/userModels';
import { BookItemModel as BookModel, BookPreferenceModel, } from '../../typesOfModels/Items/BookModels/bookModel';
import { GenreModel } from '../../typesOfModels/Items/BookModels/GenreModels/GenreModels';
import { FormatModel } from '../../typesOfModels/Items/BookModels/FormatModels/FormatModel';
import { AuthorModel } from '../../typesOfModels/Items/BookModels/AuthorModels/AuthorModels';

import { User, BookItem as Book } from '../Set_Up/modelSetUp';

// TODO: 1) Add userRating Table to db 
// 2) Perform create user rating for each user
// 3) before moving to next user normalise scores

export class CreateUserBookRatingFormula { // needs to be done for each user
    private lowestScore: number = 40000;

    private highestScore: number = -40000;

    public getLowestScore(): number {
        return this.lowestScore;
    }
    public getHighestScore(): number {
        return this.highestScore;
    }

    private user: User;
    constructor(user: User) {
        this.user = user;
    }


    // 1 keep track of non-normalised scores
    // 2 only at then end with last lowest and hightest Score normalise scores

    /**
     * For each book, calulate the user rating
     * 
     * @param book the book
     * @returns the user rating
     */
    public async createUserRating(book: BookItemType): Promise<number> { //book = 0 coming in 
        try {
            let score = 1;
            const userModel = new UserModel();
            const bookModel = new BookModel();
            const genreModel = new GenreModel();
            const formatModel = new FormatModel();
            const authorModel = new AuthorModel();
            const bookPrefModel = new BookPreferenceModel();
            const userPrefModel = new UserPreferenceModel();

            // Book Meta-Data
            // book.id = undefined
            //const bookFormatsArrReturn = await bookModel.getBookFormats(book.id!);// book.id = undefined
            //const bookAuthorsArrReturn = await bookModel.getBookAuthors(book.id!);// book.id = undefined


            // get user preference
            const userPrefReturn = await userPrefModel.getUserPreference(this.user.id);
            // get book preference
            const { err: bookPrefErr, result: bookPref } = await bookPrefModel.getBookPreference(this.user.id); // wrong id
            const userFormatsPref = bookPref.formatPreference;
            const userAuthorsPref = bookPref.authorPreference; // TODO: author match using arrs

            if (bookPrefErr) {
                throw new Error("Error in createUserRating");
            }
            const userPref: UserPreferenceType = userPrefReturn.result!;


            // Rating Impact
            const randomImpact = Math.random()
            const ratingImpact = Math.log10(book.numOfVoters + 1);
            score += book.rating * ratingImpact * randomImpact;

            // REMEMBER bookPref = bookPreference set by user

            const userBookGenrePrefArr = bookPref.genrePreference; // 
            const { err, result: bookGenresArr } = await bookModel.getAllGenresForBookID(book.id!); //just getting the same number/id mutliple times eg [1,1,1,1,1,1,1,1]
            //console.log("bookGenresArrReturn: ", bookGenresArr);
            bookGenresArr.map(async (genrePref) => {
                const { err, result: genre } = await genreModel.find({ where: { id: genrePref }, rejectOnEmpty: true }); // ensures genre exists
                if (userBookGenrePrefArr.includes(genre.id!)) {
                    score += 1;
                }
            });

            const userBookAuthorPrefArr = bookPref.authorPreference; //
            const { err: authorErr, result: bookAuthorsArr } = await bookModel.getAllAuthorsForBookID(book.id!);
            bookAuthorsArr.map(async (authorPref) => {
                const { err, result: author } = await authorModel.find({ where: { id: authorPref }, rejectOnEmpty: true });
                if (userBookAuthorPrefArr.includes(author.id!)) {
                    score += 1;
                }
            });


            if (this.lowestScore === 40000) {
                this.lowestScore = score;
            }
            if (this.highestScore === -40000) {
                this.highestScore = score;
            }
            if (this.lowestScore > score) {
                this.lowestScore = score;
            }
            if (this.highestScore < score) {
                this.highestScore = score;
            }
            if (score === Infinity || score === -Infinity) {
                score = 0;
            }
            return score ? score : 0;
            
        } catch (err) {
            console.log(err);
            throw new Error("Error in createUserRating");
        }
    }



    public normaliseRating(x: number, min: number, max: number): number {
        console.log("x: ", x);
        console.log("min: ", min);
        console.log("max: ", max);

        const result = ((x - min) / (max - min) * 5).toFixed(2) as unknown as number;
        if (result === Infinity || result === -Infinity) {
            return 0;
        }
        return result
    }
}

export class CreateUserBookRatingFormula2 { // needs to be done for each use



    public normaliseRating(x: number, min: number, max: number): number {
        console.log("x: ", x);
        console.log("min: ", min);
        console.log("max: ", max);

        const result = ((x - min) / (max - min) * 5).toFixed(2) as unknown as number;
        if (result === Infinity || result === -Infinity) {
            return 0;
        }
        if (result >= 5) {
            return 5;
        }
        if (result <= 0) {
            return 0;
        }

        return result
    }
}

