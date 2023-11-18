// The massive read lines on token.init() are not errors, works just fine but I don't know why it's doing that

import {
    Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
    HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, Model, ModelDefined, Optional,
    Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasMany, BelongsTo, BelongsToMany, HasOne
} from 'sequelize';

import StdReturn from '../types/types';
import mysql from "mysql2";
import { UserAttributesType, UserLogsType, ExcerisesType, FoodDataType, CustomFoodDataType } from '../types/dbTypes';


/**
 * param1: database name (like CREATE DB )
 * param2: username (profile of mysql)
 * param3: password (db name)
 * param4: options  
 */
export const sequelize = new Sequelize('boilerplate', 'root', 'mysql', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export class User extends Model<UserAttributesType> implements UserAttributesType {
    public firstName!: string;
    public lastName!: string;
    public id!: string;
    public password!: string;
    public refreshToken?: string;
    public birthDate!: Date;
    public calorieGoal!: number;
    public weight!: number;
    public height!: number;
    public gender!: number

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

}

export class UserLogs extends Model<UserLogsType> implements UserLogsType {
    public date!: Date;
    public email!: string;
    public foodId!: number[];
    public customFoodId!: number[];
    public exerciseId!: number[];

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class Excerises extends Model<ExcerisesType> implements ExcerisesType {
    public id!: number;
    public emailId!: string;
    public exerciseName!: string;
    public caloriesBurned!: number;
    public exerciseTime!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
};



export class FoodData extends Model<FoodDataType> implements FoodDataType {
    public id!: number;
    public foodName!: string;
    public calories!: number;
    public sugar!: number;
    public carbohydrates!: number;
    public fat!: number;
    public protein!: number;
    public fibre!: number;
    public quantity!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}


export class CustomFoodData extends Model<CustomFoodDataType> implements CustomFoodDataType {
    public id!: number;
    public foodName!: string;
    public calories!: number;
    public sugar!: number;
    public carbohydrates!: number;
    public fat!: number;
    public protein!: number;
    public fibre!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}


const initUserModel = (sequelize: Sequelize) => { // so why does this not all the other definitions but the others do
    User.init(
        {
            id: { type: DataTypes.STRING, primaryKey: true, },
            firstName: { type: DataTypes.STRING, allowNull: false, },
            lastName: { type: DataTypes.STRING, allowNull: false, },
            password: { type: DataTypes.STRING, allowNull: false, },
            refreshToken: { type: DataTypes.STRING(2048), allowNull: true, },
            birthDate: { type: DataTypes.DATE, allowNull: false, },
            calorieGoal: { type: DataTypes.INTEGER, allowNull: false, },
            weight: { type: DataTypes.INTEGER, allowNull: false, },
            height: { type: DataTypes.INTEGER, allowNull: false, },
            gender: { type: DataTypes.INTEGER, allowNull: false, }
        },
        {
            sequelize,
            modelName: 'Users',
        }
    );
};

const initCustomFoodData = (sequelize: Sequelize) => {
    CustomFoodData.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            foodName: { type: DataTypes.STRING, allowNull: false },
            calories: { type: DataTypes.INTEGER, allowNull: false },
            sugar: { type: DataTypes.INTEGER, allowNull: false },
            carbohydrates: { type: DataTypes.INTEGER, allowNull: false },
            fat: { type: DataTypes.INTEGER, allowNull: false },
            protein: { type: DataTypes.INTEGER, allowNull: false },
            fibre: { type: DataTypes.INTEGER, allowNull: false }
        },
        {
            sequelize,
            modelName: 'CustomFoodData'
        }
    );
};

const initUserLogsModel = (sequelize: Sequelize) => {
    UserLogs.init(
        {
            date: {
                type: DataTypes.DATE,
                primaryKey: true
            },
            email: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            foodId: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
                get(){
                    const value = this.getDataValue('foodId');
                    return value;
                },
                set(value: number[]){
                    this.setDataValue('foodId', value);
                }
            },
            customFoodId: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
                get(){
                    const value = this.getDataValue('customFoodId');
                    return value;
                },
                set(value: number[]){
                    this.setDataValue('customFoodId', value);
                }
            },
            exerciseId: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue:[],
                get(){
                    const value = this.getDataValue('exerciseId');
                    return value;
                },
                set(value: number[]){
                    this.setDataValue('exerciseId', value);
                }
            },
        },
        {
            sequelize,
            modelName: "UserLogs"
        }
    );
}

const initExcerisesModel = (sequelize: Sequelize) => {
    Excerises.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            exerciseName: { type: DataTypes.STRING, allowNull: false },
            emailId: { type: DataTypes.STRING, allowNull: false },
            caloriesBurned: { type: DataTypes.INTEGER, allowNull: false },
            exerciseTime: { type: DataTypes.INTEGER, allowNull: false }
        },
        {
            sequelize,
            modelName: "Excerises"
        })
};

const initFoodDataModel = (sequelize: Sequelize) => {
    FoodData.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        foodName: { type: DataTypes.STRING, allowNull: false },
        calories: { type: DataTypes.INTEGER, allowNull: false },
        sugar: { type: DataTypes.INTEGER, allowNull: false },
        carbohydrates: { type: DataTypes.INTEGER, allowNull: false },
        fat: { type: DataTypes.INTEGER, allowNull: false },
        protein: { type: DataTypes.INTEGER, allowNull: false },
        fibre: { type: DataTypes.INTEGER, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false }

    },
        {
            sequelize,
            modelName: "FoodData",
        }
    )
}

export const initialize = async () => {
    try {
        initUserModel(sequelize);
        initCustomFoodData(sequelize);
        initExcerisesModel(sequelize);
        initUserLogsModel(sequelize);
        initFoodDataModel(sequelize);

        // Assossiations

        // user has many excerises
        User.hasMany(Excerises, {
            foreignKey: 'emailId',
            sourceKey: 'id',
            as: 'excerises'
        });
        Excerises.belongsTo(User, {
            foreignKey: 'emailId',
            targetKey: 'id',
            as: 'user'
        });

        //ANY USERLOGS ASSOCIATIONS WILL NOT WORK ANYMORE

        //RETRY ASSOCIATIONS, NOW YOU HAVE A NORMALISED DATABASE

        // // foodData has many UserLogs
        // FoodData.hasMany(UserLogs, {
        //     foreignKey: 'foodId',
        //     sourceKey: 'id',
        //     as: 'userLogs'
        // });
        // UserLogs.belongsTo(FoodData, {
        //     foreignKey: 'foodId',
        //     targetKey: 'id',
        //     as: 'foodData'
        // });

        // // Users has one UserLogs ?? shouldn't they have many
        // User.hasOne(UserLogs, {
        //     foreignKey: 'email',
        //     sourceKey: 'id',
        //     as: 'userLogs'
        // });
        // UserLogs.belongsTo(User, {
        //     foreignKey: 'email',
        //     targetKey: 'id',
        //     as: 'user'
        // });

        // // Excerises has many UserLogs
        // Excerises.hasMany(UserLogs, {
        //     foreignKey: 'excerideId',
        //     sourceKey: 'id',
        //     as: 'userLogs'
        // });
        // UserLogs.belongsTo(Excerises, {
        //     foreignKey: 'excerideId',
        //     targetKey: 'id',
        //     as: 'excerises'
        // });

        // // CustomFoodData has many UserLogs
        // CustomFoodData.hasMany(UserLogs, {
        //     foreignKey: 'customFoodId',
        //     sourceKey: 'id',
        //     as: 'userLogs'
        // });
        // UserLogs.belongsTo(CustomFoodData, {
        //     foreignKey: 'customFoodId',
        //     targetKey: 'id',
        //     as: 'customFoodData'
        // })

        await sequelize.sync() // should init all models and reset the database
        console.log("Database models initialized")
    }
    catch (err) {
        console.log(err)
        throw new Error("Could not initialize database models: " + err)

    }
}


