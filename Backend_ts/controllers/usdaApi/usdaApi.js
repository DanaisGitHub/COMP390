"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// USDA.gov API is down
const axios_1 = __importDefault(require("axios"));
const secretKey = "zeaBsAb7dpyqN2EyumbilHGVfa1XZH88lqF0i5It";
class FoodApi {
    constructor() {
        this.getFoodChoices = async (query) => {
            try {
                let topResults = [];
                const parsedQuery = query.replace("/\s+/g", '+');
                const response = await axios_1.default.get(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${secretKey}&query=${parsedQuery}&dataType=Survey%20(FNDDS)&pageSize=5&sortOrder=desc`);
                switch (response.data.totalHits) {
                    case 0:
                        topResults = [];
                        break;
                    case 1:
                        topResults = [response.data.foods[0].description];
                        break;
                    case 2:
                        topResults = [response.data.foods[0].description, response.data.foods[1].description];
                        break;
                    case 3:
                        topResults = [response.data.foods[0].description, response.data.foods[1].description, response.data.foods[2].description];
                        break;
                    case 4:
                        topResults = [response.data.foods[0].description, response.data.foods[1].description, response.data.foods[2].description, response.data.foods[3].description];
                        break;
                    case 5:
                        topResults = [response.data.foods[0].description, response.data.foods[1].description, response.data.foods[2].description, response.data.foods[3].description, response.data.foods[4].description];
                        break;
                    default:
                        topResults = [response.data.foods[0].description, response.data.foods[1].description, response.data.foods[2].description, response.data.foods[3].description, response.data.foods[4].description];
                        break;
                }
                return topResults;
            }
            catch (err) {
                console.log(err);
                throw new Error("Couldn't access USDA department: " + err);
            }
        };
        this.getFood = async (query, quantity, foodChoice) => {
            try {
                let userChoice;
                const parsedQuery = query.replace("/\s+/g", '+');
                const response = await axios_1.default.get(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${secretKey}&query=${parsedQuery}&dataType=Survey%20(FNDDS)&pageSize=10&sortOrder=desc`); // we really shoulnt need ot call this again, we should be able to just use the data we already have
                if (response.data.totalHits < foodChoice) {
                    throw new Error("Food choice is not valid");
                }
                userChoice = response.data.foods[foodChoice - 1];
                const foodNutrients = userChoice.foodNutrients;
                const macrosPer100g = this.getMacros(foodNutrients);
                const macrosPerServing = this.convertMacros(macrosPer100g, quantity); // needs to added to database
                return macrosPerServing;
            }
            catch (err) {
                console.log(err);
                throw new Error("Couldn't access USDA department: " + err);
            }
        };
        this.getMacros = (foodNutrients) => {
            var _a, _b, _c, _d, _e, _f;
            try {
                let proteins = null;
                let carbs = null;
                let fat = null;
                let calories = null;
                let sugar = null;
                let fiber = null;
                let i;
                for (i = 0; i < foodNutrients.length; i++) {
                    if (foodNutrients[i].nutrientName.includes("Protein")) {
                        proteins = foodNutrients[i];
                    }
                    if (foodNutrients[i].nutrientName.includes("Carbohydrate")) {
                        carbs = foodNutrients[i];
                    }
                    if (foodNutrients[i].nutrientName.includes("Total lipid (fat)")) {
                        fat = foodNutrients[i];
                    }
                    if (foodNutrients[i].nutrientName.includes("Energy")) {
                        calories = foodNutrients[i];
                    }
                    if (foodNutrients[i].nutrientName.includes("Sugars")) {
                        sugar = foodNutrients[i];
                    }
                    if (foodNutrients[i].nutrientName.includes("Fiber")) {
                        fiber = foodNutrients[i];
                    }
                }
                const finalMacrosPer100g = {
                    protein: (_a = proteins === null || proteins === void 0 ? void 0 : proteins.value) !== null && _a !== void 0 ? _a : 0,
                    carbs: (_b = carbs === null || carbs === void 0 ? void 0 : carbs.value) !== null && _b !== void 0 ? _b : 0,
                    fat: (_c = fat === null || fat === void 0 ? void 0 : fat.value) !== null && _c !== void 0 ? _c : 0,
                    calories: (_d = calories === null || calories === void 0 ? void 0 : calories.value) !== null && _d !== void 0 ? _d : 0,
                    sugar: (_e = sugar === null || sugar === void 0 ? void 0 : sugar.value) !== null && _e !== void 0 ? _e : 0,
                    fiber: (_f = fiber === null || fiber === void 0 ? void 0 : fiber.value) !== null && _f !== void 0 ? _f : 0
                };
                return finalMacrosPer100g;
            }
            catch (err) {
                console.log(err);
                throw new Error("Couldn't extract data from food: " + err);
            }
        };
        this.convertMacros = (macrosPer100g, newGrams) => {
            const finalMacros = {
                protein: macrosPer100g.protein * (newGrams / 100),
                carbs: macrosPer100g.carbs * (newGrams / 100),
                fat: macrosPer100g.fat * (newGrams / 100),
                calories: macrosPer100g.calories * (newGrams / 100),
                sugar: macrosPer100g.sugar * (newGrams / 100),
                fiber: macrosPer100g.fiber * (newGrams / 100)
            };
            return finalMacros;
        };
    }
}
exports.default = FoodApi;
