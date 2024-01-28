import {coordiantes} from './baseTypes';

// Since some id's is auto incremented input into db is not needed
export interface UserType {
    id?: string;//Primary key//Optinal to allow new users to be added to db
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
    id?: number;
    maxDistance: number;
    maxPrice: number;
    minRating: number;
    dateRange:{start:Date,end:Date};

}




