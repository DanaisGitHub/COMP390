"use strict";
// The massive read lines on token.init() are not errors, works just fine but I don't know why it's doing that
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = exports.RentalsDetails = exports.PaymentDetails = exports.Rentals = exports.Items = exports.User = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
/**
 * param1: database name (like CREATE DB )
 * param2: username (profile of mysql)
 * param3: password (db name)
 * param4: options
 */
exports.sequelize = new sequelize_1.Sequelize('Sprint1BasicEComDb', 'root', 'mysql', {
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
class RentalsDetails extends sequelize_1.Model {
}
exports.RentalsDetails = RentalsDetails;
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
const initRentalsDetails = (sequelize) => {
    RentalsDetails.init({
        rentalDetailId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        price: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        total: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        discount: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        paymentDetails: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        billDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        orderNumber: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    }, {
        sequelize,
        modelName: "RentalsDetails"
    });
};
const initialize = async () => {
    try {
        initUserModel(exports.sequelize);
        initItems(exports.sequelize);
        initRentals(exports.sequelize);
        initPaymentDetails(exports.sequelize);
        initRentalsDetails(exports.sequelize);
        //i think async skipping to creating assostiations before the models are created
        User.hasMany(Items, {
            foreignKey: "ownerId",
            onDelete: "CASCADE", // will delete all items that belong to user if user is deleted
        });
        Items.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
        //User has many Rentals
        User.hasMany(Rentals, {
            foreignKey: "renterId",
            as: "renter"
        });
        User.hasMany(Rentals, {
            foreignKey: "letterId",
            as: "letter"
        });
        Rentals.belongsTo(User, { foreignKey: 'renterId', as: 'renter' });
        Rentals.belongsTo(User, { foreignKey: 'letterId', as: 'letter' });
        //Rental has one payment
        Rentals.hasOne(PaymentDetails, {
            foreignKey: "rental",
        });
        PaymentDetails.belongsTo(Rentals, { as: "rentalPayment", foreignKey: "rental" });
        //items has many Rental details
        Items.hasMany(RentalsDetails, {
            foreignKey: "itemId"
        });
        RentalsDetails.belongsTo(Items, { as: "item", foreignKey: "itemId" });
        //Rentals has many Rental details
        Rentals.hasMany(RentalsDetails, {
            foreignKey: "rentalId"
        });
        RentalsDetails.belongsTo(Rentals, { as: "rental", foreignKey: "rentalId" });
        await exports.sequelize.sync({ force: true }); // should init all models and reset the database
        console.log("Database models initialized");
    }
    catch (err) {
        console.log(err);
        throw new Error("Could not initialize database models: " + err);
    }
};
exports.initialize = initialize;
// // user has many Rentals/Orders
