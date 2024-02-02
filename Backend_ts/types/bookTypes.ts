
export interface BookType {
    id?: number;
    book: string;
    series: string | undefined | null;
    releaseNumber: number | undefined | null;// not sure about null
    author: string;
    description: string;
    numPages: number;
    format: string[];
    genres: string[];
    publication: Date;
    rating: number;
    numberOfVoters: number;
}

export interface BookAuthorType {
    bookId: number; // Primary & Foreign Key
    authorId: number; // Primary & Foreign Key
}

export interface BookFormatType {
    bookId: number; // Primary & Foreign Key
    formatId: number; // Primary & Foreign Key
}

export interface BookGenreType {
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