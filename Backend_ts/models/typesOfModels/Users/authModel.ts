import { sequelize, User, UserItem, Rental, PaymentDetail, RentalsDetail, UserPreference } from "../../DB_Functions/Set_Up/modelSetUp";
import { BaseModel } from "../baseModel";
import { BookPreferenceModel } from "../Items/BookModels/bookModel";
import crypto from 'crypto';
import bcrypt from 'bcrypt'
import passport from 'passport-jwt';
import StdReturn, { Models } from "../../../types/baseTypes"; // just changed make sure correct
import { UserPreferenceType, TempUserType } from '../../../types/DBTypes/UserTypes/userTypes'
import {UserModel} from "./userModels";


// pre-processing & storage goes in here
export class AuthModel extends UserModel {
    isAlreadyAUserObj(username: string): { err: any; result: any; } | PromiseLike<{ err: any; result: any; }> {
        throw new Error('Method not implemented.');
    }
    user = User; // not specified which user just all Users

    public signUp = async (userDetails: TempUserType): Promise<StdReturn> => {
        // check to see if already exists
        // check data is correct (should use validator software)
        try {


            let isUser: StdReturn = await this.findUserByEmail(userDetails.userEmail); // 2 db searches when we could do 1
            if (isUser.result !== null) {
                //user does exists
                console.log("User " + userDetails.userEmail + " Exsits");
                return { err: "User '" + userDetails.userEmail + "' Exsits", result: null }
            }
            const salt = await bcrypt.genSalt(10)
            userDetails.password = await bcrypt.hash(userDetails.password, salt);

            const { err, result } = await this.baseCreate(userDetails)

            return { err: null, result: result }
        } catch (err) {
            console.log(err)
            throw new Error("AuthModel signUp() -----> " + err)
        }


    }


    public login = async (obj: { email: string, rawPassword: string, refreshToken: string }): Promise<StdReturn> => {
        try {
            const { err, result } = await this.findUserByEmail(obj.email);
            if (err) {
                console.log(`Error in login ${err}`)
                return { err: err, result: null } // I don't think this ever runs
            }
            if (result === null) {
                //not found, already console.logged
                return { err: "User Not Found", result: null }
            }
            const user = result;
            await this.baseUpdate({ refreshToken: obj.refreshToken }, { where: { userEmail: obj.email } })
            const passwordMatch = await this.comparePasswords(obj.rawPassword, user.password);
            if (!passwordMatch.result) {
                console.log("passwords don't match")
                return { err: "Passwords don't match", result: null }
            }
            return { err: null, result: result }

        } catch (err) {
            console.log(err)
            throw new Error("Login error")
        }
    }



    private findUserByEmail = async (email: string): Promise<StdReturn> => { // don't need this if you have above
        try {
            const { err, result } = await this.baseFindOne({
                where: { "userEmail": email },
                rejectOnEmpty: false
            })
            if (result === null) {
                console.log(err);
                return { err: "User Not Found", result: null }
            }
            return { err: err, result: result }

        } catch (err) {
            console.log(err)
            throw new Error(`authModel findUserByEmai catch err ----> ${err}}`)

        }
    }

    public deleteEverything = async (): Promise<StdReturn> => {
        try {
            await this.user.destroy({ where: {} })
            return { err: null, result: "Everything from db is delete" }
        } catch (err) {
            console.log(err)
            throw new Error("Problem when trying to delete everything")
        }
    }

    private createHash = async (rawPassword: string): Promise<StdReturn> => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(rawPassword, salt)
            return { err: null, result: hashedPassword }
        }
        catch (err) {
            console.log(err);
            throw new Error("Error when hashing password")
        }

    }

    public comparePasswords = async (rawPassword: string, hashedPassword: string): Promise<StdReturn> => {
        try {
            const result = await bcrypt.compare(rawPassword, hashedPassword)
            return { err: null, result: result }
        }
        catch (err) {
            console.log(err)
            throw new Error("Couldn't compare passwords")
        }
    }

    // 
    // public isRefreshTokenSame = async (obj: { id: string, refreshToken: string }): Promise<StdReturn> => {
    //     try {
    //         const { id, refreshToken } = obj;
    //         console.log(id)
    //         const { err:any, result } = await this.findUserByEmail(id);
    //         const user = result
    //         console.log("err =" + err)
    //         if (err) {
    //             console.log(err)
    //             throw new Error(`Couldn't check if refresh tokens are the same: ${err}`)
    //         }

    //         if (user.refreshToken === null) {
    //             console.log("User doesnt have a refresh token")
    //             return { err: true, result: false }
    //         }
    //         if (refreshToken !== user.refreshToken) {
    //             return { err: true, result: false }
    //         }
    //         return { err: false, result: true }
    //     }
    //     catch (err) {
    //         console.log(err)
    //         throw new Error(`coudn't check refresh tokens at this time ${err}`)
    //     }
    // }

    // public emailToken = async (email: string): Promise<StdReturn> => {
    //     try {

    //     }
    //     catch (err:any) {
    //         console.log(err)
    //         throw new Error(`Couldn't email token at this time ${err}`)
    //     }
    // }


    // public getEverything = async (): Promise<StdReturn> => {
    //     try {
    //         let allDatabaseResults = {
    //             users: [],
    //             userLogs: [],
    //             excerises: [],
    //             foodData: [],
    //             customFoodData: []
    //         }
    //         const allUsers = await this.findAll(User, {});
    //         const allUserLogs = await this.findAll(UserLogs, {});
    //         const allExcerises = await this.findAll(Excerises, {});
    //         const allFoodData = await this.findAll(FoodData, {});
    //         const allCustomFoodData = await this.findAll(CustomFoodData, {});

    //         allDatabaseResults.users = allUsers.result;
    //         allDatabaseResults.userLogs = allUserLogs.result;
    //         allDatabaseResults.excerises = allExcerises.result;
    //         allDatabaseResults.foodData = allFoodData.result;
    //         allDatabaseResults.customFoodData = allCustomFoodData.result;

    //         return { err: null, result: allDatabaseResults }
    //     } catch (err) {
    //         console.log(err)
    //         throw new Error("Problem when trying to find all");
    //     }

    // }
} 
