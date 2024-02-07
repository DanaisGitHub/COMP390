// have a good feeling this needs to be file stream (Too big for memory)
import fs from 'fs';
import csvtojson from 'csvtojson';
import csvParser from 'csv-parser';
const csvFilePath = '../Backend_py/DataSource/first10s.csv';
import { BookType, BookTypeRaw } from '../types/bookTypes';
import { BookGenreModel, BookItemModel, GenreModel, FormatModel, AuthorModel, BookAuthorModel, BookFormatModel } from './typesOfModels/bookModel';
import { GenreType, FormatType, AuthorType } from '../types/bookTypes';

// need to do this as a stream

class ReadCSV {
    public static async readAsync(): Promise<void> {
        try {
            const csv = csvtojson;
            const csvStream = fs.createReadStream(csvFilePath, { encoding: 'utf8' }); // each row  // remove duplicates
            csvStream.pipe(csvParser())
                .on('data', async (row) => {
                    await CSVtoSQLBook.processEachRow(row); // not read properly 

                })
                .on('end', function () {
                    console.log('All Data loaded')
                });

        } catch (error) {
            console.log(error);
            throw new Error("Error in CSVtoSQLBook.readAsync " + error);
        }

    }

}


export class CSVtoSQLBook { // might make singleton



    private static dateProcessor(date: string): Date {
        const dateArray = date.split(" "); // ["January", "1,", "1980"]
        const year = dateArray[2];
        const newDate = new Date(year);
        return newDate;
    }
    private static convertStringToArray(string: string): string[] {
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
    private static cleanString(string: string): string {
        string = string.replace(/[\[\]']+/g, ''); // remove brackets from string // error
        string = string.replace(/(^\s+|\s+$)+/g, ''); // removes whitespace aka trim()
        string = string.replace(/[\n]+/g, ''); // removes \n
        return string;
    }
    private static removeDuplicates(rawBook: BookType): BookType {
        rawBook.format = Array.from(new Set(rawBook.format));
        rawBook.genres = Array.from(new Set(rawBook.genres));
        return rawBook;
    }



    protected static async convertValue(rawBook: BookTypeRaw): Promise<BookType> {
        try {
            let tempBookType: BookType = {
                book: rawBook.book ?? "",
                series: rawBook.series ?? "",
                author: rawBook.author ?? "",
                description: this.cleanString(rawBook.description) ?? "", // contains \n
                numPages: parseInt(rawBook.numPages) ?? 0,
                format: this.convertStringToArray(rawBook.format) ?? [],
                genres: this.convertStringToArray(rawBook.genres) ?? [],
                publication: this.dateProcessor(rawBook.publication) ?? undefined, // could be dated better // string = "January 1, 1980"
                rating: Number.isNaN(parseFloat(rawBook.rating)) ? parseFloat(rawBook.rating) : 0.0 ?? 0.0,
                numOfVoters: parseInt(rawBook.numberOfVoters) ?? 0
            }

           // tempBookType = CSVtoSQLBook.removeDuplicates(tempBookType);

            return tempBookType;
        }// for each new tempbook send a create request
        catch (error) {
            console.log(error);
            throw new Error("Error in CSVtoSQLBook.convertValue " + error);
        }
    }


    private static async sendMetaData(book: BookType) {
        const genreModel = new GenreModel();
        const formatModel = new FormatModel();
        const authorModel = new AuthorModel();
        const author = book.author;

        book.format!.forEach(async (format) => {
            await formatModel.addFormat(format);
        })
        book.genres!.forEach(async (genre) => {
            await genreModel.addGenre(genre) // will have thousands of genres stoted in memory
        })

        await authorModel.addAuthor(author!);
    }

    private static async sendMetaDataLinks(book: BookType) {
        const bookGenreModel = new BookGenreModel();
        const bookFormatModel = new BookFormatModel();
        const bookAuthorModel = new BookAuthorModel();

        book = CSVtoSQLBook.removeDuplicates(book);

        book.format!.forEach(async (format) => {
            await bookFormatModel.addBookFormatLink(book.book, format);
        })
        book.genres!.forEach(async (genre) => {
            await bookGenreModel.addBookGenreLink(book.book, genre);
        })
        await bookAuthorModel.addBookAuthorLink(book.book, book.author!);
    }

    public static async processEachRow(bookRowRaw: BookTypeRaw) { // for each new tempbook send a create request
        try {
            const bookItemModel = new BookItemModel();
            const bookRow: BookType = await this.convertValue(bookRowRaw);
            await bookItemModel.addBookItem(bookRow);
            // get unique values for format, genres, and authors
            await this.sendMetaData(bookRow);
            await this.sendMetaDataLinks(bookRow);

        }
        catch (error) {
            console.log(error);
            throw new Error("Error in CSVtoSQLBook.convertValues " + error);
        }
    }


    //badCoding but it works



    public static async run(): Promise<void> {
        await ReadCSV.readAsync();
    }

}








