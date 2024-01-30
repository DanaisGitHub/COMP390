// The massive read lines on token.init() are not errors, works just fine but I don't know why it's doing that

import {
    Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
    HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, Model, ModelDefined, Optional,
    Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasMany, BelongsTo, BelongsToMany, HasOne
} from 'sequelize';

import StdReturn from '../types/baseTypes';
import mysql from "mysql2";
import { ItemModel } from "./typesOfModels/itemsModel";

import { UserType, UserPreferenceType } from '../types/userType';
import { ItemType, RentalType, PaymentDetailType, RentalDetailType } from '../types/rentalType';
import { coordiantes } from '../types/baseTypes';


let deleteDatabase = false;



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

export class User extends Model<UserType> implements UserType {
    public id!: string;//Primary key
    public firstName!: string;
    public lastName!: string;
    public password!: string;
    public refreshToken?: string; // not sure of ?
    public birthDate!: Date;
    public profilePicture?: string;
    public location!: coordiantes;
    public paymentDetailsId!: number;
    public userEmail!: string;
    public CryptoPaymentsId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

}

export class UserPreference extends Model<UserPreferenceType> implements UserPreferenceType {
    public id!: number;
    public maxDistance!: number;
    public maxPrice!: number;
    public minRating!: number;
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


const InitialiseDatabase = class {

    static initUserModel = (sequelize: Sequelize) => { // so why does this not all the other definitions but the others do
        User.init(
            {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
                firstName: { type: DataTypes.STRING, allowNull: false, },
                lastName: { type: DataTypes.STRING, allowNull: false, },
                password: { type: DataTypes.STRING, allowNull: false, },
                refreshToken: { type: DataTypes.STRING(2048), allowNull: true, },
                birthDate: { type: DataTypes.DATE, allowNull: false, },
                profilePicture: { type: DataTypes.STRING, allowNull: true, },
                location: { type: DataTypes.JSON, allowNull: false, },
                paymentDetailsId: { type: DataTypes.INTEGER, allowNull: false, },
                userEmail: { type: DataTypes.STRING, allowNull: false, },
                CryptoPaymentsId: { type: DataTypes.INTEGER, allowNull: false, },
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
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
                maxDistance: { type: DataTypes.INTEGER, allowNull: false, },
                maxPrice: { type: DataTypes.INTEGER, allowNull: false, },
                minRating: { type: DataTypes.INTEGER, allowNull: false, },
                dateRange: { type: DataTypes.JSON, allowNull: false, },
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

    /**
     * make a one to many relation between two models
     * 
     * @param options 
     */
    static hasManyRelation = (options: { model: ModelDefined<any, any>, otherModel: ModelDefined<any, any>, modelAs?: string, otherAs?: string, foreignKey: string }) => {
        const { model, otherModel, modelAs, otherAs, foreignKey } = options;
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
    static hasManyRelationOnDelete = (options: { model: ModelDefined<any, any>, otherModel: ModelDefined<any, any>, modelAs?: string, otherAs?: string, foreignKey: string, onDelete: string }) => {
        const { model, otherModel, modelAs, otherAs, foreignKey, onDelete } = options;
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
    static hasOneRelation = (options: { model: ModelDefined<any, any>, otherModel: ModelDefined<any, any>, modelAs?: string, otherAs?: string, foreignKey: string }) => {
        const { model, otherModel, modelAs, otherAs, foreignKey } = options;
        model.hasOne(otherModel, {
            foreignKey: foreignKey,
            as: modelAs
        })
        otherModel.belongsTo(model, { foreignKey: foreignKey, as: otherAs })
    }

    static enableFullTextSearch = () => {
        ItemModel.makeItemsFullTextSearchable();

        //ALTER TABLE item ADD FULLTEXT(itemName, description);
    }



}

export const initialize = async () => {
    try {
        const initDB = InitialiseDatabase;
        initDB.initUserModel(sequelize);
        initDB.initUserPreferenceModel(sequelize);
        initDB.initItems(sequelize);
        initDB.initRentals(sequelize);
        initDB.initPaymentDetails(sequelize);
        initDB.initRentalsDetails(sequelize);


        // User.hasMany(Item, {
        //     foreignKey: "ownerId",
        //     onDelete: "CASCADE",// will delete all items that belong to user if user is deleted

        // })
        // Item.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' }) // that as is not working to redefine the name of the foreign key
        initDB.hasManyRelationOnDelete({ model: User, otherModel: Item, foreignKey: "ownerId", onDelete: "CASCADE", modelAs: 'owner' })

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

        initDB.hasManyRelation({ model: User, otherModel: Rental, modelAs: "renter", otherAs: "renter", foreignKey: "renterId" })// NOTE: I think foreign key is wrong should be userID
        initDB.hasManyRelation({ model: User, otherModel: Rental, modelAs: "letter", otherAs: "letter", foreignKey: "letterId" })// NOTE: I think foreign key is wrong should be userID


        // //user <--> userPreference
        // User.hasOne(UserPreference, {
        //     foreignKey: "userId", // error here
        // })
        // UserPreference.belongsTo(User, { foreignKey: 'userId', as: 'user' })
        initDB.hasOneRelation({ model: User, otherModel: UserPreference, foreignKey: "preferenceId", otherAs: "preference" })




        // //Rental has one payment
        // Rental.hasOne(PaymentDetail, {
        //     foreignKey: "rental",
        // })
        // PaymentDetail.belongsTo(Rental, { as: "rentalPayment", foreignKey: "rental" })
        initDB.hasOneRelation({ model: Rental, otherModel: PaymentDetail, foreignKey: "rental", modelAs: "rentalPayment" })
        // //items has many Rental details
        // Item.hasMany(RentalsDetails, {
        //     foreignKey: "itemId"
        // })
        // RentalsDetails.belongsTo(Item, { as: "item", foreignKey: "itemId" })
        initDB.hasManyRelation({ model: Item, otherModel: RentalsDetails, foreignKey: "itemId", otherAs: "item" })
        // //Rentals has many Rental details
        // Rental.hasMany(RentalsDetails, {
        //     foreignKey: "rentalId"
        // })
        // RentalsDetails.belongsTo(Rental, { as: "rental", foreignKey: "rentalId" })
        initDB.hasManyRelation({ model: Rental, otherModel: RentalsDetails, foreignKey: "rentalId", otherAs: "rental" })


       
        const options = deleteDatabase ? { force: true } : undefined;
        await sequelize.sync(options)// should init all models and reset the database
        console.log("Database models initialized")
        if (deleteDatabase){
            initDB.enableFullTextSearch();
        }

    }
    catch (err: any) {
        console.log(err)
        throw new Error("Could not initialize database models!!!!!!!!!!!!!!!!!!!: " + err);

    }


}







// // user has many Rentals/Orders



