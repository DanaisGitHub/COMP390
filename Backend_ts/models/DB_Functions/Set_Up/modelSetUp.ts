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
import { ItemModel } from "../../typesOfModels/Items/ItemsModel";

import { TempUserType, UserPreferenceType, } from '../../../types/userType';
import { ItemType, RentalType, PaymentDetailType, RentalDetailType } from '../../../types/rentalType';
import { BookType, BookAuthorType, BookFormatType, BookGenreType, GenreType, FormatType, AuthorType, BookPreferenceType } from '../../../types/bookTypes';
import { coordiantes } from '../../../types/baseTypes';
import { BookItemModel } from '../../typesOfModels/Items/bookModel';
import { CSVtoSQLBook } from '../Process/CSVtoSQL';
import { SyncOptions } from 'sequelize';
import { UserModel } from '../../typesOfModels/Users/userModels';


let dropDB = true; // delete most tables not book
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
//     public paymentDetailsId!: number;
//     public userEmail!: string;
//     public CryptoPaymentsId!: number;

//     public readonly createdAt!: Date;
//     public readonly updatedAt!: Date;

// }

export class User extends Model<TempUserType> implements TempUserType {
    public id!: number;//Primary key
    public firstName!: string;
    public lastName!: string;
    public password!: string;
    public birthDate!: Date;
    public userEmail!: string;
    public refreshToken?: string; // not sure of ?
    public profilePicture?: string;
    public location?: coordiantes;
    public paymentDetailsId?: number;
    public CryptoPaymentsId?: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

}

export class UserPreference extends Model<UserPreferenceType> implements UserPreferenceType {
    public userID!: number;
    public distanceRange!: { min: number, max: number };
    public priceRange!: { min: number, max: number };
    public ratingRange!: { min: number, max: number };
    public dateRange!: { start: Date, end: Date };

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class Item extends Model<ItemType> implements ItemType {
    public id!: number;
    public itemName!: string;
    public description!: string;
    public ownerId!: number;
    public thumbnail!: string;
    public pricePerDay!: number;
    public itemLocation?: coordiantes;
    public quantity!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class Rental extends Model<RentalType> implements RentalType {
    public id!: number;
    public renterId!: number;
    public letterId!: number;
    public rentalStartDate!: Date;
    public rentalEndDate!: Date;
    public rentalStatus!: string;
    public paid!: boolean;
    public paymentDate!: Date;
    public orderNumber!: number;

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

export class RentalsDetails extends Model<RentalDetailType> implements RentalDetailType {
    public id!: number;
    public itemId!: number;
    public rentalId!: number;
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
    public authorPreference!: string[];
    public genrePreference!: string[];
    public formatPreference!: string[];
    public publicationRange!: { min: Date, max: Date }; // may take out ranges if too hard to implement
    public bookLengthRange!: { min: number, max: number };

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class BookItem extends Model<BookType> implements BookType {
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
    public bookId!: number; // Primary & Foreign Key
    public authorId!: number; // Primary & Foreign Key

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class BookFormat extends Model<BookFormatType> implements BookFormatType {
    public id!: number;
    public bookId!: number; // Primary & Foreign Key
    public formatId!: number; // Primary & Foreign Key

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class BookGenre extends Model<BookGenreType> implements BookGenreType {
    public id!: number;
    public bookId!: number; // Primary & Foreign Key
    public genreId!: number; // Primary & Foreign Key

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

//export class BoookAuthor


const InitialiseDatabase = class { // initalises database (Only nessesary / semi nessesary for the first time)

    static initUserModel = (sequelize: Sequelize) => { // so why does this not all the other definitions but the others do
        User.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
                firstName: { type: DataTypes.STRING, allowNull: false, },
                lastName: { type: DataTypes.STRING, allowNull: false, },
                password: { type: DataTypes.STRING, allowNull: false, },
                userEmail: { type: DataTypes.STRING, allowNull: false, },
                refreshToken: { type: DataTypes.STRING(2048), allowNull: true, },
                birthDate: { type: DataTypes.DATE, allowNull: false, },
                profilePicture: { type: DataTypes.STRING, allowNull: true, },
                location: { type: DataTypes.JSON, allowNull: true, },
                paymentDetailsId: { type: DataTypes.INTEGER, allowNull: true, },
                CryptoPaymentsId: { type: DataTypes.INTEGER, allowNull: true, },
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
                distanceRange: { type: DataTypes.JSON, allowNull: false, defaultValue: { min: 0, max: 1000000 } },
                priceRange: { type: DataTypes.JSON, allowNull: false, defaultValue: { min: 0, max: 1000000 } },
                ratingRange: { type: DataTypes.JSON, allowNull: false, defaultValue: { min: 0, max: 5.0 } },
                dateRange: { type: DataTypes.JSON, allowNull: false, defaultValue: { start: new Date(1970), end: new Date(3000) } },
            },
            {
                sequelize,
                modelName: 'UserPreference',
            }
        );
    }

    static initItems = (sequelize: Sequelize) => {
        Item.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                itemName: { type: DataTypes.STRING, allowNull: false },
                description: { type: DataTypes.STRING, allowNull: false },
                thumbnail: { type: DataTypes.STRING, allowNull: false },
                pricePerDay: { type: DataTypes.INTEGER, allowNull: false },
                itemLocation: { type: DataTypes.JSON, allowNull: true },
                quantity: { type: DataTypes.INTEGER, allowNull: false },
            },
            {
                sequelize,
                modelName: 'Item'
            }
        );
    };

    static initRentals = (sequelize: Sequelize) => {
        Rental.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                rentalStartDate: { type: DataTypes.DATE, allowNull: false },
                rentalEndDate: { type: DataTypes.DATE, allowNull: false },
                rentalStatus: { type: DataTypes.STRING, allowNull: false },
                paid: { type: DataTypes.BOOLEAN, allowNull: false },
                paymentDate: { type: DataTypes.DATE, allowNull: false },
                orderNumber: { type: DataTypes.INTEGER, allowNull: false },
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
        RentalsDetails.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                price: { type: DataTypes.INTEGER, allowNull: false },
                total: { type: DataTypes.INTEGER, allowNull: false },
                discount: { type: DataTypes.INTEGER, allowNull: false },
                paymentDetails: { type: DataTypes.STRING, allowNull: false },
                billDate: { type: DataTypes.DATE, allowNull: false },
                quantity: { type: DataTypes.INTEGER, allowNull: false },
                orderNumber: { type: DataTypes.INTEGER, allowNull: false },
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
                publicationRange: { type: DataTypes.JSON, allowNull: false, defaultValue: { min: new Date(1970), max: new Date(3000) } },
                bookLengthRange: { type: DataTypes.JSON, allowNull: false, defaultValue: { min: 0, max: 1000000 } },
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
                rating: { type: DataTypes.INTEGER, allowNull: false },
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
                bookId: { type: DataTypes.INTEGER, primaryKey: false, allowNull: false },
                authorId: { type: DataTypes.INTEGER, primaryKey: false, allowNull: false },
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
                bookId: { type: DataTypes.INTEGER, primaryKey: false, allowNull: false },
                formatId: { type: DataTypes.INTEGER, primaryKey: false, allowNull: false },
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
                bookId: { type: DataTypes.INTEGER, primaryKey: false, allowNull: false },
                genreId: { type: DataTypes.INTEGER, primaryKey: false, allowNull: false },
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
                name: { type: DataTypes.STRING, allowNull: false },
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
                name: { type: DataTypes.STRING, allowNull: false },
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
                name: { type: DataTypes.STRING, allowNull: false },
            },
            {
                sequelize,
                modelName: "Author"
            });
    }

    static initAllTables = async (sequelize: Sequelize) => {
        this.initUserModel(sequelize);
        this.initUserPreferenceModel(sequelize);
        this.initItems(sequelize);
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
    }

    /**
     * make a one to many relation between two models
     * 
     * @param options 
     */
    static hasManyRelation = (options: { modelA: ModelDefined<any, any>, modelB: ModelDefined<any, any>, modelAs?: string, otherAs?: string, foreignKey: string }) => {
        const { modelA: model, modelB: otherModel, modelAs, otherAs, foreignKey } = options;
        model.hasMany(otherModel, {
            foreignKey: foreignKey,
            as: modelAs
        })
        otherModel.belongsTo(model, { foreignKey: foreignKey, as: otherAs })
    }

    /**
     * make a one to many relation between two models with custom onDelete behaviour
     * 
     * @param options 
     */
    static hasManyRelationOnDelete = (options: { modelA: ModelDefined<any, any>, modelB: ModelDefined<any, any>, modelAs?: string, otherAs?: string, foreignKey: string, onDelete: string }) => {
        const { modelA: model, modelB: otherModel, modelAs, otherAs, foreignKey, onDelete } = options;
        model.hasMany(otherModel, {
            foreignKey: foreignKey,
            as: modelAs,
            onDelete: onDelete
        })
        otherModel.belongsTo(model, { foreignKey: foreignKey, as: otherAs })
    }

    /**
     * make a one to one relation between two models
     * 
     * @param options 
     */
    static hasOneRelation = (options: { modelA: ModelDefined<any, any>, modelB: ModelDefined<any, any>, modelAs?: string, otherAs?: string, foreignKey: string }) => {
        const { modelA: model, modelB: otherModel, modelAs, otherAs, foreignKey } = options;
        model.hasOne(otherModel, {
            foreignKey: foreignKey,
            as: modelAs
        })
        otherModel.belongsTo(model, { foreignKey: foreignKey, as: otherAs })
    }

    static createAllRelations = () => {
        this.hasManyRelationOnDelete({ modelA: User, modelB: Item, foreignKey: "ownerId", onDelete: "CASCADE", modelAs: 'owner' })

        // User <-=> Rentals * 2
        this.hasManyRelation({ modelA: User, modelB: Rental, modelAs: "renter", otherAs: "renter", foreignKey: "renterId" })// NOTE: I think foreign key is wrong should be userID
        this.hasManyRelation({ modelA: User, modelB: Rental, modelAs: "letter", otherAs: "letter", foreignKey: "letterId" })// NOTE: I think foreign key is wrong should be userID

        // user <--> userPreference
        this.hasOneRelation({ modelA: User, modelB: UserPreference, foreignKey: "userID", otherAs: "userPreference" }) // pk is userID
        // user <--> bookPreference
        this.hasOneRelation({ modelA: User, modelB: BookPreference, foreignKey: "userID", otherAs: "bookPreference" }) // pk is userID

        // Rental <--> payment
        this.hasOneRelation({ modelA: Rental, modelB: PaymentDetail, foreignKey: "rental", modelAs: "rentalPayment" })

        //items <-=> Rental details
        this.hasManyRelation({ modelA: Item, modelB: RentalsDetails, foreignKey: "itemId", otherAs: "item" })
        // Rentals <-=> Rental details
        this.hasManyRelation({ modelA: Rental, modelB: RentalsDetails, foreignKey: "rentalId", otherAs: "rental" })

        // BookItem <-=> BookAuthors
        this.hasManyRelation({ modelA: BookItem, modelB: BookAuthor, foreignKey: "bookId", otherAs: "bookAuthors" })

        // BookItem <-=> BookFormats
        this.hasManyRelation({ modelA: BookItem, modelB: BookFormat, foreignKey: "bookId", otherAs: "bookFormats" })

        // BookItem <-=> BookGenres
        this.hasManyRelation({ modelA: BookItem, modelB: BookGenre, foreignKey: "bookId", otherAs: "bookGenres" })

        // formats <-=> BookFormats
        this.hasManyRelation({ modelA: Format, modelB: BookFormat, foreignKey: "formatId", otherAs: "formatBooks" })

        // genres <-=> BookGenres
        this.hasManyRelation({ modelA: Genre, modelB: BookGenre, foreignKey: "genreId", otherAs: "genreBooks" })

        // authors <-=> BookAuthors
        this.hasManyRelation({ modelA: Author, modelB: BookAuthor, foreignKey: "authorId", otherAs: "authorBooks" })
    }

    static dropDatabaseNotBooks = async () => {
        // order matters I think
        await UserPreference.drop();
        await PaymentDetail.drop();
        await RentalsDetails.drop();
        await Rental.drop();
        await Item.drop();
        await User.drop();

    }
}

const DBSetupListener = class {
    static enableFullTextSearch = async () => {
        await ItemModel.makeItemsFullTextSearchable();
    }

    static addBookAndLinks = async () => {
        const bookItem = new BookItemModel();
        bookItem.addAllBookItems();
    }

    static create10NewUsers = async () => {
        const userModel = new UserModel();
        userModel.createManyRandomUsers(10);
    }

    static dropTables1 = async () => {
        if (dropDB && !dropBook) { // Dropping all tables except books
            await InitialiseDatabase.dropDatabaseNotBooks();
            console.log("Dropped all tables except books")
        }
    }

    static dropTables2 = async () => {
        if (dropDB) {
            await DBSetupListener.enableFullTextSearch();
            if (dropBook) {
                await DBSetupListener.addBookAndLinks();
            }
        }
    }

    static runBeforeCreation = async () => {
        await DBSetupListener.dropTables1();
    }

    static runAfterCreation = async () => {
        await DBSetupListener.dropTables2();
        await DBSetupListener.create10NewUsers();
    }
}

export const initialize = async () => {
    try {
        await InitialiseDatabase.initAllTables(sequelize);
        await DBSetupListener.runBeforeCreation();
        InitialiseDatabase.createAllRelations();

        let options: SyncOptions | undefined = dropDB && dropBook ? { force: true } : undefined;
        await sequelize.sync(options)
        await DBSetupListener.runAfterCreation();

        console.log("Database models initialized")
    }
    catch (err: any) {
        console.log(err)
        throw new Error("Could not initialize database models!!!!!!!!!!!!!!!!!!!: " + err);
    }
}





// user <-=> Rentals/Orders



