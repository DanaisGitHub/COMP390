import { coordiantes } from './baseTypes';

export interface ItemsType {
    itemId: number;
    itemName: string;
    description: string;
    thumbnail: string;
    pricePerDay: number;
    itemLocation: coordiantes;
    quantity: number;
}

export interface RentalsType {
    rentalId: number;
    rentalStartDate: Date;
    rentalEndDate: Date;
    rentalStatus: string;
    paid: boolean;
    paymentDate: Date;
    orderNumber: number;

}

export interface RentalsDetailsType {
    rentalDetailId: number;
    price: number;
    total: number;
    discount: number;
    paymentDetails: string;
    billDate: Date;
    quantity: number;
    orderNumber: number;
}


export interface PaymentDetailsType {
    paymentId: number;
    paymentDate: Date;
    paymentType: string;
    allowed: boolean;
}

