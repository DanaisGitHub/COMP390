import {coordiantes} from './baseTypes';

// Since some id's is auto incremented input into db is not needed
export interface UserType {
    userid: string;//Primary key
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

