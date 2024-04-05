export interface FullBook {
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

export interface BookPreview {
    productID?: number,
    ownerID?: number,
    book: string,
    pre_rating: number,
    rating_we_think: number,
    price:number
    lat:number,
    lng:number

}