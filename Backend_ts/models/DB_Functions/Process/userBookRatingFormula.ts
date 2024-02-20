import { TempUserType, UserPreferenceType } from '../../../types/userType';
import { BookType, BookPreferenceType } from '../../../types/bookTypes';
import { UserModel, UserPreferenceModel } from '../../typesOfModels/Users/userModels';
import { AuthorModel, BookItemModel as BookModel, BookPreferenceModel, FormatModel, GenreModel } from '../../typesOfModels/Items/bookModel';
import { User, BookItem as Book } from '../Set_Up/modelSetUp';

// TODO: 1) Add userRating Table to db 
// 2) Perform create user rating for each user
// 3) before moving to next user normalise scores

export class CreateUserBookRatingFormula { // needs to be done for each user
    private lowestScore: number = Infinity;
    private highestScore: number = -Infinity;
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

    public async createUserRating(book: Book): Promise<number> {
        let score = 0;
        const userModel = new UserModel();
        const bookModel = new BookModel();

        const genreModel = new GenreModel();
        const formatModel = new FormatModel();
        const authorModel = new AuthorModel();

        const bookAuthors = await bookModel.getBookAuthors(book.id);
        const bookFormats = await bookModel.getBookFormats(book.id);
        const bookGenres = await bookModel.getBookGenres(book.id);


        const bookPrefModel = new BookPreferenceModel();
        const userPrefModel = new UserPreferenceModel();

        // Book Meta-Data
        const bookGenresArrReturn = await bookModel.getBookGenres(book.id);
        const bookFormatsArrReturn = await bookModel.getBookFormats(book.id);
        const bookAuthorsArrReturn = await bookModel.getBookAuthors(book.id);


        // get user preference
        const userPrefReturn = await userPrefModel.getUserPreference(this.user.id);
        // get book preference
        const bookPrefReturn = await bookPrefModel.getBookPreference(book.id);
        const userGenresPref = bookPrefReturn.result.genrePreference;
        const userFormatsPref = bookPrefReturn.result.formatPreference;
        const userAuthorsPref = bookPrefReturn.result.authorPreference;

        if (userPrefReturn.err || bookPrefReturn.err) {
            throw new Error("Error in createUserRating");
        }
        const userPref: UserPreferenceType = userPrefReturn.result!;
        const bookPref: BookPreferenceType = bookPrefReturn.result!;


        // Rating Impact
        const ratingImpact = Math.log10(book.numOfVoters + 1);
        score += book.rating * ratingImpact;

        // book genre match
        // for each match add x to score (may)


        // lazly converting id's to name

        bookGenresArrReturn.result.forEach(async (genrePref) => {
            const { err, result } = await genreModel.find({ where: { id: genrePref }, rejectOnEmpty: true });
            if (userGenresPref.includes(result.name)) {
                score += 10;
            }
        });
        // book format match
        // for each match add x to score (may )


        bookFormatsArrReturn.result.forEach(async (formatPref) => {
            const { err, result } = await formatModel.find({ where: { id: formatPref }, rejectOnEmpty: true });
            if (userFormatsPref.includes(result.name)) {
                score += 10;
            }
        });

        // book author match
        // for each match add x to score (may ) // TODO: author match using arrs

        bookAuthorsArrReturn.result.forEach(async (authorPref) => {
            const { err, result } = await authorModel.find({ where: { id: authorPref }, rejectOnEmpty: true });
            if (userAuthorsPref.includes(result.name)) {
                score += 10;
            }
        });

        if (this.lowestScore > score) {
            this.lowestScore = score;
        }
        if (this.highestScore < score) {
            this.highestScore = score;
        }
        return score;
    }



    public normaliseRating(x: number, min = this.lowestScore, max = this.highestScore): number {
        return (x - min) / (max - min);
    }
}
