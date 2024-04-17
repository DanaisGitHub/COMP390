import { Request as Req, Response as Res, NextFunction as Next } from 'express';
// access to the database
import { BookItemModel } from '../../models/typesOfModels/Items/BookModels/bookModel';
import { UserModel, UserPreferenceModel } from '../../models/typesOfModels/Users/userModels';
import { BookPreferenceModel } from '../../models/typesOfModels/Items/BookModels/bookModel';
import { GenreModel } from '../../models/typesOfModels/Items/BookModels/GenreModels/GenreModels';
import { FormatModel } from '../../models/typesOfModels/Items/BookModels/FormatModels/FormatModel';
import { BasicUserType, ProcessedUserType, UnprocessedUser, UptUserType } from '../../types/API_Types/User/UserApiTypes';
import { NotFoundError } from '../../utils/other/customError';

export class UserContoller {
    // Common Models for all functions
    private userModel = new UserModel();
    private genreModel = new GenreModel();
    private formatModel = new FormatModel();
    private authorModel = new FormatModel();

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
            const userID = 10
            const rawUser = await this.userModel.baseFindOneNotTyped<UnprocessedUser>({
                where: { id: userID }, include: ['userPreference', 'bookPreference'], rejectOnEmpty: false
            })
            const user: UnprocessedUser = rawUser.dataValues
            console.log(user.bookPreference.dataValues.genrePreference)
            const genrePref = await this.genreModel.getAttributeNameFromIDs(user.bookPreference.dataValues.genrePreference)
            const authorPref = await this.authorModel.getAttributeNameFromIDs(user.bookPreference.dataValues.authorPreference)
            const formatPref = await this.formatModel.getAttributeNameFromIDs(user.bookPreference.dataValues.formatPreference)
            const processedUser: ProcessedUserType = {
                id: user.id ?? -1,
                firstName: user.firstName,
                lastName: user.lastName,
                userEmail: user.userEmail,
                lat: user.lat,
                lng: user.lng,
                sex: user.sex,
                birthDate: user.birthDate,
                distanceRangeMin: user.userPreference.dataValues.distanceRangeMin,
                distanceRangeMax: user.userPreference.dataValues.distanceRangeMax,
                priceRangeMin: user.userPreference.dataValues.priceRangeMin,
                priceRangeMax: user.userPreference.dataValues.priceRangeMax,
                ratingRangeMin: user.userPreference.dataValues.ratingRangeMin,
                ratingRangeMax: user.userPreference.dataValues.ratingRangeMax,
                dateRangeMin: user.userPreference.dataValues.dateRangeMin,
                dateRangeMax: user.userPreference.dataValues.dateRangeMax,
                createdAt: user.createdAt,
                authorPreference: authorPref,
                genrePreference: genrePref,
                formatPreference: formatPref,
                publicationRangeMin: user.bookPreference.dataValues.publicationRangeMin,
                publicationRangeMax: user.bookPreference.dataValues.publicationRangeMax,
                bookLengthRangeMin: user.bookPreference.dataValues.bookLengthRangeMin,
                bookLengthRangeMax: user.bookPreference.dataValues.bookLengthRangeMax,
                password: user.password
            }
            console.log(processedUser)
            return processedUser;
        }
        catch (err) {
            console.log(err)
            throw new Error("Error in getting user details")
        }
    }

    public getBasicUserDetails = async (): Promise<BasicUserType> => {
        const userID = 15
        const { err, result: user } = await this.userModel.find({ where: { id: userID }, rejectOnEmpty: true })
        const basicUser: BasicUserType = {
            firstName: user.firstName,
            lastName: user.lastName,
            userEmail: user.userEmail,
            lat: user.lat,
            lng: user.lng
        }
        return basicUser;
    }

    public changeUserDetails = async (UserDetails: UptUserType): Promise<void> => {
        try {
            const userID = 15
            await this.userModel.update(UserDetails, { where: { id: userID } })
        }
        catch (err: any) {
            console.error(err)
            if (err instanceof NotFoundError) {
                throw err
            }
            else {
                throw new Error("Error in changing user details " + err.message)
            }
        }
    }

    public deleteUserDetails = async (req: Req, res: Res, next: Next): Promise<void> => {
        try {
            const userID = 4;
            const { err, result: user } = await this.userModel.find({ where: { id: userID }, rejectOnEmpty: true })
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

