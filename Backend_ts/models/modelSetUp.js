"use strict";
// The massive read lines on token.init() are not errors, works just fine but I don't know why it's doing that
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = exports.Author = exports.Format = exports.Genre = exports.BookGenre = exports.BookFormat = exports.BookAuthor = exports.BookItem = exports.RentalsDetails = exports.PaymentDetail = exports.Rental = exports.Item = exports.UserPreference = exports.User = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const itemsModel_1 = require("./typesOfModels/itemsModel");
const bookModel_1 = require("./typesOfModels/bookModel");
let deleteDatabase = true;
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
    _a.initBookItems = (sequelize) => {
        BookItem.init({
            id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            book: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            series: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            releaseNumber: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
            author: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            numPages: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            format: { type: sequelize_1.DataTypes.JSON, allowNull: false },
            genres: { type: sequelize_1.DataTypes.JSON, allowNull: false },
            publication: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            rating: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            numberOfVoters: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        }, {
            sequelize,
            modelName: "BookItem"
        });
    },
    _a.initBookAuthor = (sequelize) => {
        BookAuthor.init({
            bookId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, allowNull: false },
            authorId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, allowNull: false },
        }, {
            sequelize,
            modelName: "BookAuthor"
        });
    },
    _a.initBookFormat = (sequelize) => {
        BookFormat.init({
            bookId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, allowNull: false },
            formatId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, allowNull: false },
        }, {
            sequelize,
            modelName: "BookFormat"
        });
    },
    _a.initBookGenre = (sequelize) => {
        BookGenre.init({
            bookId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, allowNull: false },
            genreId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, allowNull: false },
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
        itemsModel_1.ItemModel.makeItemsFullTextSearchable();
        //ALTER TABLE item ADD FULLTEXT(itemName, description);
    },
    _a.addBookAndLinks = async () => {
        const bookItemModel = new bookModel_1.BookItemModel();
        await bookItemModel.addBooksAndLinks();
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
        initDB.initBookItems(exports.sequelize);
        initDB.initBookAuthor(exports.sequelize);
        initDB.initBookFormat(exports.sequelize);
        initDB.initBookGenre(exports.sequelize);
        initDB.initGenre(exports.sequelize);
        initDB.initFormat(exports.sequelize);
        initDB.initAuthor(exports.sequelize);
        // User has many Items
        initDB.hasManyRelationOnDelete({ model: User, otherModel: Item, foreignKey: "ownerId", onDelete: "CASCADE", modelAs: 'owner' });
        //User has many Rentals
        initDB.hasManyRelation({ model: User, otherModel: Rental, modelAs: "renter", otherAs: "renter", foreignKey: "renterId" }); // NOTE: I think foreign key is wrong should be userID
        initDB.hasManyRelation({ model: User, otherModel: Rental, modelAs: "letter", otherAs: "letter", foreignKey: "letterId" }); // NOTE: I think foreign key is wrong should be userID
        // //user <--> userPreference
        initDB.hasOneRelation({ model: User, otherModel: UserPreference, foreignKey: "preferenceId", otherAs: "preference" });
        // //Rental has one payment
        initDB.hasOneRelation({ model: Rental, otherModel: PaymentDetail, foreignKey: "rental", modelAs: "rentalPayment" });
        // //items has many Rental details
        initDB.hasManyRelation({ model: Item, otherModel: RentalsDetails, foreignKey: "itemId", otherAs: "item" });
        // //Rentals has many Rental details
        initDB.hasManyRelation({ model: Rental, otherModel: RentalsDetails, foreignKey: "rentalId", otherAs: "rental" });
        // //BookItem has many BookAuthors
        initDB.hasManyRelation({ model: BookItem, otherModel: BookAuthor, foreignKey: "bookId", otherAs: "bookAuthors" });
        // //BookItem has many BookFormats
        initDB.hasManyRelation({ model: BookItem, otherModel: BookFormat, foreignKey: "bookId", otherAs: "bookFormats" });
        // //BookItem has many BookGenres
        initDB.hasManyRelation({ model: BookItem, otherModel: BookGenre, foreignKey: "bookId", otherAs: "bookGenres" });
        // formats has many BookFormats
        initDB.hasManyRelation({ model: Format, otherModel: BookFormat, foreignKey: "formatId", otherAs: "formatBooks" });
        // genres has many BookGenres
        initDB.hasManyRelation({ model: Genre, otherModel: BookGenre, foreignKey: "genreId", otherAs: "genreBooks" });
        // authors has many BookAuthors
        initDB.hasManyRelation({ model: Author, otherModel: BookAuthor, foreignKey: "authorId", otherAs: "authorBooks" });
        const options = deleteDatabase ? { force: true } : undefined;
        await exports.sequelize.sync(options); // should init all models and reset the database
        console.log("Database models initialized");
        if (deleteDatabase) {
            await initDB.enableFullTextSearch();
            await initDB.addBookAndLinks();
        }
    }
    catch (err) {
        console.log(err);
        throw new Error("Could not initialize database models!!!!!!!!!!!!!!!!!!!: " + err);
    }
};
exports.initialize = initialize;
// // user has many Rentals/Orders
