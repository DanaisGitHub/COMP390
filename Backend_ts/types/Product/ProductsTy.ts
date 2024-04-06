import { BookItemType, BookAuthorType, BookGenreType, BookFormatType } from "../DBTypes/BookTypes/bookTypes";


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