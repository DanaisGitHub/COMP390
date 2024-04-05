
export interface BookPreferenceType { // all are optional for ease of use
    userID?: number;// FK to user
    authorPreference?: number[]; // maybe we can get away with storing as JSON/Array of id's
    genrePreference?: number[]; // why are these strings? should be numbers
    formatPreference?: number[];
    publicationRangeMin?: Date;
    publicationRangeMax?:Date 
    bookLengthRangeMin?: number;
    bookLengthRangeMax?: number;
}

export interface BookItemType {
    id?: number;
    book: string;
    series: string | undefined | null;
    author?: string;
    description: string;
    numPages: number;
    format?: string[];// are these even in ?
    genres?: string[];// are these even in ?
    publication: Date;
    rating: number;
    numOfVoters: number;
}

export interface BookAuthorType {
    id?: number;
    bookID: number; // Primary & Foreign Key
    authorID: number; // Primary & Foreign Key
}

export interface BookFormatType {
    id?: number;
    bookID: number; // Primary & Foreign Key
    formatID: number; // Primary & Foreign Key
}

export interface BookGenreType {
    id?: number;
    bookID: number; // Primary & Foreign Key
    genreID: number; // Primary & Foreign Key
}

export interface GenreType {
    id?: number;
    name: string;
}

export interface FormatType {
    id?: number;
    name: string;
}

export interface AuthorType {
    id?: number;
    name: string;
}


export interface BookTypeRaw {
    field1?: string;
    book: string;
    series: string;
    releaseNumber: string;
    author: string;
    description: string;
    numPages: string;
    format: string;
    genres: string;
    publication: string;
    rating: string;
    numberOfVoters: string;
}

export interface UserBookRatingType{
    id?: number;
    userID: number;
    bookID: number;
    rating: number;
}