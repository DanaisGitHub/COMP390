import { coordiantes } from '../../baseTypes';

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


