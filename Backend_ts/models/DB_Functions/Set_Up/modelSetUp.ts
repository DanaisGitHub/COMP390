// The massive read lines on token.init() are not errors, works just fine but I don't know why it's doing that
// BOTTOM NEEDS CLEANING


import {
    Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
    HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, Model, ModelDefined, Optional,
    Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasMany, BelongsTo, BelongsToMany, HasOne
} from 'sequelize';

import StdReturn from '../../../types/baseTypes';
import mysql from "mysql2";
import { UserItemModel } from "../../typesOfModels/Items/UserItemModel";

import { TempUserType, UserPreferenceType, } from '../../../types/DBTypes/UserTypes/userTypes';
import { ItemType as UserItemType, RentalType, PaymentDetailType, RentalDetailType } from '../../../types/DBTypes/RentalTypes/rentalType';
import { BookItemType, BookAuthorType, BookFormatType, BookGenreType, GenreType, FormatType, AuthorType, BookPreferenceType, UserBookRatingType } from '../../../types/DBTypes/BookTypes/bookTypes';
import { coordiantes } from '../../../types/baseTypes';
import { BookItemModel } from '../../typesOfModels/Items/BookModels/bookModel';
import { CSVtoSQLBook } from '../Process/CSVtoSQL';
import { SyncOptions } from 'sequelize';
import { UserModel } from '../../typesOfModels/Users/userModels';


let dropDB = true; // delete most tables not book
let dropUsers = true; // delete user tables // does nothing
let dropBook = true; // delete book tables


/**
 * param1: database name (like CREATE DB )
 * param2: username (profile of mysql)
 * param3: password (db name)
 * param4: options  
 */
export const sequelize = new Sequelize('Sprint1BasicEComDb', 'root', 'mysql', {
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
//     public paymentDetailsID!: number;
//     public userEmail!: string;
//     public CryptoPaymentsID!: number;

//     public readonly createdAt!: Date;
//     public readonly updatedAt!: Date;

// }

export class User extends Model<TempUserType> implements TempUserType {
    public id!: number;//Primary key
    public firstName!: string;
    public lastName!: string;
    public sex!: boolean;
    public password!: string;
    public birthDate!: Date;
    public userEmail!: string;
    public refreshToken?: string; // not sure of ?
    public profilePicture?: string;
    public lat!: number;
    public lng!: number;
    public paymentDetailsID?: number;
    public CryptoPaymentsID?: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class UserPreference extends Model<UserPreferenceType> implements UserPreferenceType {
    public userID!: number;
    public distanceRangeMin!: number;
    public distanceRangeMax!: number;
    public priceRangeMin!: number;
    public priceRangeMax!: number;
    public ratingRangeMin!: number;
    public ratingRangeMax!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class UserItem extends Model<UserItemType> implements UserItemType {
    public id!: number;
    public ownerID!: number;
    public thumbnail?: string;
    public price!: number;
    public quantity!: number;
    public itemID!: number;


    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class Rental extends Model<RentalType> implements RentalType {
    public orderNumber!: number;
    public renterID!: number;
    public ownerID!: number;
    public startDate!: Date;
    public endDate!: Date;
    public rentalStatus!: string;
    public paid!: boolean;
    public paymentDate!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class PaymentDetail extends Model<PaymentDetailType> implements PaymentDetailType {
    public id!: number;
    public paymentDate!: Date;
    public paymentType!: string;
    public allowed!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class RentalsDetail extends Model<RentalDetailType> implements RentalDetailType {
    public id!: number;
    public itemID!: number;
    public rentalID!: number;
    public price!: number;
    public total!: number;
    public discount!: number;
    public paymentDetails!: string;
    public billDate!: Date;
    public quantity!: number;
    public orderNumber!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class BookPreference extends Model<BookPreferenceType> implements BookPreferenceType {
    public userID!: number;
    public authorPreference!: number[];
    public genrePreference!: number[];
    public formatPreference!: number[];

    public publicationRangeMin!: Date;
    public publicationRangeMax!: Date;
    public bookLengthRangeMin!: number;
    public bookLengthRangeMax!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class BookItem extends Model<BookItemType> implements BookItemType {
    public id!: number;
    public book!: string;
    public series!: string | undefined | null;
    public description!: string;
    public numPages!: number;
    public publication!: Date;
    public rating!: number;
    public numOfVoters!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class BookAuthor extends Model<BookAuthorType> implements BookAuthorType {
    public id!: number;
    public bookID!: number; // Primary & Foreign Key
    public authorID!: number; // Primary & Foreign Key

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class BookFormat extends Model<BookFormatType> implements BookFormatType {
    public id!: number;
    public bookID!: number; // Primary & Foreign Key
    public formatID!: number; // Primary & Foreign Key

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class BookGenre extends Model<BookGenreType> implements BookGenreType {
    public id!: number;
    public bookID!: number; // Primary & Foreign Key
    public genreID!: number; // Primary & Foreign Key

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class Genre extends Model<GenreType> implements GenreType {
    public id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class Format extends Model<FormatType> implements FormatType {
    public id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class Author extends Model<AuthorType> implements AuthorType {
    public id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class UserBookRating extends Model<UserBookRatingType> implements UserBookRatingType {

    public bookID!: number;
    public userID!: number;
    public rating!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

//export class BoookAuthor


const InitialiseDatabase = class { // initalises database // all FK are done in relations

    static initUserModel = (sequelize: Sequelize) => { // so why does this not all the other definitions but the others do
        User.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
                firstName: { type: DataTypes.STRING, allowNull: false, },
                lastName: { type: DataTypes.STRING, allowNull: false, },
                sex: { type: DataTypes.BOOLEAN, allowNull: false, },
                password: { type: DataTypes.STRING, allowNull: false, },
                userEmail: { type: DataTypes.STRING, allowNull: false, },
                refreshToken: { type: DataTypes.STRING(2048), allowNull: true, },
                birthDate: { type: DataTypes.DATE, allowNull: false, },
                profilePicture: { type: DataTypes.STRING, allowNull: true, },
                lat: { type: DataTypes.DOUBLE, allowNull: false, },
                lng: { type: DataTypes.DOUBLE, allowNull: false, },
                paymentDetailsID: { type: DataTypes.INTEGER, allowNull: true, },
            },
            {
                sequelize,
                modelName: 'User',
            }
        );
    };

    static initUserPreferenceModel = (sequelize: Sequelize) => {
        UserPreference.init(
            {
                userID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // FK to user
                distanceRangeMin: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
                distanceRangeMax: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1000000 },
                priceRangeMin: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
                priceRangeMax: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1000000 },
                ratingRangeMin: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
                ratingRangeMax: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 5.0 },
                dateRangeMin: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date(1970) },
                dateRangeMax: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date(3000) },
            },
            {
                sequelize,
                modelName: 'UserPreference',
            }
        );
    }

    static initUserItem = (sequelize: Sequelize) => {
        UserItem.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                thumbnail: { type: DataTypes.STRING, allowNull: true },
                price: { type: DataTypes.INTEGER, allowNull: false },
                quantity: { type: DataTypes.INTEGER, allowNull: false },
                ownerID: { type: DataTypes.INTEGER, allowNull: false },
                itemID: { type: DataTypes.INTEGER, allowNull: false },
            },
            {
                sequelize,
                modelName: 'UserItem'
            }
        );
    };

    static initRentals = (sequelize: Sequelize) => {
        Rental.init(
            {
                orderNumber: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                renterID: { type: DataTypes.INTEGER, allowNull: false },
                ownerID: { type: DataTypes.INTEGER, allowNull: false },
                startDate: { type: DataTypes.DATE, allowNull: false },
                endDate: { type: DataTypes.DATE, allowNull: false },
                rentalStatus: { type: DataTypes.STRING, allowNull: true },
                paid: { type: DataTypes.BOOLEAN, allowNull: true },
                paymentDate: { type: DataTypes.DATE, allowNull: true },
            },
            {
                sequelize,
                modelName: "Rental"
            }
        );
    }

    static initPaymentDetails = (sequelize: Sequelize) => {
        PaymentDetail.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                paymentDate: { type: DataTypes.DATE, allowNull: false },
                paymentType: { type: DataTypes.STRING, allowNull: false },
                allowed: { type: DataTypes.BOOLEAN, allowNull: false },
            },
            {
                sequelize,
                modelName: "PaymentDetail"
            });
    };

    static initRentalsDetails = (sequelize: Sequelize) => {
        RentalsDetail.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                price: { type: DataTypes.INTEGER, allowNull: false },
                itemID: { type: DataTypes.INTEGER, allowNull: false },
                discount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
                paymentDetails: { type: DataTypes.STRING, allowNull: true },
                billDate: { type: DataTypes.DATE, allowNull: true },
                quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
                orderNumber: { type: DataTypes.INTEGER, allowNull: false }
            },
            {
                sequelize,
                modelName: "RentalsDetail"
            });
    }

    static initBookPreference = (sequelize: Sequelize) => {
        BookPreference.init(
            {
                userID: { type: DataTypes.INTEGER, primaryKey: true, },
                authorPreference: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
                genrePreference: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
                formatPreference: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
                publicationRangeMin: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date(1970) },
                publicationRangeMax: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date(3000) },
                bookLengthRangeMin: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
                bookLengthRangeMax: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1000000 },
            },
            {
                sequelize,
                modelName: "BookPreference"
            });
    }

    static initBookItems = (sequelize: Sequelize) => {
        BookItem.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                book: { type: DataTypes.STRING, allowNull: false },
                series: { type: DataTypes.STRING, allowNull: true },
                description: { type: DataTypes.TEXT, allowNull: false }, // are you sure this is text
                numPages: { type: DataTypes.INTEGER, allowNull: false },
                publication: { type: DataTypes.DATE, allowNull: false },
                rating: { type: DataTypes.DOUBLE, allowNull: false },
                numOfVoters: { type: DataTypes.INTEGER, allowNull: false },
            },
            {
                sequelize,
                modelName: "BookItem"
            });
    }

    static initBookAuthor = (sequelize: Sequelize) => {
        BookAuthor.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                bookID: { type: DataTypes.INTEGER, primaryKey: false, allowNull: false },
                authorID: { type: DataTypes.INTEGER, primaryKey: false, allowNull: false },
            },
            {
                sequelize,
                modelName: "BookAuthor"
            });
    }

    static initBookFormat = (sequelize: Sequelize) => {
        BookFormat.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                bookID: { type: DataTypes.INTEGER, primaryKey: false, allowNull: false },
                formatID: { type: DataTypes.INTEGER, primaryKey: false, allowNull: false },
            },
            {
                sequelize,
                modelName: "BookFormat"
            });
    }

    static initBookGenre = (sequelize: Sequelize) => {
        BookGenre.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                bookID: { type: DataTypes.INTEGER, primaryKey: false, allowNull: false },
                genreID: { type: DataTypes.INTEGER, primaryKey: false, allowNull: false },
            },
            {
                sequelize,
                modelName: "BookGenre"
            });
    }

    static initGenre = (sequelize: Sequelize) => {
        Genre.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                name: { type: DataTypes.STRING, allowNull: false, unique: true },
            },
            {
                sequelize,
                modelName: "Genre"
            });
    }

    static initFormat = (sequelize: Sequelize) => {
        Format.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                name: { type: DataTypes.STRING, allowNull: false, unique: true },
            },
            {
                sequelize,
                modelName: "Format"
            });
    }

    static initAuthor = (sequelize: Sequelize) => {
        Author.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                name: { type: DataTypes.STRING, allowNull: false, unique: true },
            },
            {
                sequelize,
                modelName: "Author"
            });
    }

    static initUserBookRating = (sequelize: Sequelize) => {
        UserBookRating.init(
            {
                bookID: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
                userID: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
                rating: { type: DataTypes.DOUBLE, allowNull: false },
            },
            {
                sequelize,
                modelName: "UserBookRating"
            });
    }

    static initAllTables = (sequelize: Sequelize) => {
        this.initUserModel(sequelize);
        this.initUserPreferenceModel(sequelize);
        this.initUserItem(sequelize);
        this.initRentals(sequelize);
        this.initPaymentDetails(sequelize);
        this.initRentalsDetails(sequelize);
        this.initBookItems(sequelize);
        this.initBookAuthor(sequelize);
        this.initBookFormat(sequelize);
        this.initBookGenre(sequelize);
        this.initGenre(sequelize);
        this.initFormat(sequelize);
        this.initAuthor(sequelize);
        this.initBookPreference(sequelize);
        this.initUserBookRating(sequelize);
    }

    /**
     * make a one to many relation between two models
     * 
     * @param options 
     */
    static hasManyRelation = (options: { modelA: ModelDefined<any, any>, modelB: ModelDefined<any, any>, as?: string, otherAs?: string, foreignKey: string }) => {
        const { modelA: model, modelB: otherModel, as, otherAs, foreignKey } = options;
        model.hasMany(otherModel, {
            foreignKey: foreignKey,
            as
        })
        otherModel.belongsTo(model, { foreignKey: foreignKey, as: otherAs })
    }

    /**
     * make a one to many relation between two models with custom onDelete behaviour
     * 
     * @param options 
     */
    static hasManyRelationOnDelete = (options: { modelA: ModelDefined<any, any>, modelB: ModelDefined<any, any>, as?: string, otherAs?: string, foreignKey: string, onDelete: string }) => {
        const { modelA: model, modelB: otherModel, as, otherAs, foreignKey, onDelete } = options;
        model.hasMany(otherModel, {
            foreignKey: foreignKey,
            as,
            onDelete: onDelete
        })
        otherModel.belongsTo(model, { foreignKey: foreignKey, as: otherAs })
    }

    /**
     * make a one to one relation between two models
     * 
     * @param options 
     */
    static hasOneRelation = (options: { modelA: ModelDefined<any, any>, modelB: ModelDefined<any, any>, as?: string, otherAs?: string, foreignKey: string }) => {
        const { modelA: model, modelB: otherModel, as, otherAs, foreignKey } = options;
        model.hasOne(otherModel, {
            foreignKey: foreignKey,
            as,
            onDelete: "CASCADE"
        })
        otherModel.belongsTo(model, { foreignKey: foreignKey, as: otherAs })
    }

    // not sure if done correctly, when querying we'll see
    static createAllRelations = () => {
        // User <-=> Items
        this.hasManyRelationOnDelete({ modelA: User, modelB: UserItem, foreignKey: "ownerID", onDelete: "CASCADE", as: 'owner' })
        // User <-=> Rentals * 2
        this.hasManyRelation({ modelA: User, modelB: Rental, as: "renter", otherAs: "renter", foreignKey: "renterID" })// NOTE: I think foreign key is wrong should be userID
        this.hasManyRelation({ modelA: User, modelB: Rental, as: "letter", otherAs: "letter", foreignKey: "ownerID" })// NOTE: I think foreign key is wrong should be userID

        // user <--> userPreference
        this.hasOneRelation({ modelA: User, modelB: UserPreference, foreignKey: "userID", otherAs: "userPreference", as: 'userPreference' }) // pk is userID
        // user <--> bookPreference
        this.hasOneRelation({ modelA: User, modelB: BookPreference, foreignKey: "userID", otherAs: "bookPreference", as: 'bookPreference' }) // pk is userID

        // Rental <--> payment
        this.hasOneRelation({ modelA: Rental, modelB: PaymentDetail, foreignKey: "rental", as: "rentalPayment" })

        // UserItems <-=> Rental details
        this.hasManyRelation({ modelA: UserItem, modelB: RentalsDetail, foreignKey: "rentalID", otherAs: "userRental" })

        // Rentals <-=> Rental details
        this.hasManyRelation({ modelA: Rental, modelB: RentalsDetail, foreignKey: "rentalID", otherAs: "rentalDetails" })


        // bookItem <-=> UserItems
        this.hasManyRelation({ modelA: BookItem, modelB: UserItem, foreignKey: "itemID", otherAs: "userBooks" })

        // BookItem <-=> BookAuthors
        this.hasManyRelation({ modelA: BookItem, modelB: BookAuthor, foreignKey: "bookID", otherAs: "bookAuthors" })

        // BookItem <-=> BookFormats
        this.hasManyRelation({ modelA: BookItem, modelB: BookFormat, foreignKey: "bookID", otherAs: "bookFormats" })

        // BookItem <-=> BookGenres
        this.hasManyRelation({ modelA: BookItem, modelB: BookGenre, foreignKey: "bookID", otherAs: "bookGenres" })

        // formats <-=> BookFormats
        this.hasManyRelation({ modelA: Format, modelB: BookFormat, foreignKey: "formatID", otherAs: "formatBooks" })

        // genres <-=> BookGenres
        this.hasManyRelation({ modelA: Genre, modelB: BookGenre, foreignKey: "genreID", otherAs: "genreBooks" })

        // authors <-=> BookAuthors
        this.hasManyRelation({ modelA: Author, modelB: BookAuthor, foreignKey: "authorID", otherAs: "authorBooks" })

        // user <-=> UserBookRating
        this.hasManyRelation({ modelA: User, modelB: UserBookRating, foreignKey: "userID", otherAs: "userRatings" })

        // BookItem <-=> UserBookRating
        this.hasManyRelation({ modelA: BookItem, modelB: UserBookRating, foreignKey: "bookID", otherAs: "bookRatings" })
    }

    static dropDatabaseNotBooks = async () => {
        // order matters I think
        await UserPreference.drop({});
        await PaymentDetail.drop({});
        await RentalsDetail.drop({});
        await Rental.drop({});
        await UserItem.drop({});
        await BookPreference.drop({});
        if (dropUsers) {
            await UserBookRating.drop({});
            await User.drop({});
        }
    }

}

export class DBSetupListener {
    /**
     * Enable full text search on all items, MAY NOT BE WORKING
     */
    static enableFullTextSearch = async () => {
        await UserItemModel.makeItemsFullTextSearchable();
    }

    static addBookAndLinks = async () => {
        const bookItem = new BookItemModel();
        await bookItem.addAllBookItems();
    }

    static createUsers = async (num = 10) => {
        const userModel = new UserModel();
        await userModel.createManyRandomUsers(num);
    }

    static createUserItems = async () => {
        const userItemModel = new UserItemModel();
        await userItemModel.createNewRandomItems(100);
    }

    static dropTables1 = async () => { // put anything you want to run before tables get dropped
        if (dropDB && !dropBook) { // Dropping all tables except books
            await InitialiseDatabase.dropDatabaseNotBooks();
            console.log("Dropped all tables except books")
        }
    }

    static dropTables2 = async () => { // put anything you want to run after tables get dropped
        if (dropDB) {
            await DBSetupListener.enableFullTextSearch();
            if (dropBook) {
                await DBSetupListener.addBookAndLinks();
            }
            // BOOKS have to be init before Users
            await DBSetupListener.createUsers(10);
        }
    }

    static runBeforeDBInit = async () => {
        await DBSetupListener.dropTables1();
    }

    static runAfterDbInit = async () => {
        await DBSetupListener.dropTables2();

    }
}

export const initialize = async () => {
    try {

        InitialiseDatabase.initAllTables(sequelize);
        if (!dropDB) {
            await sequelize.sync()

            return;
        }
        await DBSetupListener.runBeforeDBInit();
        InitialiseDatabase.createAllRelations();

        let options: SyncOptions = dropDB && dropBook ? { force: true } : {};
        await sequelize.sync(options)
        await DBSetupListener.runAfterDbInit();
        setTimeout(async () => {
            await DBSetupListener.createUserItems();
            await sequelize.sync()
        }, 10000)
    }
    catch (err: any) {
        console.log(err)
        throw new Error("Could not initialize database models!!!!!!!!!!!!!!!!!!!: " + err);
    }
}





// user <-=> Rentals/Orders



