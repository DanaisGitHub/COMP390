"use strict";
// The massive read lines on token.init() are not errors, works just fine but I don't know why it's doing that
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = exports.RentalsDetails = exports.PaymentDetail = exports.Rental = exports.Item = exports.UserPreference = exports.User = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const itemsModel_1 = require("./typesOfModels/itemsModel");
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
class UserPreference extends sequelize_1.Model {
}
exports.UserPreference = UserPreference;
class Item extends sequelize_1.Model {
}
exports.Item = Item;
class Rental extends sequelize_1.Model {
}
exports.Rental = Rental;
class PaymentDetail extends sequelize_1.Model {
}
exports.PaymentDetail = PaymentDetail;
class RentalsDetails extends sequelize_1.Model {
}
exports.RentalsDetails = RentalsDetails;
const InitialiseDatabase = (_a = class {
    },
    _a.initUserModel = (sequelize) => {
        User.init({
            id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
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
            modelName: 'User',
        });
    },
    _a.initUserPreferenceModel = (sequelize) => {
        UserPreference.init({
            id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
            maxDistance: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, },
            maxPrice: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, },
            minRating: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, },
            dateRange: { type: sequelize_1.DataTypes.JSON, allowNull: false, },
        }, {
            sequelize,
            modelName: 'UserPreference',
        });
    },
    _a.initItems = (sequelize) => {
        Item.init({
            id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            itemName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            description: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            thumbnail: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            pricePerDay: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            itemLocation: { type: sequelize_1.DataTypes.JSON, allowNull: false },
            quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        }, {
            sequelize,
            modelName: 'Item'
        });
    },
    _a.initRentals = (sequelize) => {
        Rental.init({
            id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            rentalStartDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            rentalEndDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            rentalStatus: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            paid: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
            paymentDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            orderNumber: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        }, {
            sequelize,
            modelName: "Rental"
        });
    },
    _a.initPaymentDetails = (sequelize) => {
        PaymentDetail.init({
            id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            paymentDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            paymentType: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            allowed: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
        }, {
            sequelize,
            modelName: "PaymentDetail"
        });
    },
    _a.initRentalsDetails = (sequelize) => {
        RentalsDetails.init({
            id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            price: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            total: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            discount: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            paymentDetails: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            billDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            orderNumber: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        }, {
            sequelize,
            modelName: "RentalsDetail"
        });
    },
    /**
     * make a one to many relation between two models
     *
     * @param options
     */
    _a.hasManyRelation = (options) => {
        const { model, otherModel, modelAs, otherAs, foreignKey } = options;
        model.hasMany(otherModel, {
            foreignKey: foreignKey,
            as: modelAs
        });
        otherModel.belongsTo(model, { foreignKey: foreignKey, as: otherAs });
    },
    /**
     * make a one to many relation between two models with custom onDelete behaviour
     *
     * @param options
     */
    _a.hasManyRelationOnDelete = (options) => {
        const { model, otherModel, modelAs, otherAs, foreignKey, onDelete } = options;
        model.hasMany(otherModel, {
            foreignKey: foreignKey,
            as: modelAs,
            onDelete: onDelete
        });
        otherModel.belongsTo(model, { foreignKey: foreignKey, as: otherAs });
    },
    /**
     * make a one to one relation between two models
     *
     * @param options
     */
    _a.hasOneRelation = (options) => {
        const { model, otherModel, modelAs, otherAs, foreignKey } = options;
        model.hasOne(otherModel, {
            foreignKey: foreignKey,
            as: modelAs
        });
        otherModel.belongsTo(model, { foreignKey: foreignKey, as: otherAs });
    },
    _a.enableFullTextSearch = () => {
        itemsModel_1.ItemsModel.makeItemsFullTextSearchable();
        //ALTER TABLE item ADD FULLTEXT(itemName, description);
    },
    _a);
const initialize = async () => {
    try {
        const initDB = InitialiseDatabase;
        initDB.initUserModel(exports.sequelize);
        initDB.initUserPreferenceModel(exports.sequelize);
        initDB.initItems(exports.sequelize);
        initDB.initRentals(exports.sequelize);
        initDB.initPaymentDetails(exports.sequelize);
        initDB.initRentalsDetails(exports.sequelize);
        // User.hasMany(Item, {
        //     foreignKey: "ownerId",
        //     onDelete: "CASCADE",// will delete all items that belong to user if user is deleted
        // })
        // Item.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' }) // that as is not working to redefine the name of the foreign key
        initDB.hasManyRelationOnDelete({ model: User, otherModel: Item, foreignKey: "ownerId", onDelete: "CASCADE", modelAs: 'owner' });
        //User has many Rentals
        // User.hasMany(Rental, {
        //     foreignKey: "renterId",
        //     as: "renter"
        // })
        // Rental.belongsTo(User, { foreignKey: 'renterId', as: 'renter' })
        // User.hasMany(Rental, {
        //     foreignKey: "letterId",
        //     as: "letter"
        // })
        // Rental.belongsTo(User, { foreignKey: 'letterId', as: 'letter' })
        initDB.hasManyRelation({ model: User, otherModel: Rental, modelAs: "renter", otherAs: "renter", foreignKey: "renterId" }); // NOTE: I think foreign key is wrong should be userID
        initDB.hasManyRelation({ model: User, otherModel: Rental, modelAs: "letter", otherAs: "letter", foreignKey: "letterId" }); // NOTE: I think foreign key is wrong should be userID
        // //user <--> userPreference
        // User.hasOne(UserPreference, {
        //     foreignKey: "userId", // error here
        // })
        // UserPreference.belongsTo(User, { foreignKey: 'userId', as: 'user' })
        initDB.hasOneRelation({ model: User, otherModel: UserPreference, foreignKey: "preferenceId", otherAs: "preference" });
        // //Rental has one payment
        // Rental.hasOne(PaymentDetail, {
        //     foreignKey: "rental",
        // })
        // PaymentDetail.belongsTo(Rental, { as: "rentalPayment", foreignKey: "rental" })
        initDB.hasOneRelation({ model: Rental, otherModel: PaymentDetail, foreignKey: "rental", modelAs: "rentalPayment" });
        // //items has many Rental details
        // Item.hasMany(RentalsDetails, {
        //     foreignKey: "itemId"
        // })
        // RentalsDetails.belongsTo(Item, { as: "item", foreignKey: "itemId" })
        initDB.hasManyRelation({ model: Item, otherModel: RentalsDetails, foreignKey: "itemId", otherAs: "item" });
        // //Rentals has many Rental details
        // Rental.hasMany(RentalsDetails, {
        //     foreignKey: "rentalId"
        // })
        // RentalsDetails.belongsTo(Rental, { as: "rental", foreignKey: "rentalId" })
        initDB.hasManyRelation({ model: Rental, otherModel: RentalsDetails, foreignKey: "rentalId", otherAs: "rental" });
        await exports.sequelize.sync({ force: true }); // should init all models and reset the database
        console.log("Database models initialized");
        await initDB.enableFullTextSearch();
    }
    catch (err) {
        console.log(err);
        throw new Error("Could not initialize database models!!!!!!!!!!!!!!!!!!!: " + err);
    }
};
exports.initialize = initialize;
// // user has many Rentals/Orders
