
export interface BookPreferenceType { // all are optional for ease of use
    userID?: number;// FK to user
    authorPreference?: string[]; // maybe we can get away with storing as JSON/Array of id's
    genrePreference?: string[];
    formatPreference?: string[];
    publicationRange?: { min: Date, max: Date }; // may take out ranges if too hard to implement
    bookLengthRange?: { min: number, max: number };
}

export interface BookType {
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
}

export interface BookAuthorType {
    id?: number;
    bookId: number; // Primary & Foreign Key
    authorId: number; // Primary & Foreign Key
}

export interface BookFormatType {
    id?: number;
    bookId: number; // Primary & Foreign Key
    formatId: number; // Primary & Foreign Key
}

export interface BookGenreType {
    id?: number;
    bookId: number; // Primary & Foreign Key
    genreId: number; // Primary & Foreign Key
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