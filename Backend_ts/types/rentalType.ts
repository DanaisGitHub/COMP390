import { coordiantes } from './baseTypes';

export interface ItemType {
    id?: number;
    itemName: string;
    description: string;
    thumbnail: string;
    pricePerDay: number;
    itemLocation?: coordiantes;
    quantity: number;
}

export interface RentalType {
    id?: number;
    rentalStartDate: Date;
    rentalEndDate: Date;
    rentalStatus: string;
    paid: boolean;
    paymentDate: Date;
    orderNumber: number;

}

export interface RentalDetailType {
    id?: number;
    price: number;
    total: number;
    discount: number;
    paymentDetails: string;
    billDate: Date;
    quantity: number;
    orderNumber: number;
}


export interface PaymentDetailType {
    id?: number;
    paymentDate: Date;
    paymentType: string;
    allowed: boolean;
}


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

export interface BookTypeRaw {
    field1?: string;
    book: string;
    series: string;
    releaseNumber:string;
    author: string;
    description: string;
    numPages:string;
    format: string;
    genres: string;
    publication:string;
    rating: string;
    numberOfVoters: string;
}
