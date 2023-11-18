

// Since some id's is auto incremented input into db is not needed
export interface UserAttributesType {
    firstName: string;
    lastName: string;
    id: string;//Primary key
    password: string;
    refreshToken?: string; // not sure of ?
    birthDate: Date;
    calorieGoal: number;
    weight: number;
    height: number;
    gender:number //1 = female or 2 = male;

}

export interface UserLogsType {
    date: Date; // will need extra processing to get the date conversions
    email: string;//foreign key
    foodId?: number[];//foreign key
    //foodIdMass?: number;
    customFoodId?: number[];//foreign key
    //customFoodIdMass?: number;
    exerciseId?: number[];//foreign key
    //exerciseIdTime?: number;
}

export interface UserLogsTypeWithData {
    date: Date; 
    email: string;

    foodId?: FoodDataType[];
    customFoodId?: CustomFoodDataType[];
    exerciseId?: ExcerisesType[];
}

export interface ExcerisesType {
    id?: number; // primary key
    emailId: string;//foreign key
    exerciseName: string;
    caloriesBurned: number;//really should be a float
    exerciseTime: number;
}

export interface FoodDataType {
    id?: number; // primary key
    foodName: string;
    calories: number;
    sugar: number;//really should be a float from here down
    carbohydrates: number;
    fat: number;
    protein: number;
    fibre: number;
    quantity: number;
}

export interface CustomFoodDataType {
    id?: number; // primary key
    foodName: string;
    calories: number;
    sugar: number;
    carbohydrates: number;
    fat: number;
    protein: number;
    fibre: number;
}

export interface Macros {
    date?: Date;
    calories: number;
    sugar: number;
    carbohydrates: number;
    fat: number;
    protein: number;
    fibre: number;
}



