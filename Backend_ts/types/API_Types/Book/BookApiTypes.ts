import { BookItemType, BookAuthorType, BookGenreType, BookFormatType } from "../../DBTypes/BookTypes/bookTypes";


export type FullBook = {
    id?: number;
    book: string,
    series: string | undefined | null
    description: string,
    numPages: number
    publication: Date
    pre_rating: number
    rating_we_think?: number
    numOfVoters: number,
    ownerID?: number,
    price?: number
    author?: string | undefined | null,
    format?: string[] | undefined,
    genres?: string[] | undefined
}

export type BookPreview = {
    productID?: number,
    ownerID?: number,
    book: string,
    pre_rating: number,
    rating_we_think: number,
    price:number
    lat:number,
    lng:number

}


export type ProductPreviewType = { // all previews are ranked
    itemID: number, // id of book
    ownerID?: number, // might not needs
    book: string,
    lng: number,
    lat: number,
    ranking_of_book?: number,
    ranking_we_think?: number,
}

export type ProductDetailsType = {
    id: number;
    book: string;
    series: string | undefined | null;
    author: string;
    description: string;
    numPages: number;
    formats: string[];// are these even in ?
    genres: string[];// are these even in ?
    publication: Date;
    rating_we_think?: number;
    numOfVoters: number;
}

export type FullBookDetails = BookItemType & {
    authorList: string[],
    genreList: string[],
    formatList: string[],

}
export type FullBookDetail = BookItemType & {
    BookAuthors: BookAuthorType[],
    BookGenres: BookGenreType[],
    BookFormats: BookFormatType[]

}


id?: number;
    book: string;
    series: string | undefined | null;
    author?: string;
    description: string;
    numPages: number;
    format?: string[];
    genres?: string[];
    publication: Date;
    rating: number;
    numOfVoters: number;
    BookAuthors: BookAuthorType[],
    BookGenres: BookGenreType[],
    BookFormats: BookFormatType[]