import { sequelize, User, Item, Rental, PaymentDetail, RentalsDetails, UserPreference } from "../../DB_Functions/Set_Up/modelSetUp";
import { BaseModel } from "../baseModel";
import { BookPreferenceModel , UserBookRatingModels} from "../Items/bookModel";
import crypto from 'crypto';
import StdReturn, { Models } from "../../../types/baseTypes"; // just changed make sure correct
import { UserPreferenceType, TempUserType } from '../../../types/userType'
import { BookPreferenceType } from "../../../types/bookTypes";


const randomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const randomRange = (min: number, max: number): { min: number, max: number } => {
    const ran1 = Math.random() * (max - min) + min;
    const ran2 = Math.random() * (max - min) + min;
    if (ran1 > ran2) {
        return { min: ran2, max: ran1 }
    }
    else {
        return { min: ran1, max: ran2 }
    }
}



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

            const userPreference: UserPreferenceType = {
                userID,
                distanceRange: randomRange(0, 100),
                priceRange: randomRange(0, 100),
                ratingRange: randomRange(0, 100),
                dateRange: { start: new Date(), end: new Date() }
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
            const { err, result } = await this.baseFindOne({ where: { userID }, rejectOnEmpty: true})
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

    private randomDate = (start: Date, end: Date): Date => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    private randomRange = (min: number, max: number): { min: number, max: number } => {
        const ran1 = Math.random() * (max - min) + min;
        const ran2 = Math.random() * (max - min) + min;
        if (ran1 > ran2) {
            return { min: ran2, max: ran1 }
        }
        else {
            return { min: ran1, max: ran2 }
        }
    }

    public createRandomUser = async (): Promise<StdReturn<User>> => {
        try {
            const userDetails: TempUserType = {
                firstName: crypto.randomBytes(10).toString('hex'),
                lastName: crypto.randomBytes(10).toString('hex'),
                userEmail: crypto.randomBytes(20).toString('hex') + "@test.com",
                password: "password",
                birthDate: this.randomDate(new Date(1920, 1, 1), new Date(2004, 1, 1)),
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

