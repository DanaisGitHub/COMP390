import { TempUserType, UserPreferenceType } from './DBTypes/UserTypes/userTypes';
import { ItemType, RentalType, PaymentDetailType, RentalDetailType } from './DBTypes/RentalTypes/rentalType';
import { User, UserPreference, UserItem, Rental, PaymentDetail, RentalsDetail } from '../models/DB_Functions/Set_Up/modelSetUp'


export type ModelTypes = TempUserType
    | UserPreferenceType
    | ItemType
    | RentalType
    | PaymentDetailType
    | RentalDetailType


export type Models = User
    | UserPreference
    | UserItem
    | Rental
    | PaymentDetail
    | RentalsDetail

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