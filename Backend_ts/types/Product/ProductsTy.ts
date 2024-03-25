
export interface ProductPreview { // all previews are ranked
    productID: number, // id of book
    sellerID?: number, // might not needs
    title: string,
    longitude: number,
    latitude: number,
    ranking: number,
}

export interface ProductDetails {
    id: number;
    bookTitle: string;
    series: string | undefined | null;
    author: string;
    description: string;
    numPages: number;
    formats: string[];// are these even in ?
    genres: string[];// are these even in ?
    publication: Date;
    rating: number;
    numOfVoters: number;
}