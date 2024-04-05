import { coordiantes } from '../../baseTypes';

export interface ItemType {
    id?: number;
    ownerID: number;
    itemID: number;
    thumbnail?: string;
    price: number;
    quantity: number;

}

export interface RentalType {
    orderNumber?: number;
    renterID: number;
    ownerID: number;
    startDate: Date;
    endDate: Date;
    rentalStatus?: string;
    paid?: boolean;
    paymentDate?: Date;
}

export interface RentalDetailType {
    id?: number;
    price: number;
    itemID: number;
    discount?: number;
    paymentDetails?: string;
    billDate?: Date;
    quantity: number;
    orderNumber: number; // foreign key
}

export interface PaymentDetailType {
    id?: number;
    paymentDate: Date;
    paymentType: string;
    allowed: boolean;
}


