import { sequelize, User, Item, Rental, PaymentDetail, RentalsDetail, UserPreference } from "../../DB_Functions/Set_Up/modelSetUp";
import { BaseModel } from "../baseModel";
import { BookPreferenceModel, UserBookRatingModels } from "../Items/BookModels/bookModel";
import crypto from 'crypto';
import StdReturn, { Models } from "../../../types/baseTypes"; // just changed make sure correct
import { UserPreferenceType, TempUserType } from '../../../types/DBTypes/UserTypes/userTypes'
import { BookPreferenceType } from "../../../types/DBTypes/BookTypes/bookTypes";
import { randomDate, randomDateRange, randomNumber, randomRange } from '../../../utils/other/random'
import { random } from "../../../utils/other/utils";
import {generateRandomLatLng} from'../../../utils/locationUtils'





export class UserPreferenceModel extends BaseModel<UserPreference> {
    constructor() {
        super(UserPreference);
    }

    public createEmptyUserPreference = async (userID: number): Promise<StdReturn<UserPreference>> => {
        try {
            const { err, result } = await this.baseCreate({ userID })
            return { err, result }
        } catch (err) {
            console.log(err)
            throw new Error("Error in createUserPreference")
        }
    }

    public createRandomUserPreference = async (userID: number): Promise<void> => {
        try {
            const { min: distanceMin, max: distanceMax } = randomRange(0, 100)
            const { min: priceMin, max: priceMax } = randomRange(0, 1000)
            const { min: ratingMin, max: ratingMax } = randomRange(0, 5, true)
            const { min: dateMin, max: dateMax } = randomDateRange(new Date(1920, 1, 1), new Date(2020, 1, 1))
            const userPreference: UserPreferenceType = {
                userID,
                distanceRangeMin: distanceMin,
                distanceRangeMax: distanceMax,
                priceRangeMin: priceMin,
                priceRangeMax: priceMax,
                ratingRangeMin: ratingMin,
                ratingRangeMax: ratingMax,
                dateRangeMin: dateMin,
                dateRangeMax: dateMax
            }
            const userPreferenceModel = new UserPreferenceModel();
            await userPreferenceModel.baseCreate(userPreference);
        } catch (err) {
            console.log(err)
            throw new Error("Error in createRandomUserPreference")
        }
    }

    public updateUserPreference = async (newUserPreference: UserPreferenceType, userID: number): Promise<void> => {
        try {
            await this.baseUpdate(newUserPreference, { where: { userID } })
        } catch (err) {
            console.log(err)
            throw new Error("Error in updateUserPreference" + err)
        }
    }

    public getUserPreference = async (userID: number): Promise<StdReturn<UserPreference>> => {
        try {
            const { err, result } = await this.baseFindOne({ where: { userID }, rejectOnEmpty: true })
            return { err, result }
        } catch (err) {
            console.log(err)
            throw new Error("Error in getUserPreference")
        }
    }
}

export class UserModel extends BaseModel<User> {  // most should NOT be public 


    constructor() {
        super(User);
    }

    protected createUser = async (userDetails: TempUserType): Promise<StdReturn<User>> => {
        try {
            const bookPreference: BookPreferenceModel = new BookPreferenceModel();
            const userPreference: UserPreferenceModel = new UserPreferenceModel(); // Pass the model argument
            const userBookRatingModels = new UserBookRatingModels();
            const { err, result: user } = await this.baseCreate(userDetails)
            // creates a prefrance for the user with default values
            const bookPrefResult = await bookPreference.createRandomBookPreference(user.id!);
            const userPrefResult = await userPreference.createRandomUserPreference(user.id!);
            const userBookRatingResult = await userBookRatingModels.genRatingForAllBooks(user);
            // need to create rating for each book

            return { err, result: user }
        } catch (err) {
            console.log(err)
            throw new Error("Error in createUser")
        }
    }

  
    public createRandomUser = async (): Promise<StdReturn<User>> => {
        try {
            const { lat, lng } = generateRandomLatLng(10);
            const userDetails: TempUserType = {
                firstName: crypto.randomBytes(10).toString('hex'),
                lastName: crypto.randomBytes(10).toString('hex'),
                userEmail: crypto.randomBytes(20).toString('hex') + "@test.com",
                password: "password",
                birthDate: randomDate(new Date(1920, 1, 1), new Date(2004, 1, 1)),
                sex:randomNumber(0, 1) === 0 ? false : true,
                lat: lat,
                lng: lng
            }
            const { err, result } = await this.createUser(userDetails); // book and user pref created too
            return { err, result }
        } catch (err) {
            console.log(err)
            throw new Error("Error in createRandomUser")
        }
    }

    public createManyRandomUsers = async (amount: number): Promise<void> => {
        try {
            for (let i = 0; i < amount; i++) {
                const { err, result } = await this.createRandomUser();
                if (err) {
                    console.log(err)
                    throw new Error("Error in createManyRandomUsers")
                }
            }
        } catch (err) {
            console.log(err)
            throw new Error("Error in createManyRandomUsers")
        }
    }

    public updateUser = async (newUserDetails: TempUserType, userID: number): Promise<void> => {
        try {
            await this.baseUpdate(newUserDetails, { where: { id: userID } })
        } catch (err) {
            console.log(err)
            throw new Error("Error in updateUser")
        }
    }

    public getUserPref = async (userID: number): Promise<StdReturn<UserPreferenceType>> => {
        try {
            const userPrefModel = new UserPreferenceModel();
            const { err, result } = await userPrefModel.getUserPreference(userID);
            return { err, result }
        } catch (err) {
            console.log(err)
            throw new Error("Error in getUserPref")
        }
    }

    public getUserBookPref = async (userID: number): Promise<StdReturn<BookPreferenceType>> => {
        try {
            const bookPrefModel = new BookPreferenceModel();
            const { err, result } = await bookPrefModel.getBookPreference(userID);
            return { err, result }
        } catch (err) {
            console.log(err)
            throw new Error("Error in getUserBookPref")
        }
    }
}

