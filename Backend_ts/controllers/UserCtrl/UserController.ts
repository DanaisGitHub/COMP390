import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
// access to the database
import { ProductPreview, ProductDetails } from '../../types/Product/ProductsTy';
import { BookPreference, User, UserPreference } from '../../models/DB_Functions/Set_Up/modelSetUp';
import { BookItemModel, FullBookDetail } from '../../models/typesOfModels/Items/BookModels/bookModel';
import { UserModel, UserPreferenceModel } from '../../models/typesOfModels/Users/userModels';

import { calculateDistance } from '../../utils/locationUtils';
import { TempUserType, UserPreferenceType } from '../../types/DBTypes/UserTypes/userTypes';
import { BookPreferenceModel } from '../../models/typesOfModels/Items/BookModels/bookModel';
import {BookPreferenceType} from '../../types/DBTypes/BookTypes/bookTypes';
import { GenreModel } from '../../models/typesOfModels/Items/BookModels/GenreModels/GenreModels';
import { FormatModel } from '../../models/typesOfModels/Items/BookModels/FormatModels/FormatModel';
import {ProcessedUserType, UnprocessedUser} from '../../types/API_Types/User/UserApiTypes';

export class UserContoller {
    // Common Models for all functions
    private bookModel = new BookItemModel();
    private userModel = new UserModel();
    private genreModel = new GenreModel();
    private formatModel = new FormatModel();
    private authorModel = new FormatModel();
    private userPreferenceModel = new UserPreferenceModel();
    private bookPreferenceModel = new BookPreferenceModel();

    /**
     * Get all books in the location space of the user
     * 
     * @param req maxDistance
     * @param res 
     * @param next 
     * @returns 
     */
    public getAllUserDetails = async (): Promise<ProcessedUserType> => {
        try {
            // get from auth token
            const userID = 4
            const user: UnprocessedUser = await this.userModel.baseFindOneNotTyped<UnprocessedUser>({ where: { id: userID }, include: ['userPreference', 'bookPreference'], raw: true, rejectOnEmpty: true })
            console.log( user)
            const genrePref = await this.genreModel.getAttributeNameFromIDs(user['bookPreference.genrePreference'])
            console.log("genrePref", genrePref)
            const authorPref = await this.authorModel.getAttributeNameFromIDs(user['bookPreference.authorPreference'])
            const formatPref = await this.formatModel.getAttributeNameFromIDs(user['bookPreference.formatPreference'])
            const processedUser: ProcessedUserType = {
                id: user.id ?? -1,
                firstName: user.firstName,
                lastName: user.lastName,
                userEmail: user.userEmail,
                lat: user.lat,
                lng: user.lng,
                sex:user.sex,
                birthDate: user.birthDate,
                distanceRangeMin: user['userPreference.distanceRangeMin'],
                distanceRangeMax: user['userPreference.distanceRangeMax'],
                priceRangeMin: user['userPreference.priceRangeMin'],
                priceRangeMax: user['userPreference.priceRangeMax'],
                ratingRangeMin: user['userPreference.ratingRangeMin'],
                ratingRangeMax: user['userPreference.ratingRangeMax'],
                dateRangeMin: user['userPreference.dateRangeMin'],
                dateRangeMax: user['userPreference.dateRangeMax'],
                createdAt: user.createdAt,
                authorPreference: authorPref,
                genrePreference: genrePref,
                formatPreference: formatPref,
                publicationRangeMin: user['bookPreference.publicationRangeMin'],
                publicationRangeMax: user['bookPreference.publicationRangeMax'],
                bookLengthRangeMin: user['bookPreference.bookLengthRangeMin'],
                bookLengthRangeMax: user['bookPreference.bookLengthRangeMax'],
                password: user.password
            }
            return processedUser;
        }
        catch (err) {
            console.log(err)
            throw new Error("Error in getting user details")
        }
    }

    public changeUserDetails = async (UserDetails:ProcessedUserType): Promise<void> => {
        try { 
            const userID = 4;
            const newUserDetails: TempUserType = {
                firstName: UserDetails.firstName,
                lastName:  UserDetails.lastName,
                userEmail: UserDetails.userEmail,
                lat: UserDetails.lat,
                lng: UserDetails.lng,
                birthDate: UserDetails.birthDate,
                sex: true,
                password: UserDetails.password,
            }
            const newUserPreference: UserPreferenceType = {
                distanceRangeMin: UserDetails.distanceRangeMin,
                distanceRangeMax: UserDetails.distanceRangeMax,
                priceRangeMin: UserDetails.priceRangeMin,
                priceRangeMax: UserDetails.priceRangeMax,
                ratingRangeMin: UserDetails.ratingRangeMin,
                ratingRangeMax: UserDetails.ratingRangeMax,
                dateRangeMin: UserDetails.dateRangeMin,
                dateRangeMax: UserDetails.dateRangeMax,
            }

            
            const newBookPreference: BookPreferenceType = {
                // authorPreference: UserDetails.authorPreference,
                // genrePreference: UserDetails.genrePreference,
                // formatPreference: UserDetails.formatPreference,
                publicationRangeMin: UserDetails.publicationRangeMin,
                publicationRangeMax: UserDetails.publicationRangeMax,
                bookLengthRangeMin: UserDetails.bookLengthRangeMin,
                bookLengthRangeMax: UserDetails.bookLengthRangeMax,
            }

            const {err,result:user} = await this.userModel.find({ where: { id: userID }, rejectOnEmpty: true })
            const {err:err1,result:userPreference} = await this.userPreferenceModel.find({ where: { userID: userID }, rejectOnEmpty: true })
            const {err:err2,result:bookPreference} = await this.bookPreferenceModel.find({ where: { userID: userID }, rejectOnEmpty: true })

            await user.update(newUserDetails)
            await userPreference.update(newUserPreference)
            await bookPreference.update(newBookPreference)

            return;
        }  
        catch (err) {
            console.log(err)
        }
    }

    public deleteUserDetails = async (req: Req, res: Res, next: Next): Promise<void> => {
        try {
            const userID = 4;
            const {err,result:user} = await this.userModel.find({ where: { id: userID }, rejectOnEmpty: true })
            await user.destroy() // should have cascade effect

            // const {err:err1,result:userPreference} = await this.userPreferenceModel.find({ where: { userID: userID }, rejectOnEmpty: true })
            // await userPreference.destroy()

            // const {err:err2,result:bookPreference} = await this.bookPreferenceModel.find({ where: { userID: userID }, rejectOnEmpty: true })
            // await bookPreference.destroy()
         }
        catch (err) {
            console.error(err)
            throw new Error("Error in deleting user details")
        }
    }
}

interface FullBook {
    id?: number;
    book: string,
    series: string | undefined | null
    description: string,
    numPages: number
    publication: Date
    rating: number
    numOfVoters: number,
    ownerID?: number,
    price?: number
    author?: string | undefined | null,
    format?: string[] | undefined,
    genres?: string[] | undefined
}