export interface FoodNutrients {
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    value: number,
    rank: number;
    indentLevel: number;
    foodNutrientId: number;
}

export interface Foods {
    fdcId: number,
    description: string,
    commonNames: string,
    additionalDescriptions: string,
    dataType: string,
    foodCode: number,
    publishedDate: string,
    foodCategory: string,
    foodCategoryId: number,
    allHighlightFields: string,
    score: number,
    microbes: any,
    foodNutrients: [FoodNutrients]
    finalFoodInputFoods:
    [
        foodDescription: string,
        gramWeight: number,
        id: number,
        portionCode: number,
        portionDescription: string,
        unit: string,
        rank: number,
        srCode: number,
        value: number,
    ],
    foodMeasures: [
        disseminationText: string,
        gramWeight: number,
        id: number,
        modifier: string,
        rank: number,
        measureUnitAbbreviation: string,
        measureUnitName: string,
        measureUnitId: number
    ],
    foodAttributes: any,
    foodAttributeTypes: any
    foodVersionIds: any
}


export interface Macros {
    protein: number,
    carbs: number,
    fat: number,
    calories: number,
    sugar: number,
    fiber: number
}

