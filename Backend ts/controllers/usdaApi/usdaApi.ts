// USDA.gov API is down
import axios from "axios";

import { FoodNutrients, Foods, Macros } from "../../types/foodTypes";

const secretKey = "zeaBsAb7dpyqN2EyumbilHGVfa1XZH88lqF0i5It";

export default class FoodApi {

    public getFoodChoices = async (query: string) => {
        try {
            let topResults: any = [];
            const parsedQuery = query.replace("/\s+/g", '+')
            const response: any = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${secretKey}&query=${parsedQuery}&dataType=Survey%20(FNDDS)&pageSize=5&sortOrder=desc`);


            switch (response.data.totalHits) {
                case 0:
                    topResults = [];
                    break;
                case 1:
                    topResults = [response.data.foods[0].description]
                    break;
                case 2:
                    topResults = [response.data.foods[0].description, response.data.foods[1].description]
                    break;
                case 3:
                    topResults = [response.data.foods[0].description, response.data.foods[1].description, response.data.foods[2].description]
                    break;
                case 4:
                    topResults = [response.data.foods[0].description, response.data.foods[1].description, response.data.foods[2].description, response.data.foods[3].description]
                    break;
                case 5:
                    topResults = [response.data.foods[0].description, response.data.foods[1].description, response.data.foods[2].description, response.data.foods[3].description, response.data.foods[4].description]
                    break;
                default:
                    topResults = [response.data.foods[0].description, response.data.foods[1].description, response.data.foods[2].description, response.data.foods[3].description, response.data.foods[4].description]
                    break;
            }
            return topResults;
        } catch (err) {
            console.log(err)
            throw new Error("Couldn't access USDA department: " + err);
        }

    }

    public getFood = async (query: string, quantity: number, foodChoice: number) => {
        try {
            let userChoice: Foods;
            const parsedQuery = query.replace("/\s+/g", '+')
            const response =
                await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${secretKey}&query=${parsedQuery}&dataType=Survey%20(FNDDS)&pageSize=10&sortOrder=desc`); // we really shoulnt need ot call this again, we should be able to just use the data we already have

            if (response.data.totalHits < foodChoice) {
                throw new Error("Food choice is not valid");
            }
            userChoice = response.data.foods[foodChoice - 1];
            const foodNutrients: [FoodNutrients] = userChoice.foodNutrients;
            const macrosPer100g: Macros = this.getMacros(foodNutrients);

            const macrosPerServing: Macros = this.convertMacros(macrosPer100g, quantity); // needs to added to database

            return macrosPerServing;

        } catch (err) {
            console.log(err)
            throw new Error("Couldn't access USDA department: " + err);
        }

    }

    private getMacros = (foodNutrients: [FoodNutrients]): Macros => {
        try {
            let proteins: FoodNutrients | null = null;
            let carbs: FoodNutrients | null = null;
            let fat: FoodNutrients | null = null;
            let calories: FoodNutrients | null = null;
            let sugar: FoodNutrients | null = null;
            let fiber: FoodNutrients | null = null;

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
            const finalMacrosPer100g: Macros = { // null safety
                protein: proteins?.value ?? 0,
                carbs: carbs?.value ?? 0,
                fat: fat?.value ?? 0,
                calories: calories?.value ?? 0,
                sugar: sugar?.value ?? 0,
                fiber: fiber?.value ?? 0
            };
            return finalMacrosPer100g;
        } catch (err) {
            console.log(err)
            throw new Error("Couldn't extract data from food: " + err);

        }
    }

    private convertMacros = (macrosPer100g: Macros, newGrams: number): Macros => {
        const finalMacros: Macros = {
            protein: macrosPer100g.protein * (newGrams / 100),
            carbs: macrosPer100g.carbs * (newGrams / 100),
            fat: macrosPer100g.fat * (newGrams / 100),
            calories: macrosPer100g.calories * (newGrams / 100),
            sugar: macrosPer100g.sugar * (newGrams / 100),
            fiber: macrosPer100g.fiber * (newGrams / 100)
        }
        return finalMacros;
    }
}


