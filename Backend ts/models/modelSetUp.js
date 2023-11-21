"use strict";
// The massive read lines on token.init() are not errors, works just fine but I don't know why it's doing that
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = exports.PaymentDetails = exports.Rentals = exports.Items = exports.User = exports.sequelize = void 0;
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
class Items extends sequelize_1.Model {
}
exports.Items = Items;
class Rentals extends sequelize_1.Model {
}
exports.Rentals = Rentals;
class PaymentDetails extends sequelize_1.Model {
}
exports.PaymentDetails = PaymentDetails;
const initUserModel = (sequelize) => {
    User.init({
        userid: { type: sequelize_1.DataTypes.STRING, primaryKey: true, },
        firstName: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
        lastName: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
        password: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
        refreshToken: { type: sequelize_1.DataTypes.STRING(2048), allowNull: true, },
        birthDate: { type: sequelize_1.DataTypes.DATE, allowNull: false, },
        profilePicture: { type: sequelize_1.DataTypes.STRING, allowNull: true, },
        location: { type: sequelize_1.DataTypes.JSON, allowNull: false, },
        paymentDetailsId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, },
        userEmail: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
        CryptoPaymentsId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, },
    }, {
        sequelize,
        modelName: 'Users',
    });
};
const initItems = (sequelize) => {
    Items.init({
        itemId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        itemName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        description: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        ownerId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        thumbnail: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        pricePerDay: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        itemLocation: { type: sequelize_1.DataTypes.JSON, allowNull: false },
        quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    }, {
        sequelize,
        modelName: 'Items'
    });
};
const initRentals = (sequelize) => {
    Rentals.init({
        rentalId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        renterId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        letterId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        rentalStartDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        rentalEndDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        rentalStatus: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        paid: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
        paymentDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        orderNumber: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    }, {
        sequelize,
        modelName: "Rentals"
    });
};
const initPaymentDetails = (sequelize) => {
    PaymentDetails.init({
        paymentId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        paymentDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        paymentType: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        allowed: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
    }, {
        sequelize,
        modelName: "PaymentDetails"
    });
};
const initialize = async () => {
    try {
        initUserModel(exports.sequelize);
        initItems(exports.sequelize);
        initRentals(exports.sequelize);
        initPaymentDetails(exports.sequelize);
        // Assossiations
        // user has many excerises
        User.hasMany(Items, {
            foreignKey: "ownerId",
            onDelete: "CASCADE" // will delete all items that belong to user if user is deleted
        });
        Items.belongsTo(User);
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
        await exports.sequelize.sync({ force: true }); // should init all models and reset the database
        console.log("Database models initialized");
    }
    catch (err) {
        console.log(err);
        throw new Error("Could not initialize database models: " + err);
    }
};
exports.initialize = initialize;
