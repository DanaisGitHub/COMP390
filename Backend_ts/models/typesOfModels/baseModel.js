"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAttributeModel = exports.BaseBookAttributesModel = exports.BaseModel = void 0;
const customError_1 = require("../../utils/other/customError");
const modelSetUp_1 = require("../DB_Functions/Set_Up/modelSetUp");
const sequelize_1 = require("sequelize");
// cant perfrom circular imports
// be careful with the types here
//could be all statics and not need to instantiate
/**
 * abstract Class that provides atomic action to the database
 * @Description You have to pass the model in as parameter to the functions
 */
class BaseModel {
    constructor(model) {
        //START OF DDL
        /**
         * creates a new entry into the database
         * @model ModelStatic<T> is the model/table you want to create a new entry in
         * @param options object defining how data should be created (is an object of same type as model)
         * @returns Object of row created, where more functions can be done directly
         */
        this.baseCreate = async (options) => {
            try {
                const result = await this.model.create(options); // Cast options to 'any' type
                return { err: null, result };
            }
            catch (err) {
                console.log(err);
                throw new customError_1.DatabaseError("baseModels Create() Error " + err.message);
            }
        };
        this.baseCreateMany = async (records, // need to make this a generic
        options) => {
            try {
                const result = await this.model.bulkCreate(records, options); // Cast options to 'any' type
                return { err: null, result };
            }
            catch (err) {
                console.log(err);
                throw new customError_1.DatabaseError("baseModels Create() Error " + err.message);
            }
        };
        /**
         *
         * @param model ModelStatic<T> = Table you want to delete from
         * @param options used to define what you want to delete
         * @returns
         */
        this.baseDestroy = async (options) => {
            try {
                const result = await this.model.destroy(options); // returns a number 
                if (result === null) {
                    throw new customError_1.NotFoundError("User not found in 'destroy' ");
                }
                return { err: null, result };
            }
            catch (err) {
                console.log(err);
                throw new customError_1.DatabaseError("Failed to perfrom destroy database Operation");
            }
        };
        /**
         * Updates a row in the database
         *
         * @param values = object of values to be updated
         * @param searchTerm = object of conditions/ how to find row
         */
        this.baseUpdate = async (values, searchTerm) => {
            try {
                await this.model.update(values, searchTerm);
            }
            catch (err) {
                console.error(err);
                if (err instanceof sequelize_1.EmptyResultError) {
                    throw new customError_1.NotFoundError("User not found in 'update' " + err.message);
                }
                throw new customError_1.DatabaseError("Failed to perfrom update database Operation: " + err.message);
            }
        };
        // create function bulkCreate
        //END OF DDL
        //START OF DML
        /**
         * finds a specfic row that confroms to optinal clauses
         * @param model ModelStatic<T> = Table you want to find one from
         * @param options and object of conditions
         * @returns if found returns object, if not found returns null
         */
        this.baseFindOne = async (options) => {
            try {
                const result = await this.model.findOne(options);
                if (result === null || result === undefined) {
                    throw new sequelize_1.EmptyResultError("User not found in 'findOne' ");
                }
                return { err: null, result };
            }
            catch (err) {
                console.error(err);
                if (err instanceof sequelize_1.EmptyResultError) {
                    throw new customError_1.NotFoundError("User not found in 'findOne' " + err.message);
                }
                throw new customError_1.DatabaseError("Failed to perform 'findOne'");
            }
        };
        this.baseFindOneNotTyped = async (options) => {
            try {
                const result = await this.model.findOne(options);
                if (result === null || result === undefined) {
                    throw new customError_1.NotFoundError("User not found in 'findOne' ");
                }
                return result;
            }
            catch (err) {
                console.error(err);
                throw new customError_1.DatabaseError("Failed to perform 'findOne'");
            }
        };
        this.baseFindAll = async (options) => {
            try {
                const result = await this.model.findAll(options);
                if (result === null || result === undefined) {
                    throw new customError_1.NotFoundError("not found in 'findAll' ");
                }
                return { err: null, result };
            }
            catch (err) {
                console.log(err);
                throw new customError_1.DatabaseError("Failed to perfrom findAll database Operation");
            }
        };
        this.build = async (record, options) => {
            try {
                const result = await this.model.build(record, options);
                if (result === null || result === undefined) {
                    throw new customError_1.NotFoundError("User not found in 'build' ");
                }
                return { err: null, result };
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom build database Operation");
            }
        };
        this.baseFindOrCreate = async (options) => {
            try {
                const result = await this.model.findCreateFind(options);
                return { err: null, result };
            }
            catch (err) {
                console.log(err);
                throw new customError_1.DatabaseError("Failed to perfrom findOrCreate database Operation");
            }
        };
        /**
         *
         * @param identifier if no identifier is passed, it will return all
         * @param options
         * @returns
         */
        this.findByPkey = async (identifier, options) => {
            const result = await this.model.findByPk(identifier, options);
            if (result === null) {
                throw new customError_1.NotFoundError("not found in findByPkey");
            }
            return { err: null, result };
        };
        this.findAndCountAll = async (options) => {
            try {
                const result = await this.model.findAndCountAll(options);
                if (result.rows === null || result.rows === undefined) {
                    throw new customError_1.NotFoundError("not found in findAndCountAll");
                }
                return { err: null, result };
            }
            catch (err) {
                console.log(err);
                throw new customError_1.DatabaseError("Failed to perfrom findByPkey database Operation");
            }
        };
        this.getRandom = async (options) => {
            var _a;
            try {
                const result = await this.model.findOne(Object.assign(Object.assign({}, options), { order: (_a = this.model.sequelize) === null || _a === void 0 ? void 0 : _a.random() }));
                if (result === null) {
                    throw new customError_1.NotFoundError("not found in getRandom");
                }
                return result;
            }
            catch (err) {
                console.log(err);
                throw new customError_1.DatabaseError("Failed to perfrom getRandom database Operation");
            }
        };
        // TODO: Custom Query
        ///////////////////////////
        //PUBLIC FUNCTIONS
        ///////////////////////////
        // why do these exist
        this.customQuery = async (query) => {
            var _a;
            try {
                const result = await ((_a = this.model.sequelize) === null || _a === void 0 ? void 0 : _a.query(query));
                return result;
            }
            catch (err) {
                console.error(err);
                throw new customError_1.DatabaseError(`Failed to perfrom customQuery database Operation: ${err}`);
            }
        };
        this.model = model;
    }
    catch(err) {
        console.log(err);
        throw new customError_1.DatabaseError("Failed to perfrom findByPkey database Operation");
    }
    async addNew(details) {
        try {
            const { err, result } = await this.baseCreate(details);
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("Item Models addNew()::=> " + err);
        }
    }
    async remove(searchTerm) {
        try {
            const { err, result } = await this.baseDestroy(searchTerm); // will need to test
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("Item Models destroy()::=> " + err);
        }
    }
    async update(values, searchTerm) {
        try {
            await this.baseUpdate(values, searchTerm);
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("Item Models update()::=> " + err);
        }
    }
    async find(options) {
        try {
            const { err, result } = await this.baseFindOne(options);
            return { err, result };
        }
        catch (err) {
            if (err instanceof sequelize_1.EmptyResultError) {
                throw new customError_1.NotFoundError("Item not found in 'find' ");
            }
            console.log(err);
            throw new customError_1.DatabaseError("Item Models find()::=> " + err);
        }
    }
    async findAll(options) {
        try {
            const { err, result } = await this.baseFindAll(options);
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("Item Models findMany()::=> " + err);
        }
    }
    // should be in a sperate class // is creating twice
    async baseBookLink(bookName, linkName, linkTable, bookTable) {
        try {
            let book, linkRes;
            const jsonName = (linkTable.constructor.name === "GenreModel" ? "genre"
                : linkTable.constructor.name === "FormatModel" ? "format" : "author") + "ID";
            // searching for book
            try {
                book = await bookTable.find({
                    where: { book: bookName },
                    rejectOnEmpty: true
                });
            }
            catch (err) {
                throw new customError_1.NotFoundError("Book not found in 'baseBookLink' ");
            }
            // seraching for attribute
            try {
                linkRes = await linkTable.find({
                    where: { name: linkName },
                    rejectOnEmpty: true
                });
            }
            catch (err) {
                throw new customError_1.NotFoundError("Link not found in 'baseBookLink' ");
            }
            if (book.result === null || linkRes.result === null) {
                throw new customError_1.NotFoundError("Book or Link not found in 'baseBookLink' ");
            }
            let createObject = {
                bookID: book.result.id,
                [jsonName]: linkRes.result.id
            };
            await this.model.create(createObject); // might be creating duplicates // shouldn't be any}
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("Failed to perfrom baseBookLink database Operation");
        }
        // 
    }
    async getAll() {
        try {
            const { err, result } = await this.baseFindAll({});
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("getAll()" + err);
        }
    }
    async count(options) {
        try {
            const num = await this.model.count(options);
            return num;
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("count()" + err);
        }
    }
    async entryExists(options) {
        try {
            const result = await this.model.count(options);
            if (result > 0) {
                console.log("entryExists()::=> Entry Exists");
                return true;
            }
            return false;
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("entryExists()" + err);
        }
    }
    async performOnAllRows(action, limit = 100, offset = 0) {
        try {
            let result;
            do {
                result = await this.model.findAll({
                    limit, offset,
                });
                result === null || result === void 0 ? void 0 : result.forEach(action);
                offset += limit;
            } while (result.length === limit);
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("performOnAll()" + err);
        }
    }
    async getObjFromID(id) {
        try {
            const { err, result } = await this.findByPkey(id);
            return result;
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("idToObj()" + err);
        }
    }
    async getObjsFromIDs(id) {
        try {
            const objs = await Promise.all(id.map(async (id) => {
                return await this.getObjFromID(id);
            }));
            return objs;
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("idsToObjs()" + err);
        }
    }
}
exports.BaseModel = BaseModel;
class BaseBookAttributesModel extends BaseModel {
    /**
     * For given bookID, returns all the attributes of the book eg all formats book is in
     *
     * @param id BookID
     * @param returnIDs weather you want the ids or the actual objects
     * @returns
     */
    async getAllBookAttributesForSpecficBook(id, returnIDs = true) {
        try {
            let findAllAttributes /*: FindOptions<Attributes<T>> | undefined*/, attributeID, model;
            if (this.model === modelSetUp_1.BookAuthor) {
                attributeID = "authorID";
                const authorID = id;
                findAllAttributes = {
                    include: [{
                            model: modelSetUp_1.Author,
                            as: 'authorBooks',
                            where: { id: authorID },
                            attributes: []
                        }]
                };
            }
            else if (this.model === modelSetUp_1.BookFormat) {
                attributeID = "formatID";
                const formatID = id;
                findAllAttributes = {
                    include: [{
                            model: modelSetUp_1.Format,
                            as: 'formatBooks',
                            where: { id: formatID },
                            attributes: []
                        }]
                };
            }
            else if (this.model === modelSetUp_1.BookGenre) {
                attributeID = "genreID";
                const genreID = id;
                findAllAttributes = {
                    include: [{
                            model: modelSetUp_1.Genre,
                            as: 'genreBooks',
                            where: { id: genreID },
                            attributes: []
                        }]
                };
            }
            ;
            const { err, result: attributes } = await this.baseFindAll(findAllAttributes);
            //if (returnIDs) {
            return {
                err,
                result: attributes === null || attributes === void 0 ? void 0 : attributes.map((attribute) => {
                    return (attribute.dataValues[attributeID]);
                }),
            };
            //            }
            // return { // probs wrong here
            //     err, result: await Promise.all(attributes?.map(async (attribute) => {
            //         const { err, result } = await this.genreTable.find({ where: { id: attributes[attributeID] }, rejectOnEmpty: true });// I think here
            //         if (err) {
            //             throw new DatabaseError(`getAllBookAttribuesForSpecficBook() for ${this.model.toString()}` + err);
            //         }
            //         return result;
            //     }))
            // }
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("getAllBookGenresForSpecficBook()" + err);
        }
    }
}
exports.BaseBookAttributesModel = BaseBookAttributesModel;
class BaseAttributeModel extends BaseModel {
    async addAttribute(name) {
        try {
            const { err, result: findOrCreate } = await this.baseFindOrCreate({ where: { name } });
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("addAttribute()" + err);
        }
    }
    async getAttributeNameFromID(id) {
        try {
            const { err, result } = await this.findByPkey(id);
            return result.dataValues.name;
        }
        catch (err) {
            console.log(err);
            if (err instanceof customError_1.NotFoundError) {
                throw err;
            }
            throw new customError_1.DatabaseError("getAttributeNameFromID()" + err);
        }
    }
    async getAttributeNameFromIDs(ids) {
        try {
            let list = [];
            for (let id of ids) {
                const att = await this.getAttributeNameFromID(id);
                console.log(att);
                list.push(att);
            }
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.log(list);
            return list;
        }
        catch (err) {
            console.log(err);
            if (err instanceof customError_1.NotFoundError) {
                throw err;
            }
            throw new customError_1.DatabaseError("getAttributeNameFromIDs()" + err);
        }
    }
}
exports.BaseAttributeModel = BaseAttributeModel;
