// have a good feeling this needs to be file stream (Too big for memory)
import fs from 'fs';
import csvtojson from 'csvtojson';
import csvParser from 'csv-parser';
const csvFilePath = '../Backend_py/ML/DataSource/first10s.csv';
import { BookItemType, BookTypeRaw } from '../../../types/DBTypes/BookTypes/bookTypes';
import { BookItemModel } from '../../typesOfModels/Items/BookModels/bookModel';
import { GenreModel, BookGenreModel } from '../../typesOfModels/Items/BookModels/GenreModels/GenreModels';
import { FormatModel, BookFormatModel } from '../../typesOfModels/Items/BookModels/FormatModels/FormatModel';
import { AuthorModel, BookAuthorModel } from '../../typesOfModels/Items/BookModels/AuthorModels/AuthorModels';
import { GenreType, FormatType, AuthorType } from '../../../types/DBTypes/BookTypes/bookTypes';

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
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!£££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% All BOOKS CREATED")
                });
        } catch (error) {
            console.log(error);
            throw new Error("Error in CSVtoSQLBook.readAsync " + error);
        }
    }
}


export class CSVtoSQLBook { // might make singleton



    private static dateProcessor(date: string): Date {
        try {
            const dateArray = date.split(" "); // ["January", "1,", "1980"]
            const year = dateArray[2];
            const newDate = new Date(year);
            return newDate;
        } catch (err: any) {
            console.log(err);
            return new Date(2024);
        }
    }
    private static convertStringToArray(string: string): string[] {
        let array: string[] = [];
        string = string.replace(/[\[\]']+/g, ''); // remove brackets from string
        string = string.replace(/['"]+/g, ''); // remove quotes from string
        string = string.replace(/(^\s+|\s+$)+/g, '');
        array = string.split(',');
        for (let i = 0; i < array.length; i++) {
            array[i] = array[i].trim();
            array[i] = this.cleanString(array[i]);
        }
        return array;
    }
    private static cleanString(string: string): string {
        string = string.replace(/[\[\]']+/g, ''); // remove brackets from string // error
        string = string.replace(/(^\s+|\s+$)+/g, ''); // removes whitespace aka trim()
        string = string.replace(/[\n]+/g, '');// removes \n
        string = string.toLowerCase();
        var string = string.replace(/[^\w\s]/gi, '')

        return string;
    }
    private static removeDuplicates(rawBook: BookItemType): BookItemType {
        rawBook.format = Array.from(new Set(rawBook.format));
        rawBook.genres = Array.from(new Set(rawBook.genres));
        return rawBook;
    }



    protected static async convertStrBook(rawBook: BookTypeRaw): Promise<BookItemType> {
        try {
            if (rawBook.book.includes( "the masterharper of pern")) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                console.log(rawBook);
            }
            const today = new Date(2024);
            const num: number = !Number.isNaN(parseFloat(rawBook.rating)) ? parseFloat(rawBook.rating) : 0.0;
            
    
            let tempBookType: BookItemType = {
                book: this.cleanString(rawBook.book) ?? "",
                series: this.cleanString(rawBook.series) ?? "",
                author: this.cleanString(rawBook.author) ?? "",
                description: this.cleanString(rawBook.description) ?? "", // contains \n
                numPages: parseInt(rawBook.numPages) ?? 0,
                format: this.convertStringToArray(rawBook.format) ?? [],
                genres: this.convertStringToArray(rawBook.genres) ?? [],
                publication: this.dateProcessor(rawBook.publication) ?? undefined, // could be dated better // string = "January 1, 1980"
                rating: num,
                numOfVoters: parseInt(rawBook.numberOfVoters) ?? 0
            }

            // tempBookType = CSVtoSQLBook.removeDuplicates(tempBookType);

            return tempBookType;
        }// for each new tempbook send a create request
        catch (err:any) {
            console.error(err);
            throw new Error("Error in CSVtoSQLBook.convertValue " + err.message);
        }
    }


    private static async sendMetaData(book: BookItemType) { // should be removing duplicates
        const genreModel = new GenreModel();
        const formatModel = new FormatModel();
        const authorModel = new AuthorModel();
        let author = book.author;

        book.format!.forEach(async (format) => {
            format = this.cleanString(format);
            await formatModel.addAttribute(format);
        })
        book.genres!.forEach(async (genre) => {
            genre = this.cleanString(genre);
            await genreModel.addAttribute(genre) // will have thousands of genres stoted in memory
        })

        author = this.cleanString(author!);
        await authorModel.addAttribute(author!);


        //TODO: REMOVE DUPLICATES
    }

    private static async sendMetaDataLinks(book: BookItemType) {
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
            const bookRow: BookItemType = await this.convertStrBook(bookRowRaw);
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








