import {coordiantes} from './baseTypes';

// Since some id's is auto incremented input into db is not needed
export interface UserType {
    id?: number;//Primary key//Optinal to allow new users to be added to db
    firstName: string;
    lastName: string;
    password: string;
    refreshToken?: string; // not sure of ?
    birthDate: Date;
    profilePicture?: string;
    location: coordiantes;
    paymentDetailsId: number;
    userEmail: string;
    CryptoPaymentsId:number;
}

export interface UserPreferenceType {
    userID?: number; // FK to user
    distanceRange?: {min:number,max:number};
    priceRange?: {min:number,max:number};
    ratingRange?: {min:number,max:number};
    dateRange?:{start:Date,end:Date};
}




