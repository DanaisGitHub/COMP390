import { sequelize, User, UserLogs, Excerises, FoodData, CustomFoodData } from "../modelSetUp";
import { BaseModel } from "./baseModel";
import crypto from 'crypto';
import bcrypt from 'bcrypt'
import passport from 'passport-jwt';
import StdReturn from "../../types/baseTypes"; // just changed make sure correct
import { UserAttributesType } from '../../types/userType'


// pre-processing & storage goes in here
export class AuthModel extends BaseModel {
    user = User; // not specified which user just all Users

    public signUp = async (userDetails: UserAttributesType): Promise<StdReturn> => {
        // check to see if already exists
        // check data is correct (should use validator software)
        let isUser = await this.isAlreadyAUserBool(userDetails.id); // 2 db searches when we could do 1
        if (isUser) {
            //user does exists
            console.log("User Exsits");
            return { err: "User Exsits", result: null }
        }
        const salt = await bcrypt.genSalt(10)
        userDetails.password = await bcrypt.hash(userDetails.password, salt);

        const { err, result } = await this.create(this.user, userDetails)
        if (err) {
            console.log(err);
            throw Error("Could't save details")
        }
        else {
            return { err: null, result: result }
        }
    }

    // -1 means not found, -2 means passwords incorrect
    public login = async (obj: { email: string, rawPassword: string, refreshToken: string }): Promise<StdReturn> => {
        try {
            const { err, result } = await this.findByPkey(this.user, obj.email);
            if (err) {
                console.log(`Couldn't find user ${err}`)
                return { err: err, result: null } // I don't think this ever runs
            }
            if (result === null) {
                //not found, already console.logged
                return { err: true, result: -1 }
            }
            const user = result;
            await this.update(user, { refreshToken: obj.refreshToken })
            const passwordMatch = await this.comparePasswords(obj.rawPassword, user.password);
            if (!passwordMatch.result) {
                console.log("passwords don't match")
                return { err: "Passwords don't match", result: -2 }
            }
            return { err: null, result: result }

        } catch (err) {
            console.log(err)
            throw new Error("Login error")
        }
    }


    public isAlreadyAUserObj = async (primaryKey: string): Promise<StdReturn> => {
        try {
            const { err, result } = await this.findByPkey(this.user, primaryKey)
            if (err) {
                throw new Error(`Problem when trying to find user ) ${err}}`)
                return { err: err, result: result }
            }
            if (result === null) {
                return { err: err, result: result }
            }
            else {
                return { err: err, result: result }
            }
        } catch (err) {
            console.log(err)
            throw new Error(`Problem when trying to find user ) ${err}}`)

        }
    }

    public isAlreadyAUserBool = async (primaryKey: string): Promise<boolean> => { // don't need this if you have above
        try {
            const { err, result } = await this.findByPkey(this.user, primaryKey)
            if (err) {
                return false
            }
            if (result === null) {
                return false;
            }
            else {
                return true
            }

        } catch (err) {
            console.log(err)
            throw new Error("Problem when trying to find user isAlreadyAUserBool")

        }
    }

    public deleteEverything = async (): Promise<StdReturn> => {
        try {
            await this.user.destroy({ where: {} })
            await UserLogs.destroy({ where: {} })
            await Excerises.destroy({ where: {} })
            await FoodData.destroy({ where: {} })
            await CustomFoodData.destroy({ where: {} })

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
    public isRefreshTokenSame = async (obj: { id: string, refreshToken: string }): Promise<StdReturn> => {
        try {
            const { id, refreshToken } = obj;
            console.log(id)
            const { err, result } = await this.isAlreadyAUserObj(id);
            const user = result
            console.log("err =" + err)
            if (err) {
                console.log(err)
                throw new Error(`Couldn't check if refresh tokens are the same: ${err}`)
            }

            if (user.refreshToken === null) {
                console.log("User doesnt have a refresh token")
                return { err: true, result: false }
            }
            if (refreshToken !== user.refreshToken) {
                return { err: true, result: false }
            }
            return { err: false, result: true }
        }
        catch (err) {
            console.log(err)
            throw new Error(`coudn't check refresh tokens at this time ${err}`)
        }
    }

    // public emailToken = async (email: string): Promise<StdReturn> => {
    //     try {

    //     }
    //     catch (err:any) {
    //         console.log(err)
    //         throw new Error(`Couldn't email token at this time ${err}`)
    //     }
    // }


    public getEverything = async (): Promise<StdReturn> => {
        try {
            let allDatabaseResults = {
                users: [],
                userLogs: [],
                excerises: [],
                foodData: [],
                customFoodData: []
            }
            const allUsers = await this.findAll(User, {});
            const allUserLogs = await this.findAll(UserLogs, {});
            const allExcerises = await this.findAll(Excerises, {});
            const allFoodData = await this.findAll(FoodData, {});
            const allCustomFoodData = await this.findAll(CustomFoodData, {});

            allDatabaseResults.users = allUsers.result;
            allDatabaseResults.userLogs = allUserLogs.result;
            allDatabaseResults.excerises = allExcerises.result;
            allDatabaseResults.foodData = allFoodData.result;
            allDatabaseResults.customFoodData = allCustomFoodData.result;

            return { err: null, result: allDatabaseResults }
        } catch (err) {
            console.log(err)
            throw new Error("Problem when trying to find all");
        }

    }
} 
