import {coordiantes} from '../../baseTypes';
import {BookPreferenceType} from '../BookTypes/bookTypes';

// Since some id's is auto incremented input into db is not needed
// export interface UserType { // might need to add more fields
//     id?: number;//Primary key//Optinal to allow new users to be added to db
//     firstName: string;
//     lastName: string;
//     password: string;
//     refreshToken?: string; // not sure of ?
//     birthDate: Date;
//     profilePicture?: string;
//     location: coordiantes;
//     paymentDetailsId: number;
//     userEmail: string;
//     CryptoPaymentsId:number;
// }

export interface TempUserType { // might need to add more fields
    id?: number;//Primary key//Optinal to allow new users to be added to db
    firstName: string;
    lastName: string;
    sex: boolean;
    userEmail: string;
    password: string;
    birthDate: Date;
    refreshToken?: string; // not sure of ?
    profilePicture?: string;
    lat:number;
    lng:number;
    paymentDetailsId?: number;
}

export interface UserPreferenceType {
    userID?: number; // FK to user
    distanceRangeMin?: number;
    distanceRangeMax?: number;
    priceRangeMin?: number;
    priceRangeMax?: number;
    ratingRangeMin?: number;
    ratingRangeMax?: number;
    dateRangeMin?: Date;
    dateRangeMax?: Date;
}



