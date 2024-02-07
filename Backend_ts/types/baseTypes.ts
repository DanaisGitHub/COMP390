import { UserType, UserPreferenceType } from '../types/userType';
import { ItemType, RentalType, PaymentDetailType, RentalDetailType } from '../types/rentalType';
import {User, UserPreference, Item, Rental, PaymentDetail, RentalsDetails} from '../models/modelSetUp'


export type ModelTypes = UserType
    | UserPreferenceType
    | ItemType
    | RentalType
    | PaymentDetailType
    | RentalDetailType


export type Models = User | UserPreference | Item | Rental | PaymentDetail | RentalsDetails


export default interface StdReturn<T = any> {
    err: null | string,
    result: T
}

export interface coordiantes {
    lat: number;
    lng: number;
}

export interface RTokenModel {// don't think it's used 
    token: string,
    expiryDate: Date
}






