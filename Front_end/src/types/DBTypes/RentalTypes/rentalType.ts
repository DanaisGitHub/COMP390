export type ItemType = {
    id?: number;
    ownerID: number;
    itemID: number;
    thumbnail?: string;
    price: number;
    quantity: number;

}

export type RentalType = {
    orderNumber?: number;
    renterID: number;
    ownerID: number;
    startDate: Date;
    endDate: Date;
    rentalStatus?: string;
    paid?: boolean;
    paymentDate?: Date;
}

export type RentalDetailType = {
    id?: number;
    price: number;
    itemID: number;
    discount?: number;
    paymentDetails?: string;
    billDate?: Date;
    quantity: number;
    orderNumber: number; // foreign key
}

export type PaymentDetailType = {
    id?: number;
    paymentDate: Date;
    paymentType: string;
    allowed: boolean;
}


