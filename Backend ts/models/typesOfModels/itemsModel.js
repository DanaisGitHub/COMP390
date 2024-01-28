"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsModel = void 0;
const modelSetUp_1 = require("../modelSetUp");
const sequelize_1 = require("sequelize");
const baseModel_1 = require("./baseModel");
const customError_1 = require("../../utils/customError");
class ItemsModel extends baseModel_1.BaseModel {
    async addNew(details) {
        try {
            const { err, result } = await this.baseCreate(modelSetUp_1.Item, details);
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("Item Models addNew()::=> " + err);
        }
    }
    async remove(id) {
        try {
            const { err, result } = await this.baseDestroy(modelSetUp_1.Item, { where: { id: id } }); // will need to test
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("Item Models destroy()::=> " + err);
        }
    }
    async update(specfic, details) {
        try {
            await this.baseUpdate(specfic, details);
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("Item Models update()::=> " + err);
        }
    }
    async querySearchItems(query) {
        let searchTerm = `
        SELECT * FROM items 
        WHERE MATCH(itemName, description)
        AGAINST('${query}' IN BOOLEAN MODE);`; // what the hell is boolean mode
        const [result, metadata] = await modelSetUp_1.sequelize.query(searchTerm, { type: sequelize_1.QueryTypes.RAW });
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
    async find(options) {
        try {
            const { err, result } = await this.baseFindOne(modelSetUp_1.Item, options);
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("Item Models find()::=> " + err);
        }
    }
    async findMany(options) {
        try {
            const { err, result } = await this.baseFindAll(modelSetUp_1.Item, options);
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("Item Models findMany()::=> " + err);
        }
    }
}
exports.ItemsModel = ItemsModel;
