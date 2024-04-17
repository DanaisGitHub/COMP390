import { RentalType, RentalDetailType } from "../../DBTypes/RentalTypes/rentalType"

export type RentalOrderType =  {
    orderNumber?: number,
    renterID: number,
    ownerID: number,
    startDate: Date| string,
    endDate: Date| string,
}

export type RentalItemType =  {
    orderNumber?: number // link to rental order
    itemID: number,
    price?: number, // should get from UserItem Table
    quantity: number,
}

export type FullRentalPurchaseRequest = RentalOrderType & { rentalItems: RentalItemType[] }

export type FullRentalDetails = RentalType & { rentalDetails: RentalDetailType[] } // ngl not sure