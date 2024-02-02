"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemModel = void 0;
const modelSetUp_1 = require("../modelSetUp");
const sequelize_1 = require("sequelize");
const baseModel_1 = require("./baseModel");
const customError_1 = require("../../utils/customError");
// interface BasicCRUDI { // maybe get working but types are annoying
//     // CRUD functions
//     addNew: <T extends Model<any, any> = Models>(details: Attributes<T>) => Promise<StdReturn<Models>>; // would like to turn Models into a generic but can't
//     remove: (id: number) => Promise<StdReturn<number>>;
//     //update: <T extends Model<any, any> = Models>(specfic: T as Models, details: InstanceUpdateOptions<Models>) => Promise<void>;
//     // // Query functions
//     find: <T extends Model<any, any> = Models>(options: NonNullFindOptions<Attributes<T>>) => Promise<StdReturn<T>>; // I know return on this so could make it more specific
//     findMany: <T extends Model<any, any> = Models>(options: NonNullFindOptions<T>) => Promise<StdReturn<T>>; // I know return on this so could make it more specific
// }
class ItemModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.Item);
    }
    async querySearchItems(query) {
        let searchTerm = `
        SELECT * FROM items 
        WHERE MATCH(itemName, description)
        AGAINST('${query}' IN BOOLEAN MODE);`; // what the hell is boolean mode
        const [result, metadata] = await modelSetUp_1.sequelize.query(searchTerm, { type: sequelize_1.QueryTypes.RAW }); // where are you getting sequelize from (Should you use custom query)
        return { err: null, result: [result, metadata] };
    }
    static async makeItemsFullTextSearchable() {
        try {
            const [result, metadata] = await modelSetUp_1.sequelize.query("ALTER TABLE items ADD FULLTEXT (itemName, description)", { type: sequelize_1.QueryTypes.RAW });
            return { err: null, result: [result, metadata] };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError(" makeItemsFullTextSearchable() " + err);
        }
    }
}
exports.ItemModel = ItemModel;
