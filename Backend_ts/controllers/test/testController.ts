
import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

import FoodApiClass from '../../controllers/usdaApi/usdaApi';



//import self-written files
import { Item, User } from '../../models/DB_Functions/Set_Up/modelSetUp';
import StdReturn, { Models } from '../../types/baseTypes';
import { ItemModel } from '../../models/typesOfModels/Items/ItemsModel';
import { TempUserType, UserPreferenceType } from '../../types/userType';
import { ItemType, RentalType, PaymentDetailType, RentalDetailType } from '../../types/rentalType';
import { coordiantes } from '../../types/baseTypes';
import { Attributes, Model, ModelStatic } from 'sequelize';
import { BaseModel } from '../../models/typesOfModels/baseModel';
import {BaseController} from '../../controllers/_baseController/baseController'


const pathToKey = path.join(__dirname, '..', '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


const getUserIdFromHeader = (req: Req, res: Res): string => { // need to change to header
    try {
        const bearerAccessToken = req.headers.authorization // contains "bearer"
        if (bearerAccessToken === undefined || bearerAccessToken === null || bearerAccessToken === "") {
            console.log("No access token")
            throw new Error("No access token in cookies")
        }
        const accessToken = bearerAccessToken.split(" ")[1];
        const decoded: any = jwt.verify(accessToken, PUB_KEY); // should make not async// type error if not :any see what's going here
        return decoded.id
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err: err, message: "There was an error trying to get the user id from cookies" })
        throw new Error("There was an error")
    }
}


export default class ItemController extends BaseController<ItemModel, Item> {

    constructor() {
        super(new ItemModel(), Item);
    }



    //works
    public createItem = async (req: Req, res: Res, next: Next) => { // add into user logs
        try {
            //const userId = getUserIdFromHeader(req, res);
            const newCustomFoodData: ItemType = {
                itemName: req.body.itemName,
                description: req.body.description,
                thumbnail: req.body.thumbnail,
                pricePerDay: req.body.pricePerDay,
                itemLocation: req.body.itemLocation,
                quantity: req.body.quantity,
            }
            await this.create(res, newCustomFoodData);
        } catch (err) {
            console.log(err)
            res.status(500).json({ err: err, result: "addCustomFoodData" })
        }
    }


    // input would not be from user
    public getOneItem = async (req: Req, res: Res, next: Next) => { // user is not going to call this directly
        try {
            await this.getOne(req, res, next);
        }
        catch (err) { // more errors than just server errors
            console.log(err)
            res.status(500).json({ err: err, result: "There was an error" })
        }
    }

    public getManyItems = async (req: Req, res: Res, next: Next) => { // user is not going to call this directly
        try {
            this.getMany(req, res, next);
        }
        catch (err) { // more errors than just server errors
            console.log(err)
            res.status(500).json({ err: err, result: "There was an error" })
        }
    }

    public updateItem = async (req: Req, res: Res, next: Next) => {
        try {
            await this.update(req, res, next, Item);
        }
        catch (err) { // more errors than just server errors
            console.log(err)
            res.status(500).json({ err: err, result: "There was an error" })
        }
    }

    public removeItem = async (req: Req, res: Res, next: Next) => {
        try {
            await this.remove(req, res, next);
        }
        catch (err) { // more errors than just server errors
            console.log(err)
            res.status(500).json({ err: err, result: "There was an error" })
        }
    }

    public addCSVItems = async (req: Req, res: Res, next: Next) => {
        try {
            const { err, result } = await this.db.addManyNewBookItems();
            res.status(200).json({ err, result })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ err: err, result: "There was an error" })
        }
    }

    // public getUserDetails = async (req: Req, res: Res, next: Next) => {
    //     try {
    //         const userId = getUserIdFromHeader(req, res);
    //         const userQuery = await this.db.getUser(userId);
    //         if (userQuery.err) {
    //             throw new Error("Couldn't get user")
    //         }
    //         const user = userQuery.result;

    //         const theUser: UserAttributesType = {
    //             id: user.id,
    //             firstName: user.firstName,
    //             lastName: user.lastName,
    //             weight: user.weight,
    //             calorieGoal: user.calorieGoal,
    //             birthDate: user.birthDate,
    //             height: user.height,
    //             gender: user.gender,
    //             password: ""//Not sending password
    //         }
    //         res.status(200).json({ err: false, message: theUser })
    //     }
    //     catch (err) {
    //         console.log(err)
    //         res.status(500).json({ err: err, message: err })
    //     }
    // }

    // // Deprecated
    // public changeUserDetails = async (req: Req, res: Res, next: Next) => {
    //     try {
    //         const userId = getUserIdFromHeader(req, res);
    //         const userQuery = await this.db.getUser(userId);
    //         if (userQuery.err) {
    //             throw new Error("Couldn't get user")
    //         }
    //         const user = userQuery.result;
    //         const newUserDetails: UserAttributesType = {
    //             id: user.id, // cannot change id
    //             firstName: req.body.firstName || user.firstName,
    //             lastName: req.body.lastName || user.lastName,
    //             weight: req.body.weight || user.weight,
    //             calorieGoal: req.body.calorieGoal || user.calorieGoal,
    //             birthDate: req.body.birthDate || user.birthDate,
    //             height: req.body.height || user.height,
    //             gender: req.body.gender || user.gender,
    //             password: user.password
    //         }
    //         const { err, result } = await this.db.changeUserDetails(userId, newUserDetails);
    //         // updating the user
    //         res.status(200).json({ err: err, message: result })
    //     } catch (err) {
    //         console.log(err)
    //         res.status(500).json({ err: err, message: null })
    //     }
    // }



    // //works
    // public addExcerise = async (req: Req, res: Res, next: Next) => {
    //     try {
    //         const userId = getUserIdFromHeader(req, res);
    //         const newExcersie: ExcerisesType = {
    //             emailId: userId,
    //             caloriesBurned: req.body.caloriesBurned,
    //             exerciseName: req.body.exerciseName,
    //             exerciseTime: req.body.exerciseTime,
    //         }
    //         const { err, result } = await this.db.addExcerise(newExcersie);
    //         const userLogResponse = await this.addUserLogs(userId, { exerciseId: [result.id] });
    //         res.status(200).json({ err, result: { excercise: result, userLog: userLogResponse.result } })
    //     } catch (err) {
    //         console.log(err)
    //         res.status(500).json({ err: err, message: null })
    //     }
    // }

    // public addFoodData = async (req: Req, res: Res, next: Next) => { // add into user logs
    //     try {
    //         const userId = getUserIdFromHeader(req, res);
    //         const food: string = req.body.food;
    //         const quantity: number = req.body.quantity;// how many grams
    //         const foodChoice: number = req.body.foodChoice;// number between 1-5

    //         const foodClass = new FoodApiClass();

    //         const theFoodChoices = await foodClass.getFood(food, quantity, foodChoice);

    //         // now need to multiply the food choices by the quantity and then add into database

    //         const multiplier = quantity / 100;

    //         let newFoodData: FoodDataType = {
    //             foodName: food,
    //             calories: theFoodChoices.calories * multiplier,
    //             sugar: theFoodChoices.sugar * multiplier,
    //             carbohydrates: theFoodChoices.carbs * multiplier,
    //             fat: theFoodChoices.fat * multiplier,
    //             protein: theFoodChoices.protein * multiplier,
    //             fibre: theFoodChoices.fiber * multiplier,
    //             quantity: quantity,
    //         }
    //         const { err, result } = await this.db.addFood(newFoodData);
    //         const userLogResponse = await this.addUserLogs(userId, { foodId: [result.id] });
    //         res.status(200).json({ err, result: { foodData: result, userLog: userLogResponse.result } })
    //     } catch (err) {
    //         console.log(err)
    //         res.status(500).json({ err: true, message: err })
    //     }
    // }

    // public addUserLogs = async (userId: string, obj: { customFoodId?: number[], exerciseId?: number[], foodId?: number[] }) => {
    //     try {
    //         const foodClass: FoodModel = new FoodModel();
    //         const newData: UserLogsType = {
    //             date: this.getTodaysDate(),
    //             email: userId,
    //             customFoodId: obj.customFoodId,
    //             exerciseId: obj.exerciseId,
    //             foodId: obj.foodId
    //         }
    //         const { err, result }: StdReturn = await foodClass.addUserLogs(newData)
    //         return { err, result }
    //     }
    //     catch (err) {
    //         console.log(err)
    //         throw new Error("There was an error")
    //     }
    // }
}





