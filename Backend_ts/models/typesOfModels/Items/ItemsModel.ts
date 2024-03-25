import { sequelize, User, UserPreference, Item, Rental, PaymentDetail, RentalsDetail, BookItem } from "../../DB_Functions/Set_Up/modelSetUp";
import { Model, DataTypes, Sequelize, ModelCtor, QueryTypes, Attributes, InstanceUpdateOptions, NonNullFindOptions, ModelStatic, UpdateOptions } from "sequelize";
import { BaseModel } from "../baseModel";
import StdReturn from "../../../types/baseTypes"; // just changed make sure correct
import { TempUserType, UserPreferenceType, } from "../../../types/DBTypes/UserTypes/userTypes";
import { ItemType, RentalType, RentalDetailType, PaymentDetailType } from "../../../types/DBTypes/RentalTypes/rentalType";
import { BookType } from "../../../types/DBTypes/BookTypes/bookTypes";
import { DatabaseError, NotFoundError } from '../../../utils/other/customError';
import { ModelTypes, Models } from '../../../types/baseTypes'
import { Col, Fn, Literal } from "sequelize/types/utils";
import { query } from "express";
import { DestroyOptions } from "sequelize";
import exp from "constants";

import { CSVtoSQLBook } from '../../DB_Functions/Process/CSVtoSQL';


interface ItemModelI extends Model<ItemType>, ItemType {
    // CRUD functions
    addNewItem: (itemDetails: ItemType) => Promise<StdReturn>;// Auth
    removeItem: (itemId: number) => Promise<StdReturn>;// Auth
    updateItem: (itemId: number, itemDetails: ItemType) => Promise<StdReturn>;// Auth
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



export class ItemModel extends BaseModel<Item> {

    public constructor() {
        super(Item)
    }

    public async querySearchItems(query: string): Promise<StdReturn> {
        let searchTerm: string = `
        SELECT * FROM items 
        WHERE MATCH(itemName, description)
        AGAINST('${query}' IN BOOLEAN MODE);`// what the hell is boolean mode
        const [result, metadata] = await sequelize.query(searchTerm, { type: QueryTypes.RAW }) // where are you getting sequelize from (Should you use custom query)
        return { err: null, result: [result, metadata] }

    }

    public static async makeItemsFullTextSearchable(): Promise<{itemTable:any,bookTable:any}> {
        try {
            const itemTable = await sequelize.query("ALTER TABLE items ADD FULLTEXT (itemName, description)", { type: QueryTypes.RAW })
            const bookTable = await sequelize.query("ALTER TABLE bookItems ADD FULLTEXT (book, description)", { type: QueryTypes.RAW })
            return {itemTable, bookTable}
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError(" makeItemsFullTextSearchable() " + err);
        }
    }
}





