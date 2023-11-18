"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodModel = void 0;
const modelSetUp_1 = require("../modelSetUp");
const baseModel_1 = require("./baseModel");
class FoodModel extends baseModel_1.BaseModel {
    ////////////////find in Database/////////////////////////////////////////////////// how to make return type of dbtypes
    async getAllCustomFoodFromLogs(customFoodIdKeys) {
        try {
            let foodIdObjects = [];
            for (let i = 0; i < customFoodIdKeys.length; i++) {
                const theEntry = await this.findByPkey(modelSetUp_1.CustomFoodData, customFoodIdKeys[i]);
                foodIdObjects.push(theEntry.result);
            }
            return { err: false, result: foodIdObjects };
        }
        catch (err) {
            console.log(err);
            throw new Error("Problem when trying to getAllFood:" + err);
        }
    }
    async getAllFoodFromLogs(foodIdKeys) {
        try {
            let foodIdObjects = [];
            for (let i = 0; i < foodIdKeys.length; i++) {
                const theEntry = await this.findByPkey(modelSetUp_1.FoodData, foodIdKeys[i]);
                foodIdObjects.push(theEntry.result);
            }
            return { err: false, result: foodIdObjects };
        }
        catch (err) {
            console.log(err);
            throw new Error("Problem when trying to getAllFood:" + err);
        }
    }
    async getAllExercisesFromLogs(exerciseIdKeys) {
        try {
            let exerciseIdObjects = [];
            for (let i = 0; i < exerciseIdKeys.length; i++) {
                const theEntry = await this.findByPkey(modelSetUp_1.Excerises, exerciseIdKeys[i]);
                exerciseIdObjects.push(theEntry.result);
            }
            return { err: false, result: exerciseIdObjects };
        }
        catch (err) {
            console.log(err);
            throw new Error("Problem when trying to getAllExercises:" + err);
        }
    }
    async getAllUserLogsWithData(userId) {
        try {
            const { err, result } = await this.getAllUserLogs(userId);
            if (err) {
                throw new Error("Problem when trying to getAllUserLogs:" + err);
            }
            let userLogsWithData = [];
            for (let i = 0; i < result.length; i++) {
                const { foodId, customFoodId, exerciseId } = result[i];
                let foodIdObjects = [];
                let customFoodIdObjects = [];
                let exerciseIdObjects = [];
                if (foodId) {
                    const { err, result } = await this.getAllFoodFromLogs(foodId);
                    if (err) {
                        throw new Error("Problem when trying to getAllFood:" + err);
                    }
                    foodIdObjects = result;
                }
                if (customFoodId) {
                    const { err, result } = await this.getAllCustomFoodFromLogs(customFoodId);
                    if (err) {
                        throw new Error("Problem when trying to getAllCustomFood:" + err);
                    }
                    customFoodIdObjects = result;
                }
                if (exerciseId) {
                    const { err, result } = await this.getAllExercisesFromLogs(exerciseId);
                    if (err) {
                        throw new Error("Problem when trying to getAllExercises:" + err);
                    }
                    exerciseIdObjects = result;
                }
                const userLogsWithDataObject = {
                    date: result[i].date,
                    email: result[i].email,
                    foodId: foodIdObjects,
                    customFoodId: customFoodIdObjects,
                    exerciseId: exerciseIdObjects
                };
                userLogsWithData.push(userLogsWithDataObject);
            }
            return { err: false, result: userLogsWithData };
        }
        catch (err) {
            console.log(err);
            throw new Error("Problem when trying to getAllUserLogsWithData:" + err);
        }
    }
    getTotal(customeFoodData) {
        try {
            let customFoodDataCondensed = {
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
        }
        catch (err) {
            console.log(err);
            throw new Error("Problem when trying to getUserLogsWithDataForDay:" + err);
        }
    }
    getCombinedDailyMacros(foodData, customFoodData, exerciseData) {
        try {
            let dailyMacros = {
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
            return dailyMacros;
        }
        catch (err) {
            console.log(err);
            throw new Error("Problem when trying to getUserLogsWithDataForDay:" + err);
        }
    }
    async getDailyMacrosList(userId) {
        const userLogsWithData = await this.getAllUserLogsWithData(userId);
        let i = 0;
        let eachDaysMacros = [];
        for (i = 0; i < userLogsWithData.result.length; i++) {
            const { foodId, customFoodId, exerciseId } = userLogsWithData.result[i];
            const DailyMacros = this.getCombinedDailyMacros(foodId, customFoodId, exerciseId);
            DailyMacros.date = userLogsWithData.result[i].date;
            eachDaysMacros.push(DailyMacros);
        }
        return { err: false, result: eachDaysMacros };
    }
    async getAllUserLogs(userId) {
        try {
            const response = await this.findAll(modelSetUp_1.UserLogs, { where: { email: userId } });
            return response;
        }
        catch (err) {
            console.log(err);
            throw new Error("Problem when trying to getAllUserLogs:" + err);
        }
    }
    async getUserLogsForDay(userId, date) {
        try {
            const compositeKey = { email: userId, date: date };
            const theEntry = await this.findOne(modelSetUp_1.UserLogs, { where: compositeKey });
            return { err: false, result: theEntry.result };
        }
        catch (err) {
            console.log(err);
            throw new Error("Problem when trying to getAllUserLogs:" + err);
        }
    }
    async getUser(userId) {
        try {
            const response = await this.findByPkey(modelSetUp_1.User, userId);
            return response;
        }
        catch (err) {
            console.log(err);
            throw new Error("Problem when trying to find user getUser:" + err);
        }
    }
    async changeUserDetails(userId, newData) {
        try {
            console.log(newData);
            const { err, result } = await this.findByPkey(modelSetUp_1.User, userId);
            const userObj = result;
            const response = await this.update(userObj, newData);
            // updating the user in the class
            return response;
        }
        catch (err) {
            console.log(err);
            throw new Error("Problem when trying to find user addCustomFood:" + err);
        }
    }
    ////////////////////////add to Database////////////////////////////////////////////////// Not adding users here doing that in auth
    async addCustomFood(userId, newData) {
        try {
            const response = await this.create(modelSetUp_1.CustomFoodData, newData);
            // we need id of new entry to add to userlog
            //const primaryKey = { response.result.id };
            return response;
        }
        catch (err) {
            console.log(err);
            throw new Error("Problem when trying to find user addCustomFood:" + err);
        }
    }
    async addExcerise(newData) {
        try {
            console.log(newData);
            const response = await this.create(modelSetUp_1.Excerises, newData);
            return response;
        }
        catch (err) {
            console.log(err);
            throw new Error("Problem when trying to addExcerise:" + err);
        }
    }
    async addFood(newData) {
        try {
            const response = await this.create(modelSetUp_1.FoodData, newData);
            return response;
        }
        catch (err) {
            console.log(err);
            throw new Error("Problem when trying to addFoodData:" + err);
        }
    }
    async addUserLogs(newData) {
        try {
            const compositeKey = { email: newData.email, date: newData.date };
            const { err, result } = await this.findOne(modelSetUp_1.UserLogs, { where: compositeKey });
            if (err === "not found") { // works
                const response = await this.create(modelSetUp_1.UserLogs, newData);
                return { err: false, result: response.result };
            }
            if (err) {
                throw new Error(err);
            }
            // update
            // not working need see return
            let newFoodId;
            let newExcerisesId;
            let newCustomFoodId;
            if (result.foodId !== undefined || result.foodId.equals([])) {
                const previousFood = result.foodId;
                const newFoodArray = newData.foodId || [];
                newFoodId = previousFood.concat(newFoodArray);
            }
            else {
                const newFoodArray = newData.foodId || [];
                newFoodId = newFoodArray;
            }
            console.log(result.exerciseId);
            if (result.exerciseId !== undefined || result.foodId.equals([])) {
                const previousExcerises = result.exerciseId;
                const newExcerisesArray = newData.exerciseId || [];
                newExcerisesId = previousExcerises.concat(newExcerisesArray);
            }
            else {
                const newExcerisesArray = newData.exerciseId || [];
                newExcerisesId = newExcerisesArray;
            }
            if (result.customFoodId !== undefined || result.foodId.equals([])) {
                const customFoodId = result.customFoodId;
                const newCustomFoodArray = newData.customFoodId || [];
                newCustomFoodId = customFoodId.concat(newCustomFoodArray);
            }
            else {
                const newCustomFoodArray = newData.customFoodId || [];
                newCustomFoodId = newCustomFoodArray;
            }
            const updateData = {
                foodId: newFoodId,
                exerciseId: newExcerisesId,
                customFoodId: newCustomFoodId
            };
            const response = await this.update(result, updateData);
            const theEntry = await this.findOne(modelSetUp_1.UserLogs, { where: compositeKey });
            return { err: false, result: theEntry.result };
        }
        catch (err) {
            console.log(err);
            throw new Error("Problem when trying to addUserLogs:" + err);
        }
    }
}
exports.FoodModel = FoodModel;
