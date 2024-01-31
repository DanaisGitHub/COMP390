import csvtojson from 'csvtojson';
const csvFilePath = '../Backend_py/DataSource/first10s.csv';
import { BookType, BookTypeRaw } from '../types/rentalType';


export class CSVtoSQLBook { // might make singleton

    protected static async readRawCSVFile(): Promise<BookTypeRaw[]> {
        const csv = csvtojson;
        const jsonArray: BookTypeRaw[] = await csv().fromFile(csvFilePath);
        return jsonArray;
    }
    protected static convertstringToArray(string: string): string[] {
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
    protected static descriptionFilter(string: string): string {
        string = string.replace(/[\[\]']+/g, ''); // remove brackets from string
        string = string.replace(/(^\s+|\s+$)+/g, ''); // removes whitespace aka trim()
        string = string.replace(/[\n]+/g, ''); // removes \n
        return string;
    }

    protected static convertValues(bookRawArray: BookTypeRaw[]): BookType[] {
        let returnValue: BookType[] = [];
        bookRawArray.forEach(rawBook => {
            returnValue.push({
                book: rawBook.book,
                series: rawBook.series ?? "",
                releaseNumber: Number.isNaN(parseInt(rawBook.releaseNumber)) ? -2 : parseInt(rawBook.releaseNumber) ?? -1, // value = NaN
                author: rawBook.author ?? "",
                description: this.descriptionFilter(rawBook.description) ?? "", // contains \n
                numPages: parseInt(rawBook.numPages) ?? 0,
                format: this.convertstringToArray(rawBook.format) ?? [],
                genres: this.convertstringToArray(rawBook.genres) ?? [],
                publication: new Date(rawBook.publication) ?? new Date("01-01-1970"), // could be dated better
                rating: parseFloat(rawBook.rating) ?? 0.0,
                numberOfVoters: parseInt(rawBook.numberOfVoters) ?? 0
            });
        })
        return returnValue;
    }

    public static async run(): Promise<BookType[]> {
        const rawBookArray = await this.readRawCSVFile();
        const bookArray = this.convertValues(rawBookArray);
        return bookArray;
    }

}








