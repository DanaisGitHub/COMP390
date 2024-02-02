// have a good feeling this needs to be file stream (Too big for memory)

import csvtojson from 'csvtojson';
const csvFilePath = '../Backend_py/DataSource/first10s.csv';
import { BookType, BookTypeRaw } from '../types/bookTypes';
import { BookGenreModel, BookItemModel, GenreModel, FormatModel, AuthorModel, BookAuthorModel, BookFormatModel } from './typesOfModels/bookModel';
import { GenreType, FormatType, AuthorType } from '../types/bookTypes';

class ReadCSV {
    public static async readaSync(): Promise<BookTypeRaw[]> {
        const csv = csvtojson;
        const jsonArray: BookTypeRaw[] = await csv().fromFile(csvFilePath);
        return jsonArray;
    }

    public static convertStringToArray(string: string): string[] {
        let array: string[] = [];
        string = string.replace(/[\[\]']+/g, ''); // remove brackets from string
        string = string.replace(/['"]+/g, ''); // remove quotes from string
        string = string.replace(/(^\s+|\s+$)+/g, '');
        array = string.split(',');
        for (let i = 0; i < array.length; i++) {
            array[i] = array[i].trim();
        }
        return array;
    }
    public static cleanString(string: string): string {
        string = string.replace(/[\[\]']+/g, ''); // remove brackets from string
        string = string.replace(/(^\s+|\s+$)+/g, ''); // removes whitespace aka trim()
        string = string.replace(/[\n]+/g, ''); // removes \n
        return string;
    }



}// might make singleton





export class CSVtoSQLBook { // might make singleton

    private static uniqueFormats = new Set<string>();
    private static uniqueGenres = new Set<string>();
    private static uniqueAuthors = new Set<string>();

    private static bookFormatLink = new Map<string, string[]>();
    private static bookGenreLink = new Map<string, string[]>();
    private static bookAuthorLink = new Map<string, string[]>();

    private static setIntoArray(set: Set<string>): string[] {
        const array = Array.from(set).map((str) => {
            return str;
        })
        return array;
    }

    protected static convertValues(bookRawArray: BookTypeRaw[]): BookType[] {
        let returnValue: BookType[] = [];
        bookRawArray.forEach(rawBook => {
            const tempBookType: BookType = {
                book: rawBook.book ?? "",
                series: rawBook.series ?? "",
                releaseNumber: Number.isNaN(parseInt(rawBook.releaseNumber)) ? -2 : parseInt(rawBook.releaseNumber) ?? -1, // value = NaN
                author: rawBook.author ?? "",
                description: ReadCSV.cleanString(rawBook.description) ?? "", // contains \n
                numPages: parseInt(rawBook.numPages) ?? 0,
                format: ReadCSV.convertStringToArray(rawBook.format) ?? [],
                genres: ReadCSV.convertStringToArray(rawBook.genres) ?? [],
                publication: new Date(rawBook.publication) ?? new Date("01-01-1970"), // could be dated better
                rating: Number.isNaN(parseFloat(rawBook.rating)) ? parseFloat(rawBook.rating) : 0 ?? 0.0,
                numberOfVoters: parseInt(rawBook.numberOfVoters) ?? 0
            }
            returnValue.push(tempBookType);

            // get unique values for format, genres, and authors
            tempBookType.format.forEach((format) => {
                this.uniqueFormats.add(format);
                console.log(format);
            })

            tempBookType.genres.forEach((genre) => {
                this.uniqueGenres.add(genre);
            })
            this.uniqueAuthors.add(tempBookType.author);


            this.bookGenreLink.set(tempBookType.book, tempBookType.genres); // starting the link to the other tables
            this.bookFormatLink.set(tempBookType.book, tempBookType.format);
            this.bookAuthorLink.set(tempBookType.book, [tempBookType.author]);
        })
        return returnValue;
    }



    // getters
    public static getUniqueFormats(): string[] {
        return this.setIntoArray(this.uniqueFormats);
    }
    public static getUniqueGenres(): string[] {
        return this.setIntoArray(this.uniqueGenres);
    }
    public static getUniqueAuthors(): string[] {
        return this.setIntoArray(this.uniqueAuthors);
    }

    public static getBookFormatLink(): Map<string, string[]> {
        return this.bookFormatLink;
    }
    public static getBookGenreLink(): Map<string, string[]> {
        return this.bookGenreLink;
    }
    public static getBookAuthorLink(): Map<string, string[]> {
        return this.bookAuthorLink;
    }


    //badCoding but it works
    public static setGenreLink(): void {
        const genreModel = new GenreModel();
        const bookGenreModel = new BookGenreModel();
        genreModel.setUniqueGenres(this.getUniqueGenres());
        bookGenreModel.setBookGenreLink(this.getBookGenreLink());
    }

    public static setFormatLink(): void {
        const formatModel = new FormatModel();
        const bookFormatModel = new BookFormatModel();
        formatModel.setUniqueFormats(this.getUniqueFormats());
        bookFormatModel.setBookFormatLink(this.getBookFormatLink());
    }

    public static setAuthorLink(): void {
        const authorModel = new AuthorModel();
        const bookAuthorModel = new BookAuthorModel();
        authorModel.setUniqueAuthor(this.getUniqueAuthors());
        bookAuthorModel.setBookAuthorLink(this.getBookAuthorLink());
    }



    public static async run(): Promise<BookType[]> {
        const rawBookArray = await ReadCSV.readaSync();
        const bookArray = this.convertValues(rawBookArray);
        this.setGenreLink();
        this.setFormatLink();
        this.setAuthorLink();



        return bookArray;
    }

}








