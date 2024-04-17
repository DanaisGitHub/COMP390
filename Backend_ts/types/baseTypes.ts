import { TempUserType, UserPreferenceType } from './DBTypes/UserTypes/userTypes';
import { UserItemType, RentalType, PaymentDetailType, RentalDetailType } from './DBTypes/RentalTypes/rentalType';
import { User, UserPreference, UserItem, Rental, PaymentDetail, RentalsDetail } from '../models/DB_Functions/Set_Up/modelSetUp'


export type ModelTypes = TempUserType
    | UserPreferenceType
    | UserItemType
    | RentalType
    | PaymentDetailType
    | RentalDetailType


export type Models = User
    | UserPreference
    | UserItem
    | Rental
    | PaymentDetail
    | RentalsDetail

type StdReturn<T =any> = {
    err: null | string,
    result: T
}
export default StdReturn;

