"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserBookRating = void 0;
// TODO: 1) Add userRating Table to db 
// 2) Perform create user rating for each user
// 3) before moving to next user normalise scores
class CreateUserBookRating {
    constructor() {
        this.lowestScore = Infinity;
        this.highestScore = -Infinity;
    }
    getLowestScore() {
        return this.lowestScore;
    }
    getHighestScore() {
        return this.highestScore;
    }
    // 1 keep track of non-normalised scores
    // 2 only at then end with last lowest and hightest Score normalise scores
    createUserRating(user, userPref, book, bookPref) {
        let score = 0;
        // length match // TODO: user preference needs length match options
        // Rating Impact
        const ratingImpact = Math.log10(book.numOfVoters + 1);
        score += book.rating * ratingImpact;
        // book genre match
        // for each match add x to score (may )
        if (bookPref.genrePreference) {
            bookPref.genrePreference.forEach((genrePref) => {
                if (book.genres.includes(genrePref)) {
                    score += 10;
                }
            });
        }
        // book format match
        // for each match add x to score (may )
        if (bookPref.formatPreference) {
            bookPref.formatPreference.forEach((formatPref) => {
                if (book.format.includes(formatPref)) {
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
    normaliseScore(x, min = this.lowestScore, max = this.highestScore) {
        return (x - min) / (max - min);
    }
}
exports.CreateUserBookRating = CreateUserBookRating;
