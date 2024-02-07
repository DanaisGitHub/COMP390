"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
const customError_1 = require("../../utils/customError");
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
     *
     * @param model ModelStatic<T> = Table you want to update
     * @param searchTerm for ALL items you want to update
     * @param updatingFields update
     */
        this.baseUpdate = async (values, searchTerm) => {
            try {
                await this.model.update(values, searchTerm);
            }
            catch (err) {
                console.log(err);
                throw new customError_1.DatabaseError("Failed to perfrom update database Operation: " + err);
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
                    throw new customError_1.NotFoundError("User not found in 'findOne' ");
                }
                return { err: null, result };
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
        this.model = model;
    }
    catch(err) {
        console.log(err);
        throw new customError_1.DatabaseError("Failed to perfrom findByPkey database Operation");
    }
    // TODO: Custom Query
    ///////////////////////////
    //PUBLIC FUNCTIONS
    ///////////////////////////
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
            console.log(err);
            throw new customError_1.DatabaseError("Item Models find()::=> " + err);
        }
    }
    async findMany(options) {
        try {
            const { err, result } = await this.baseFindAll(options);
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new customError_1.DatabaseError("Item Models findMany()::=> " + err);
        }
    }
    async baseBookLink(bookName, linkName, linkTable, bookTable) {
        try {
            let book, linkRes;
            const jsonName = (linkTable.constructor.name === "GenreModel" ? "genre"
                : linkTable.constructor.name === "FormatModel" ? "format" : "author") + "Id";
            try {
                book = await bookTable.find({
                    where: { book: bookName },
                    rejectOnEmpty: true
                });
            }
            catch (err) {
                throw new customError_1.NotFoundError("Book not found in 'baseBookLink' ");
            }
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
                bookId: book.result.id,
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
}
exports.BaseModel = BaseModel;
