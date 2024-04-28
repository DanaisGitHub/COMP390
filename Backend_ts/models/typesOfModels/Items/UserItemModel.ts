import { sequelize, User, UserPreference, UserItem, Rental, PaymentDetail, RentalsDetail, BookItem } from "../../DB_Functions/Set_Up/modelSetUp";
import { Model, DataTypes, Sequelize, ModelCtor, QueryTypes, Attributes, InstanceUpdateOptions, NonNullFindOptions, ModelStatic, UpdateOptions } from "sequelize";
import { BaseModel } from "../baseModel";
import StdReturn from "../../../types/baseTypes"; // just changed make sure correct
import { TempUserType, UserPreferenceType, } from "../../../types/DBTypes/UserTypes/userTypes";
import { UserItemType, RentalType, RentalDetailType, PaymentDetailType } from "../../../types/DBTypes/RentalTypes/rentalType";
import { BookItemType, UserBookRatingType } from "../../../types/DBTypes/BookTypes/bookTypes";
import { DatabaseError, NotFoundError } from '../../../utils/other/customError';
import { ModelTypes, Models } from '../../../types/baseTypes'
import { Col, Fn, Literal } from "sequelize/types/utils";
import { query } from "express";
import { DestroyOptions } from "sequelize";
import exp from "constants";

import { CSVtoSQLBook } from '../../DB_Functions/Process/CSVtoSQL';
import { random } from "../../../utils/other/utils";
import { randomNumber } from "../../../utils/other/random";
import { BookItemModel } from "./BookModels/bookModel";
import { UserModel } from "../Users/userModels";


interface ItemModelI extends Model<UserItemType>, UserItemType {
    // CRUD functions
    addNewItem: (itemDetails: UserItemType) => Promise<StdReturn>;// Auth
    removeItem: (itemId: number) => Promise<StdReturn>;// Auth
    updateItem: (itemId: number, itemDetails: UserItemType) => Promise<StdReturn>;// Auth
    // Query functions
    querySearchItems: (query: string) => Promise<StdReturn>; // I know return on this so could make it more specific
    // Other functions
    makeItemsFullTextSearchable: () => Promise<StdReturn>;
}

// interface BasicCRUDI { // maybe get working but types are annoying
//     // CRUD functions
//     addNew: <T extends Model<any, any> = Models>(details: Attributes<T>) => Promise<StdReturn<Models>>; // would like to turn Models into a generic but can't
//     remove: (id: number) => Promise<StdReturn<number>>;
//     //update: <T extends Model<any, any> = Models>(specfic: T as Models, details: InstanceUpdateOptions<Models>) => Promise<void>;
//     // // Query functions
//     find: <T extends Model<any, any> = Models>(options: NonNullFindOptions<Attributes<T>>) => Promise<StdReturn<T>>; // I know return on this so could make it more specific
//     findMany: <T extends Model<any, any> = Models>(options: NonNullFindOptions<T>) => Promise<StdReturn<T>>; // I know return on this so could make it more specific
// }



export class UserItemModel extends BaseModel<UserItem> {
    public static async makeItemsFullTextSearchable(): Promise<[unknown[], unknown]> {
        try {
            const bookTable = await sequelize.query("ALTER TABLE bookItems ADD FULLTEXT (book, description)", { type: QueryTypes.RAW })
            return bookTable
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError(" makeItemsFullTextSearchable() " + err);
        }
    }

    public constructor() {
        super(UserItem)
    }

    public async addNewItem(itemDetails: UserItemType): Promise<UserItem> {
        try {
            const newItem = await UserItem.create(itemDetails)
            return newItem
        } catch (err) {
            console.log(err)
            throw new DatabaseError("Error in addNewItem")
        }
    }

    public async addRandomItem(options: { ownerID: number, itemID: number }): Promise<UserItem> {
        try {
            const { ownerID, itemID } = options
            const quantity = randomNumber(2, 1000)
            const price = randomNumber(2, 100)
            const newItem = await UserItem.create({ ownerID, itemID, quantity, price })
            return newItem
        } catch (err) {
            console.log(err)
            throw new DatabaseError("Error in addRandomItem")
        }
    }

    public async checkIfEnoughQuantity(options: { ownerID: number, itemID: number, quantity: number }): Promise<boolean> {
        try {
            const { ownerID, itemID, quantity } = options
            const { err, result: userItemObj } = await this.find({ where: { ownerID, itemID }, rejectOnEmpty: true })
            if (userItemObj.quantity < quantity) return false;
            userItemObj.quantity -= quantity
            await userItemObj.save()
            if (userItemObj.quantity === 0) await userItemObj.destroy()
            return true;
        } catch (err: any) {
            console.error(err)
            throw new DatabaseError(`Error in checkIfEnoughQuantity ${err}`)
        }
    }

    public async createNewRandomItems(quant:number): Promise<void> {
        try {
            const bookModel = new BookItemModel()
            const usersModel = new UserModel()
            let i = 0
            for (; i < quant; i++) {//10 items
                const book = await bookModel.getRandom({})
                const user = await usersModel.getRandom({})

                const newUserItem = await this.addRandomItem({ ownerID: user.dataValues.id!, itemID: book.dataValues.id! })

            }

        } catch (err) {
            console.log(err)
            throw new DatabaseError("Error in createNewRandomItems")
        }
    }

    public async querySearchItems(query: string): Promise<StdReturn> {
        let searchTerm: string = `
        SELECT * FROM items 
        WHERE MATCH(book, description)
        AGAINST('${query}' IN BOOLEAN MODE);`// what the hell is boolean mode
        const [result, metadata] = await sequelize.query(searchTerm, { type: QueryTypes.RAW }) // where are you getting sequelize from (Should you use custom query)
        return { err: null, result: [result, metadata] }

    }
}





