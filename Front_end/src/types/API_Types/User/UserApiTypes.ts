import { BookPreferenceType } from '@/types/DBTypes/BookTypes/bookTypes';
import { TempUserType, UserPreferenceType } from '../../DBTypes/UserTypes/userTypes';

export type UnprocessedUser =
    TempUserType & UserPreferenceType & BookPreferenceType & {
        [x: string]: any; // short term fix
    }

export type ProcessedUserType = {
    id: number,
    firstName: string
    lastName: string
    userEmail: string,
    lat: number,
    lng: number,
    sex: boolean,
    birthDate: Date,
    distanceRangeMin: number,
    distanceRangeMax: number,
    priceRangeMin: number,
    priceRangeMax: number,
    ratingRangeMin: number,
    ratingRangeMax: number,
    dateRangeMin: Date,
    dateRangeMax: Date,
    createdAt: Date,
    authorPreference: string[],
    genrePreference: string[],
    formatPreference: string[],
    publicationRangeMin: Date,
    publicationRangeMax: Date,
    bookLengthRangeMin: number,
    bookLengthRangeMax: number,
    password: string
}

export type FullUser = {
    id?: number,
    firstName: string
    lastName: string
    userEmail: string,
    lat: number,
    lng: number,
    sex: boolean,
    birthDate: Date,
    distanceRangeMin?: number,
    distanceRangeMax?: number,
    priceRangeMin?: number,
    priceRangeMax?: number,
    ratingRangeMin?: number,
    ratingRangeMax?: number,
    dateRangeMin?: Date,
    dateRangeMax?: Date,
    authorPreference: string[],
    genrePreference: string[],
    formatPreference: string[],
    publicationRangeMin?: Date,
    publicationRangeMax?: Date,
    bookLengthRangeMin?: number,
    bookLengthRangeMax?: number,
}

export type BasicUserType = {
    id?: number,
    firstName: string,
    lastName: string,
    userEmail: string,
    lat: number,
    lng: number
}

export type UptUserType = {
    id?: number,
    firstName?: string,
    lastName?: string,
    userEmail?: string,
    lat?: number,
    lng?: number
}

export type UserType = { // might need to add more fields
    id?: number;//Primary key//Optinal to allow new users to be added to db
    firstName: string;
    lastName: string;
    sex: boolean|number;
    userEmail: string;
    password: string;
    birthDate: Date|string;
    lat: number;
    lng: number;
}