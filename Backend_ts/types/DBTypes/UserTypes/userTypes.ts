
import { BookPreferenceType } from '../BookTypes/bookTypes'; // bookTypes SHOULD be here

// Since some id's is auto incremented input into db is not needed
// export type UserType { // might need to add more fields
//     id?: number;//Primary key//Optinal to allow new users to be added to db
//     firstName: string;
//     lastName: string;
//     password: string;
//     refreshToken?: string; // not sure of ?
//     birthDate: Date;
//     profilePicture?: string;
//     location: coordiantes;
//     paymentDetailsID: number;
//     userEmail: string;
//     CryptoPaymentsID:number;
// }

export type TempUserType = { // might need to add more fields
    id?: number;//Primary key//Optinal to allow new users to be added to db
    firstName: string;
    lastName: string;
    sex: boolean;
    userEmail: string;
    password: string;
    birthDate: Date;
    refreshToken?: string; // not sure of ?
    profilePicture?: string;
    lat: number;
    lng: number;
    paymentDetailsID?: number;
}

export type UserPreferenceType = {
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



