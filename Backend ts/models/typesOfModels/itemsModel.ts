import { sequelize, User, UserPreference, Item, Rental, PaymentDetail, RentalsDetails } from "../modelSetUp";
import { Model, DataTypes, Sequelize, ModelCtor, QueryTypes, Attributes, InstanceUpdateOptions, NonNullFindOptions, ModelStatic } from "sequelize";
import { BaseModel } from "./baseModel";
import StdReturn from "../../types/baseTypes"; // just changed make sure correct
import { UserType, UserPreferenceType, } from "../../types/userType";
import { ItemType, RentalType, RentalDetailType, PaymentDetailType } from "../../types/rentalType";
import { DatabaseError, NotFoundError } from '../../utils/customError';
import { ModelTypes, Models } from '../../types/baseTypes'


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

interface BasicCRUDI { // maybe get working but types are annoying
    // CRUD functions
    addNew: <T extends Model<any, any> = Models>(details: Attributes<T>) => Promise<StdReturn<Models>>; // would like to turn Models into a generic but can't
    remove: (id: number) => Promise<StdReturn<number>>;
    update: <T extends Model<any, any> = Models>(specfic: T, details: InstanceUpdateOptions<Models>) => Promise<void>;
    // Query functions
    find: <T extends Model<any, any> = Models>(options: NonNullFindOptions<T>) => Promise<StdReturn<T>>; // I know return on this so could make it more specific
    findMany: <T extends Model<any, any> = Models>(options: NonNullFindOptions<T>) => Promise<StdReturn<T>>; // I know return on this so could make it more specific
}



export class ItemsModel extends BaseModel  {

    public async addNew(details: Attributes<Item>): Promise<StdReturn<Item>> {
        try {
            const { err, result } = await this.baseCreate(Item, details);
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("Item Models addNew()::=> " + err);
        }
    }

    public async remove(id: number): Promise<StdReturn<number>> {
        try {
            const { err, result } = await this.baseDestroy(Item, { where: { id: id } }); // will need to test
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("Item Models destroy()::=> " + err);
        }
    }

    public async update(specfic: Item, details: InstanceUpdateOptions<Item>): Promise<void> {
        try {
            await this.baseUpdate(specfic, details);
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("Item Models update()::=> " + err);
        }
    }

    public async querySearchItems(query: string): Promise<StdReturn> {

        let searchTerm: string = `
        SELECT * FROM items 
        WHERE MATCH(itemName, description)
        AGAINST('${query}' IN BOOLEAN MODE);`// what the hell is boolean mode
        const [result, metadata] = await sequelize.query(searchTerm, { type: QueryTypes.RAW })
        return { err: null, result: [result, metadata] }

    }

    public static async makeItemsFullTextSearchable(): Promise<StdReturn> {
        try {
            const [result, metadata] = await sequelize.query("ALTER TABLE items ADD FULLTEXT (itemName, description)", { type: QueryTypes.RAW })
            return { err: null, result: [result, metadata] }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError(" makeItemsFullTextSearchable() " + err);
        }
    }

    public async find(options: NonNullFindOptions<ItemType>): Promise<StdReturn<Item>> {
        try {
            const { err, result } = await this.baseFindOne(Item, options)
            return { err, result }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("Item Models find()::=> " + err);
        }
    }
    public async findMany(options: NonNullFindOptions<ItemType>): Promise<StdReturn<Item[]>> {
        try {
            const { err, result } = await this.baseFindAll(Item, options)
            return { err, result }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("Item Models findMany()::=> " + err);
        }
    }


}
