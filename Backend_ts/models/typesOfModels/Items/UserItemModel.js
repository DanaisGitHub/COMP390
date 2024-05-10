"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserItemModel = void 0;
const modelSetUp_1 = require("../../DB_Functions/Set_Up/modelSetUp");
const sequelize_1 = require("sequelize");
const baseModel_1 = require("../baseModel");
const customError_1 = require("../../../utils/other/customError");
const random_1 = require("../../../utils/other/random");
const bookModel_1 = require("./BookModels/bookModel");
const userModels_1 = require("../Users/userModels");
// interface BasicCRUDI { // maybe get working but types are annoying
//     // CRUD functions
//     addNew: <T extends Model<any, any> = Models>(details: Attributes<T>) => Promise<StdReturn<Models>>; // would like to turn Models into a generic but can't
//     remove: (id: number) => Promise<StdReturn<number>>;
//     //update: <T extends Model<any, any> = Models>(specfic: T as Models, details: InstanceUpdateOptions<Models>) => Promise<void>;
//     // // Query functions
//     find: <T extends Model<any, any> = Models>(options: NonNullFindOptions<Attributes<T>>) => Promise<StdReturn<T>>; // I know return on this so could make it more specific
//     findMany: <T extends Model<any, any> = Models>(options: NonNullFindOptions<T>) => Promise<StdReturn<T>>; // I know return on this so could make it more specific
// }
class UserItemModel extends baseModel_1.BaseModel {
    static async makeItemsFullTextSearchable() {
        try {
            const bookTable = await modelSetUp_1.sequelize.query("ALTER TABLE bookItems ADD FULLTEXT (book, description)", { type: sequelize_1.QueryTypes.RAW });
            return bookTable;
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError(" makeItemsFullTextSearchable() " + err);
        }
    }
    constructor() {
        super(modelSetUp_1.UserItem);
    }
    async addNewItem(itemDetails) {
        try {
            const newItem = await modelSetUp_1.UserItem.create(itemDetails);
            return newItem;
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("Error in addNewItem");
        }
    }
    async addRandomItem(options) {
        try {
            const { ownerID, itemID } = options;
            const quantity = (0, random_1.randomNumber)(2, 1000);
            const price = (0, random_1.randomNumber)(2, 100);
            const newItem = await modelSetUp_1.UserItem.create({ ownerID, itemID, quantity, price });
            return newItem;
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("Error in addRandomItem");
        }
    }
    async checkIfEnoughQuantity(options) {
        try {
            const { ownerID, itemID, quantity } = options;
            const { err, result: userItemObj } = await this.find({ where: { ownerID, itemID }, rejectOnEmpty: true });
            if (userItemObj.quantity < quantity)
                return false;
            userItemObj.quantity -= quantity;
            await userItemObj.save();
            if (userItemObj.quantity === 0)
                await userItemObj.destroy();
            return true;
        }
        catch (err) {
            console.error(err);
            throw new customError_1.DatabaseError(`Error in checkIfEnoughQuantity ${err}`);
        }
    }
    async createNewRandomItems(quant) {
        try {
            const bookModel = new bookModel_1.BookItemModel();
            const usersModel = new userModels_1.UserModel();
            let i = 0;
            for (; i < quant; i++) { //10 items
                const book = await bookModel.getRandom({});
                const user = await usersModel.getRandom({});
                const newUserItem = await this.addRandomItem({ ownerID: user.dataValues.id, itemID: book.dataValues.id });
            }
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("Error in createNewRandomItems");
        }
    }
    async querySearchItems(query) {
        let searchTerm = `
        SELECT * FROM items 
        WHERE MATCH(book, description)
        AGAINST('${query}' IN BOOLEAN MODE);`; // what the hell is boolean mode
        const [result, metadata] = await modelSetUp_1.sequelize.query(searchTerm, { type: sequelize_1.QueryTypes.RAW }); // where are you getting sequelize from (Should you use custom query)
        return { err: null, result: [result, metadata] };
    }
}
exports.UserItemModel = UserItemModel;
