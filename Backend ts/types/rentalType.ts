import { coordiantes } from './baseTypes';

export interface ItemsType {
    itemId: number;
    itemName: string;
    description: string;
    ownerId: number;
    thumbnail: string;
    pricePerDay: number;
    itemLocation: coordiantes;
    quantity: number;
}

export interface RentalsType {
    rentalId: number;
    renterId: number;
    letterId: number;
    rentalStartDate: Date;
    rentalEndDate: Date;
    rentalStatus: string;
    paid: boolean;
    paymentDate: Date;
    orderNumber: number;

}


export interface PaymentDetailsType {
    paymentId: number;
    paymentDate: Date;
    paymentType: string;
    allowed: boolean;
}

