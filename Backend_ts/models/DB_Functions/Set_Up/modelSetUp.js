"use strict";
// The massive read lines on token.init() are not errors, works just fine but I don't know why it's doing that
// BOTTOM NEEDS CLEANING
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = exports.Author = exports.Format = exports.Genre = exports.BookGenre = exports.BookFormat = exports.BookAuthor = exports.BookItem = exports.BookPreference = exports.RentalsDetails = exports.PaymentDetail = exports.Rental = exports.Item = exports.UserPreference = exports.User = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const ItemsModel_1 = require("../../typesOfModels/Items/ItemsModel");
const bookModel_1 = require("../../typesOfModels/Items/bookModel");
const userModels_1 = require("../../typesOfModels/Users/userModels");
let dropDB = true; // delete most tables not book
let dropBook = true; // delete book tables
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
// export class User extends Model<TempUserType> implements TempUserType {
//     public id!: number;//Primary key
//     public firstName!: string;
//     public lastName!: string;
//     public password!: string;
//     public refreshToken?: string; // not sure of ?
//     public birthDate!: Date;
//     public profilePicture?: string;
//     public location!: coordiantes;
//     public paymentDetailsId!: number;
//     public userEmail!: string;
//     public CryptoPaymentsId!: number;
//     public readonly createdAt!: Date;
//     public readonly updatedAt!: Date;
// }
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
class BookPreference extends sequelize_1.Model {
}
exports.BookPreference = BookPreference;
class BookItem extends sequelize_1.Model {
}
exports.BookItem = BookItem;
class BookAuthor extends sequelize_1.Model {
}
exports.BookAuthor = BookAuthor;
class BookFormat extends sequelize_1.Model {
}
exports.BookFormat = BookFormat;
class BookGenre extends sequelize_1.Model {
}
exports.BookGenre = BookGenre;
class Genre extends sequelize_1.Model {
}
exports.Genre = Genre;
class Format extends sequelize_1.Model {
}
exports.Format = Format;
class Author extends sequelize_1.Model {
}
exports.Author = Author;
//export class BoookAuthor
const InitialiseDatabase = (_a = class {
    },
    _a.initUserModel = (sequelize) => {
        User.init({
            id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
            firstName: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
            lastName: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
            password: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
            userEmail: { type: sequelize_1.DataTypes.STRING, allowNull: false, },
            refreshToken: { type: sequelize_1.DataTypes.STRING(2048), allowNull: true, },
            birthDate: { type: sequelize_1.DataTypes.DATE, allowNull: false, },
            profilePicture: { type: sequelize_1.DataTypes.STRING, allowNull: true, },
            location: { type: sequelize_1.DataTypes.JSON, allowNull: true, },
            paymentDetailsId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, },
            CryptoPaymentsId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, },
        }, {
            sequelize,
            modelName: 'User',
        });
    },
    _a.initUserPreferenceModel = (sequelize) => {
        UserPreference.init({
            userID: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            distanceRange: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: { min: 0, max: 1000000 } },
            priceRange: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: { min: 0, max: 1000000 } },
            ratingRange: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: { min: 0, max: 5.0 } },
            dateRange: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: { start: new Date(1970), end: new Date(3000) } },
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
            itemLocation: { type: sequelize_1.DataTypes.JSON, allowNull: true },
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
    _a.initBookPreference = (sequelize) => {
        BookPreference.init({
            userID: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, },
            authorPreference: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: [] },
            genrePreference: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: [] },
            formatPreference: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: [] },
            publicationRange: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: { min: new Date(1970), max: new Date(3000) } },
            bookLengthRange: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: { min: 0, max: 1000000 } },
        }, {
            sequelize,
            modelName: "BookPreference"
        });
    },
    _a.initBookItems = (sequelize) => {
        BookItem.init({
            id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            book: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            series: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            numPages: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            publication: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            rating: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            numOfVoters: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        }, {
            sequelize,
            modelName: "BookItem"
        });
    },
    _a.initBookAuthor = (sequelize) => {
        BookAuthor.init({
            id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            bookId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: false, allowNull: false },
            authorId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: false, allowNull: false },
        }, {
            sequelize,
            modelName: "BookAuthor"
        });
    },
    _a.initBookFormat = (sequelize) => {
        BookFormat.init({
            id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            bookId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: false, allowNull: false },
            formatId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: false, allowNull: false },
        }, {
            sequelize,
            modelName: "BookFormat"
        });
    },
    _a.initBookGenre = (sequelize) => {
        BookGenre.init({
            id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            bookId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: false, allowNull: false },
            genreId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: false, allowNull: false },
        }, {
            sequelize,
            modelName: "BookGenre"
        });
    },
    _a.initGenre = (sequelize) => {
        Genre.init({
            id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        }, {
            sequelize,
            modelName: "Genre"
        });
    },
    _a.initFormat = (sequelize) => {
        Format.init({
            id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        }, {
            sequelize,
            modelName: "Format"
        });
    },
    _a.initAuthor = (sequelize) => {
        Author.init({
            id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        }, {
            sequelize,
            modelName: "Author"
        });
    },
    _a.initAllTables = async (sequelize) => {
        _a.initUserModel(sequelize);
        _a.initUserPreferenceModel(sequelize);
        _a.initItems(sequelize);
        _a.initRentals(sequelize);
        _a.initPaymentDetails(sequelize);
        _a.initRentalsDetails(sequelize);
        _a.initBookItems(sequelize);
        _a.initBookAuthor(sequelize);
        _a.initBookFormat(sequelize);
        _a.initBookGenre(sequelize);
        _a.initGenre(sequelize);
        _a.initFormat(sequelize);
        _a.initAuthor(sequelize);
        _a.initBookPreference(sequelize);
    },
    /**
     * make a one to many relation between two models
     *
     * @param options
     */
    _a.hasManyRelation = (options) => {
        const { modelA: model, modelB: otherModel, modelAs, otherAs, foreignKey } = options;
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
        const { modelA: model, modelB: otherModel, modelAs, otherAs, foreignKey, onDelete } = options;
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
        const { modelA: model, modelB: otherModel, modelAs, otherAs, foreignKey } = options;
        model.hasOne(otherModel, {
            foreignKey: foreignKey,
            as: modelAs
        });
        otherModel.belongsTo(model, { foreignKey: foreignKey, as: otherAs });
    },
    _a.createAllRelations = () => {
        _a.hasManyRelationOnDelete({ modelA: User, modelB: Item, foreignKey: "ownerId", onDelete: "CASCADE", modelAs: 'owner' });
        // User <-=> Rentals * 2
        _a.hasManyRelation({ modelA: User, modelB: Rental, modelAs: "renter", otherAs: "renter", foreignKey: "renterId" }); // NOTE: I think foreign key is wrong should be userID
        _a.hasManyRelation({ modelA: User, modelB: Rental, modelAs: "letter", otherAs: "letter", foreignKey: "letterId" }); // NOTE: I think foreign key is wrong should be userID
        // user <--> userPreference
        _a.hasOneRelation({ modelA: User, modelB: UserPreference, foreignKey: "userID", otherAs: "userPreference" }); // pk is userID
        // user <--> bookPreference
        _a.hasOneRelation({ modelA: User, modelB: BookPreference, foreignKey: "userID", otherAs: "bookPreference" }); // pk is userID
        // Rental <--> payment
        _a.hasOneRelation({ modelA: Rental, modelB: PaymentDetail, foreignKey: "rental", modelAs: "rentalPayment" });
        //items <-=> Rental details
        _a.hasManyRelation({ modelA: Item, modelB: RentalsDetails, foreignKey: "itemId", otherAs: "item" });
        // Rentals <-=> Rental details
        _a.hasManyRelation({ modelA: Rental, modelB: RentalsDetails, foreignKey: "rentalId", otherAs: "rental" });
        // BookItem <-=> BookAuthors
        _a.hasManyRelation({ modelA: BookItem, modelB: BookAuthor, foreignKey: "bookId", otherAs: "bookAuthors" });
        // BookItem <-=> BookFormats
        _a.hasManyRelation({ modelA: BookItem, modelB: BookFormat, foreignKey: "bookId", otherAs: "bookFormats" });
        // BookItem <-=> BookGenres
        _a.hasManyRelation({ modelA: BookItem, modelB: BookGenre, foreignKey: "bookId", otherAs: "bookGenres" });
        // formats <-=> BookFormats
        _a.hasManyRelation({ modelA: Format, modelB: BookFormat, foreignKey: "formatId", otherAs: "formatBooks" });
        // genres <-=> BookGenres
        _a.hasManyRelation({ modelA: Genre, modelB: BookGenre, foreignKey: "genreId", otherAs: "genreBooks" });
        // authors <-=> BookAuthors
        _a.hasManyRelation({ modelA: Author, modelB: BookAuthor, foreignKey: "authorId", otherAs: "authorBooks" });
    },
    _a.dropDatabaseNotBooks = async () => {
        // order matters I think
        await UserPreference.drop();
        await PaymentDetail.drop();
        await RentalsDetails.drop();
        await Rental.drop();
        await Item.drop();
        await User.drop();
    },
    _a);
const DBSetupListener = (_b = class {
    },
    _b.enableFullTextSearch = async () => {
        await ItemsModel_1.ItemModel.makeItemsFullTextSearchable();
    },
    _b.addBookAndLinks = async () => {
        const bookItem = new bookModel_1.BookItemModel();
        bookItem.addAllBookItems();
    },
    _b.create10NewUsers = async () => {
        const userModel = new userModels_1.UserModel();
        userModel.createManyRandomUsers(10);
    },
    _b.dropTables1 = async () => {
        if (dropDB && !dropBook) { // Dropping all tables except books
            await InitialiseDatabase.dropDatabaseNotBooks();
            console.log("Dropped all tables except books");
        }
    },
    _b.dropTables2 = async () => {
        if (dropDB) {
            await DBSetupListener.enableFullTextSearch();
            if (dropBook) {
                await DBSetupListener.addBookAndLinks();
            }
        }
    },
    _b.runBeforeCreation = async () => {
        await DBSetupListener.dropTables1();
    },
    _b.runAfterCreation = async () => {
        await DBSetupListener.dropTables2();
        await DBSetupListener.create10NewUsers();
    },
    _b);
const initialize = async () => {
    try {
        await InitialiseDatabase.initAllTables(exports.sequelize);
        await DBSetupListener.runBeforeCreation();
        InitialiseDatabase.createAllRelations();
        let options = dropDB && dropBook ? { force: true } : undefined;
        await exports.sequelize.sync(options);
        await DBSetupListener.runAfterCreation();
        console.log("Database models initialized");
    }
    catch (err) {
        console.log(err);
        throw new Error("Could not initialize database models!!!!!!!!!!!!!!!!!!!: " + err);
    }
};
exports.initialize = initialize;
// user <-=> Rentals/Orders