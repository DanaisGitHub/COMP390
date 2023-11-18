import { sequelize, User, UserLogs, Excerises, FoodData, CustomFoodData } from "../modelSetUp";
import { Model, DataTypes, Sequelize, ModelCtor } from "sequelize";
import { BaseModel } from "./baseModel";
import StdReturn from "../../types/types"; // just changed make sure correct
import { Macros, UserLogsTypeWithData, UserAttributesType, UserLogsType, ExcerisesType, FoodDataType, CustomFoodDataType } from "../../types/dbTypes";

export class FoodModel extends BaseModel { // make static the functions that don't need constructors


    ////////////////find in Database/////////////////////////////////////////////////// how to make return type of dbtypes


    private async getAllCustomFoodFromLogs(customFoodIdKeys: number[]): Promise<StdReturn> {
        try {
            let foodIdObjects: FoodDataType[] = [];
            for (let i = 0; i < customFoodIdKeys.length; i++) {
                const theEntry: StdReturn = await this.findByPkey(CustomFoodData, customFoodIdKeys[i]);
                foodIdObjects.push(theEntry.result);
            }
            return { err: false, result: foodIdObjects };
        }
        catch (err) {
            console.log(err)
            throw new Error("Problem when trying to getAllFood:" + err)
        }
    }

    private async getAllFoodFromLogs(foodIdKeys: number[]): Promise<StdReturn> {
        try {
            let foodIdObjects: FoodDataType[] = [];
            for (let i = 0; i < foodIdKeys.length; i++) {
                const theEntry: StdReturn = await this.findByPkey(FoodData, foodIdKeys[i]);
                foodIdObjects.push(theEntry.result);
            }
            return { err: false, result: foodIdObjects };
        }
        catch (err) {
            console.log(err)
            throw new Error("Problem when trying to getAllFood:" + err)
        }
    }

    private async getAllExercisesFromLogs(exerciseIdKeys: number[]): Promise<StdReturn> {
        try {
            let exerciseIdObjects: ExcerisesType[] = [];
            for (let i = 0; i < exerciseIdKeys.length; i++) {
                const theEntry: StdReturn = await this.findByPkey(Excerises, exerciseIdKeys[i]);
                exerciseIdObjects.push(theEntry.result);
            }
            return { err: false, result: exerciseIdObjects };
        }
        catch (err) {
            console.log(err)
            throw new Error("Problem when trying to getAllExercises:" + err)
        }
    }






    public async getAllUserLogsWithData(userId: string): Promise<StdReturn> {
        try {
            const { err, result } = await this.getAllUserLogs(userId);
            if (err) {
                throw new Error("Problem when trying to getAllUserLogs:" + err)
            }
            let userLogsWithData: UserLogsTypeWithData[] = [];
            for (let i = 0; i < result.length; i++) {
                const { foodId, customFoodId, exerciseId } = result[i];
                let foodIdObjects: FoodDataType[] = [];
                let customFoodIdObjects: CustomFoodDataType[] = [];
                let exerciseIdObjects: ExcerisesType[] = [];
                if (foodId) {
                    const { err, result } = await this.getAllFoodFromLogs(foodId);
                    if (err) {
                        throw new Error("Problem when trying to getAllFood:" + err)
                    }
                    foodIdObjects = result;
                }
                if (customFoodId) {
                    const { err, result } = await this.getAllCustomFoodFromLogs(customFoodId);
                    if (err) {
                        throw new Error("Problem when trying to getAllCustomFood:" + err)
                    }
                    customFoodIdObjects = result;
                }
                if (exerciseId) {
                    const { err, result } = await this.getAllExercisesFromLogs(exerciseId);
                    if (err) {
                        throw new Error("Problem when trying to getAllExercises:" + err)
                    }
                    exerciseIdObjects = result;
                }
                const userLogsWithDataObject: UserLogsTypeWithData = {
                    date: result[i].date,
                    email: result[i].email,
                    foodId: foodIdObjects,
                    customFoodId: customFoodIdObjects,
                    exerciseId: exerciseIdObjects
                }
                userLogsWithData.push(userLogsWithDataObject);
            }
            return { err: false, result: userLogsWithData };
        } catch (err) {
            console.log(err)
            throw new Error("Problem when trying to getAllUserLogsWithData:" + err)
        }
    }




    public getTotal(customeFoodData: Macros[]): StdReturn {
        try {
            let customFoodDataCondensed: Macros = {
                calories: 0,
                sugar: 0,
                carbohydrates: 0,
                fat: 0,
                protein: 0,
                fibre: 0
            };
            for (let i = 0; i < customeFoodData.length; i++) {
                customFoodDataCondensed.calories += customeFoodData[i].calories;
                customFoodDataCondensed.sugar += customeFoodData[i].sugar;
                customFoodDataCondensed.carbohydrates += customeFoodData[i].carbohydrates;
                customFoodDataCondensed.fat += customeFoodData[i].fat;
                customFoodDataCondensed.protein += customeFoodData[i].protein;
                customFoodDataCondensed.fibre += customeFoodData[i].fibre;
            }

            return { err: false, result: customFoodDataCondensed };
        } catch (err) {
            console.log(err)
            throw new Error("Problem when trying to getUserLogsWithDataForDay:" + err)
        }
    }

    public getCombinedDailyMacros(foodData: FoodDataType[], customFoodData: CustomFoodDataType[], exerciseData: ExcerisesType[]): Macros {
        try {
            let dailyMacros: Macros = {
                calories: 0,
                sugar: 0,
                carbohydrates: 0,
                fat: 0,
                protein: 0,
                fibre: 0
            };
            for (let i = 0; i < foodData.length; i++) {
                dailyMacros.calories += foodData[i].calories;
                dailyMacros.sugar += foodData[i].sugar;
                dailyMacros.carbohydrates += foodData[i].carbohydrates;
                dailyMacros.fat += foodData[i].fat;
                dailyMacros.protein += foodData[i].protein;
                dailyMacros.fibre += foodData[i].fibre;
            }
            for (let i = 0; i < customFoodData.length; i++) {
                dailyMacros.calories += customFoodData[i].calories;
                dailyMacros.sugar += customFoodData[i].sugar;
                dailyMacros.carbohydrates += customFoodData[i].carbohydrates;
                dailyMacros.fat += customFoodData[i].fat;
                dailyMacros.protein += customFoodData[i].protein;
                dailyMacros.fibre += customFoodData[i].fibre;
            }
            for (let i = 0; i < exerciseData.length; i++) {
                dailyMacros.calories -= exerciseData[i].caloriesBurned;
            }
            return dailyMacros ;
        } catch (err) {
            console.log(err)
            throw new Error("Problem when trying to getUserLogsWithDataForDay:" + err)
        }
    }

    public async getDailyMacrosList(userId: string): Promise<StdReturn> { // what this might work wtf
        const userLogsWithData = await this.getAllUserLogsWithData(userId);
        let i = 0;
        let eachDaysMacros: Macros[] = [];
        for (i = 0; i < userLogsWithData.result.length; i++) {
            const { foodId, customFoodId, exerciseId } = userLogsWithData.result[i];
            const DailyMacros:Macros = this.getCombinedDailyMacros(foodId, customFoodId, exerciseId);
            DailyMacros.date = userLogsWithData.result[i].date;
            eachDaysMacros.push(DailyMacros);
        }
        return { err: false, result: eachDaysMacros }

    }



    public async getAllUserLogs(userId: string): Promise<StdReturn> { // not working because haven't added user to userlogs
        try {
            const response: StdReturn = await this.findAll(UserLogs, { where: { email: userId } });
            return response;
        }
        catch (err) {
            console.log(err)
            throw new Error("Problem when trying to getAllUserLogs:" + err)
        }
    }




    public async getUserLogsForDay(userId: string, date: Date): Promise<StdReturn> {  // notWorking because haven't added user to userlogs
        try {
            const compositeKey = { email: userId, date: date };
            const theEntry: StdReturn = await this.findOne(UserLogs, { where: compositeKey });

            return { err: false, result: theEntry.result };
        }
        catch (err) {
            console.log(err)
            throw new Error("Problem when trying to getAllUserLogs:" + err)
        }
    }

    public async getUser(userId: string): Promise<StdReturn> { // should really be in auth
        try {
            const response: StdReturn = await this.findByPkey(User, userId)
            return response;
        } catch (err) {
            console.log(err)
            throw new Error("Problem when trying to find user getUser:" + err)
        }
    }

    public async changeUserDetails(userId: string, newData: UserAttributesType): Promise<StdReturn> { // the object constructor should change
        try {
            console.log(newData)

            const { err, result } = await this.findByPkey(User, userId);
            const userObj = result;
            const response: StdReturn = await this.update(userObj, newData)
            // updating the user in the class
            return response;
        } catch (err) {
            console.log(err)
            throw new Error("Problem when trying to find user addCustomFood:" + err)
        }
    }

    ////////////////////////add to Database////////////////////////////////////////////////// Not adding users here doing that in auth
    public async addCustomFood(userId: string, newData: CustomFoodDataType): Promise<StdReturn> { // yes with auth problem
        try {
            const response: StdReturn = await this.create(CustomFoodData, newData)

            // we need id of new entry to add to userlog

            //const primaryKey = { response.result.id };

            return response;
        } catch (err) {
            console.log(err)
            throw new Error("Problem when trying to find user addCustomFood:" + err)
        }
    }

    public async addExcerise(newData: ExcerisesType): Promise<StdReturn> { // yes with auth problem
        try {
            console.log(newData)
            const response: StdReturn = await this.create(Excerises, newData)
            return response;
        } catch (err) {
            console.log(err)
            throw new Error("Problem when trying to addExcerise:" + err)
        }
    }

    public async addFood(newData: FoodDataType): Promise<StdReturn> {
        try {
            const response: StdReturn = await this.create(FoodData, newData)
            return response;
        }
        catch (err) {
            console.log(err)
            throw new Error("Problem when trying to addFoodData:" + err)
        }
    }

    public async addUserLogs(newData: UserLogsType): Promise<StdReturn> { // Works !!!!!!!!!!!!!!!!!!!!!!!!
        try {
            const compositeKey = { email: newData.email, date: newData.date };

            const { err, result }: StdReturn = await this.findOne(UserLogs, { where: compositeKey });
            if (err === "not found") { // works
                const response: StdReturn = await this.create(UserLogs, newData)
                return { err: false, result: response.result };
            }
            if (err) {
                throw new Error(err)
            }

            // update

            // not working need see return
            let newFoodId: number[];
            let newExcerisesId: number[];
            let newCustomFoodId: number[];
            if (result.foodId !== undefined || result.foodId.equals([])) {
                const previousFood: number[] = result.foodId;
                const newFoodArray: number[] = newData.foodId || [];
                newFoodId = previousFood.concat(newFoodArray);
            }
            else {
                const newFoodArray: number[] = newData.foodId || [];
                newFoodId = newFoodArray;
            }

            console.log(result.exerciseId)
            if (result.exerciseId !== undefined||result.foodId.equals([])) { 
                const previousExcerises: number[] = result.exerciseId;
                const newExcerisesArray: number[] = newData.exerciseId || [];
                newExcerisesId = previousExcerises.concat(newExcerisesArray); 
            }
            else {
                const newExcerisesArray: number[] = newData.exerciseId || [];
                newExcerisesId = newExcerisesArray;
            }

            if (result.customFoodId !== undefined||result.foodId.equals([])) {
                const customFoodId: number[] = result.customFoodId;
                const newCustomFoodArray: number[] = newData.customFoodId || [];
                newCustomFoodId = customFoodId.concat(newCustomFoodArray);
            }
            else {
                const newCustomFoodArray: number[] = newData.customFoodId || [];
                newCustomFoodId = newCustomFoodArray;
            }

            const updateData = {
                foodId: newFoodId,
                exerciseId: newExcerisesId,
                customFoodId: newCustomFoodId
            }

            const response: StdReturn = await this.update(result, updateData)
            const theEntry: StdReturn = await this.findOne(UserLogs, { where: compositeKey });

            return { err: false, result: theEntry.result };

        } catch (err) {
            console.log(err)
            throw new Error("Problem when trying to addUserLogs:" + err)
        }
    }
}
