"use strict";
// The massive read lines on token.init() are not errors, works just fine but I don't know why it's doing that
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = exports.CustomFoodData = exports.FoodData = exports.Excerises = exports.UserLogs = exports.User = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
/**
 * param1: database name (like CREATE DB )
 * param2: username (profile of mysql)
 * param3: password (db name)
 * param4: options
 */
exports.sequelize = new sequelize_1.Sequelize('boilerplate', 'root', 'mysql', {
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
class User extends sequelize_1.Model {
}
exports.User = User;
class UserLogs extends sequelize_1.Model {
}
exports.UserLogs = UserLogs;
class Excerises extends sequelize_1.Model {
}
exports.Excerises = Excerises;
;
class FoodData extends sequelize_1.Model {
}
exports.FoodData = FoodData;
class CustomFoodData extends sequelize_1.Model {
}
exports.CustomFoodData = CustomFoodData;
const initUserModel = (sequelize) => {
    User.init({
        id: { type: sequelize_1.DataTypes.STRING, primaryKey: true, },
        firstName: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
        lastName: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
        password: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
        refreshToken: { type: sequelize_1.DataTypes.STRING(2048), allowNull: true, },
        birthDate: { type: sequelize_1.DataTypes.DATE, allowNull: false, },
        calorieGoal: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, },
        weight: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, },
        height: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, },
        gender: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, }
    }, {
        sequelize,
        modelName: 'Users',
    });
};
const initCustomFoodData = (sequelize) => {
    CustomFoodData.init({
        id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        foodName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        calories: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        sugar: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        carbohydrates: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        fat: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        protein: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        fibre: { type: sequelize_1.DataTypes.INTEGER, allowNull: false }
    }, {
        sequelize,
        modelName: 'CustomFoodData'
    });
};
const initUserLogsModel = (sequelize) => {
    UserLogs.init({
        date: {
            type: sequelize_1.DataTypes.DATE,
            primaryKey: true
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            primaryKey: true
        },
        foodId: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            get() {
                const value = this.getDataValue('foodId');
                return value;
            },
            set(value) {
                this.setDataValue('foodId', value);
            }
        },
        customFoodId: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            get() {
                const value = this.getDataValue('customFoodId');
                return value;
            },
            set(value) {
                this.setDataValue('customFoodId', value);
            }
        },
        exerciseId: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            get() {
                const value = this.getDataValue('exerciseId');
                return value;
            },
            set(value) {
                this.setDataValue('exerciseId', value);
            }
        },
    }, {
        sequelize,
        modelName: "UserLogs"
    });
};
const initExcerisesModel = (sequelize) => {
    Excerises.init({
        id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        exerciseName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        emailId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        caloriesBurned: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        exerciseTime: { type: sequelize_1.DataTypes.INTEGER, allowNull: false }
    }, {
        sequelize,
        modelName: "Excerises"
    });
};
const initFoodDataModel = (sequelize) => {
    FoodData.init({
        id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        foodName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        calories: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        sugar: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        carbohydrates: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        fat: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        protein: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        fibre: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false }
    }, {
        sequelize,
        modelName: "FoodData",
    });
};
const initialize = async () => {
    try {
        initUserModel(exports.sequelize);
        initCustomFoodData(exports.sequelize);
        initExcerisesModel(exports.sequelize);
        initUserLogsModel(exports.sequelize);
        initFoodDataModel(exports.sequelize);
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
        await exports.sequelize.sync(); // should init all models and reset the database
        console.log("Database models initialized");
    }
    catch (err) {
        console.log(err);
        throw new Error("Could not initialize database models: " + err);
    }
};
exports.initialize = initialize;
