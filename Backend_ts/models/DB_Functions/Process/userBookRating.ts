import { TempUserType, UserPreferenceType } from '../../../types/userType';
import { BookType, BookPreferenceType } from '../../../types/bookTypes';

// TODO: 1) Add userRating Table to db 
// 2) Perform create user rating for each user
// 3) before moving to next user normalise scores

export class CreateUserBookRating {

    private lowestScore: number = Infinity;
    private highestScore: number = -Infinity;


    public getLowestScore(): number {
        return this.lowestScore;
    }
    public getHighestScore(): number {
        return this.highestScore;
    }
    // 1 keep track of non-normalised scores
    // 2 only at then end with last lowest and hightest Score normalise scores

    public createUserRating(user: TempUserType,
        userPref: UserPreferenceType,
        book: BookType, bookPref:
            BookPreferenceType): number {
        let score = 0;

        // length match // TODO: user preference needs length match options


        // Rating Impact
        const ratingImpact = Math.log10(book.numOfVoters + 1);
        score += book.rating * ratingImpact;

        // book genre match
        // for each match add x to score (may )
        if (bookPref.genrePreference) {
            bookPref.genrePreference.forEach((genrePref) => {
                if (book.genres!.includes(genrePref)) {
                    score += 10;
                }
            });
        }
        // book format match
        // for each match add x to score (may )

        if (bookPref.formatPreference) {
            bookPref.formatPreference.forEach((formatPref) => {
                if (book.format!.includes(formatPref)) {
                    score += 10;
                }
            });
        }

        // book author match
        // for each match add x to score (may ) // TODO: author match using arrs
        if (bookPref.authorPreference && book.author) {
            bookPref.authorPreference.forEach((authorPref) => {
                if (book.author === authorPref) {
                    score += 10;
                }
            });
        }

        if (this.lowestScore > score) {
            this.lowestScore = score;
        }
        if (this.highestScore < score) {
            this.highestScore = score;
        }
        return score;
    }

    public normaliseScore(x: number, min = this.lowestScore, max = this.highestScore): number {
        return (x - min) / (max - min);
    }
}
