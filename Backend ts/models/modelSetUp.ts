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

import { UserType } from '../types/userType';
import { ItemsType, RentalsType, PaymentDetailsType, RentalsDetailsType } from '../types/rentalType';
import { coordiantes } from '../types/baseTypes';

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
    public userid!: string;//Primary key
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

export class Items extends Model<ItemsType> implements ItemsType {
    public itemId!: number;
    public itemName!: string;
    public description!: string;
    public ownerId!: number;
    public thumbnail!: string;
    public pricePerDay!: number;
    public itemLocation!: coordiantes;
    public quantity!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class Rentals extends Model<RentalsType> implements RentalsType {
    public rentalId!: number;
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


export class PaymentDetails extends Model<PaymentDetailsType> implements PaymentDetailsType {
    public paymentId!: number;
    public paymentDate!: Date;
    public paymentType!: string;
    public allowed!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
export class RentalsDetails extends Model<RentalsDetailsType> implements RentalsDetailsType {
    public rentalDetailId!: number;
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

const initUserModel = (sequelize: Sequelize) => { // so why does this not all the other definitions but the others do
    User.init(
        {
            userid: { type: DataTypes.STRING, primaryKey: true, },
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
            modelName: 'Users',
        }
    );
};

const initItems = (sequelize: Sequelize) => {
    Items.init(
        {
            itemId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            itemName: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.STRING, allowNull: false },
            thumbnail: { type: DataTypes.STRING, allowNull: false },
            pricePerDay: { type: DataTypes.INTEGER, allowNull: false },
            itemLocation: { type: DataTypes.JSON, allowNull: false },
            quantity: { type: DataTypes.INTEGER, allowNull: false },
        },
        {
            sequelize,
            modelName: 'Items'
        }
    );
};

const initRentals = (sequelize: Sequelize) => {
    Rentals.init(
        {
            rentalId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            rentalStartDate: { type: DataTypes.DATE, allowNull: false },
            rentalEndDate: { type: DataTypes.DATE, allowNull: false },
            rentalStatus: { type: DataTypes.STRING, allowNull: false },
            paid: { type: DataTypes.BOOLEAN, allowNull: false },
            paymentDate: { type: DataTypes.DATE, allowNull: false },
            orderNumber: { type: DataTypes.INTEGER, allowNull: false },
        },
        {
            sequelize,
            modelName: "Rentals"
        }
    );
}

const initPaymentDetails = (sequelize: Sequelize) => {
    PaymentDetails.init(
        {
            paymentId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            paymentDate: { type: DataTypes.DATE, allowNull: false },
            paymentType: { type: DataTypes.STRING, allowNull: false },
            allowed: { type: DataTypes.BOOLEAN, allowNull: false },
        },
        {
            sequelize,
            modelName: "PaymentDetails"
        });
};

const initRentalsDetails = (sequelize: Sequelize) => {
    RentalsDetails.init(
        {
            rentalDetailId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
            modelName: "RentalsDetails"
        });
}

export const initialize = async () => {
    try {
        initUserModel(sequelize);
        initItems(sequelize);
        initRentals(sequelize);
        initPaymentDetails(sequelize);
        initRentalsDetails(sequelize);

        //i think async skipping to creating assostiations before the models are created
        User.hasMany(Items, {
            foreignKey: "ownerId",
            onDelete: "CASCADE",// will delete all items that belong to user if user is deleted

        })
        Items.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' })

        //User has many Rentals
        User.hasMany(Rentals, {
            foreignKey: "renterId",
            as: "renter"
        })
        User.hasMany(Rentals, {
            foreignKey: "letterId",
            as: "letter"
        })
        Rentals.belongsTo(User, { foreignKey: 'renterId', as: 'renter' })
        Rentals.belongsTo(User, { foreignKey: 'letterId', as: 'letter' })

        //Rental has one payment
        Rentals.hasOne(PaymentDetails, {
            foreignKey: "rental",
        })
        PaymentDetails.belongsTo(Rentals, { as: "rentalPayment", foreignKey: "rental" })

        //items has many Rental details
        Items.hasMany(RentalsDetails, {
            foreignKey: "itemId"
        })
        RentalsDetails.belongsTo(Items, { as: "item", foreignKey: "itemId" })

        //Rentals has many Rental details
        Rentals.hasMany(RentalsDetails, {
            foreignKey: "rentalId"
        })
        RentalsDetails.belongsTo(Rentals, { as: "rental", foreignKey: "rentalId" })

        await sequelize.sync({ force: true }) // should init all models and reset the database

        console.log("Database models initialized")
    }
    catch (err) {
        console.log(err)
        throw new Error("Could not initialize database models: " + err);

    }
}







// // user has many Rentals/Orders



