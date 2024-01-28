"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
const customError_1 = require("../../utils/customError");
// if you string is retured in error then error == true
// if error == null then error == false
//could be all statics and not need to instantiate
/**
 * abstract Class that provides atomic action to the database
 * @Description You have to pass the model in as parameter to the functions
 */
class BaseModel {
    constructor() {
        //START OF DDL
        /**
         * creates a new entry into the database
         * @model ModelStatic<T> is the model/table you want to create a new entry in
         * @param options object defining how data should be created (is an object of same type as model)
         * @returns Object of row created, where more functions can be done directly
         */
        this.baseCreate = async (model, options) => {
            try {
                const result = await model.create(options); // Cast options to 'any' type
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
        this.baseDestroy = async (model, options) => {
            try {
                const result = await model.destroy(options); // returns a number 
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
        this.build = async (model, options) => {
            try {
                const result = await model.build(options);
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
        /**
         * updates certain fields in specific entry
         *
         * @param model T = The specific row/entry you are refering too eg perosn Jane in Users
         * @param options What you want changing
         * @returns if Successful returns nothing  else throws ERROR
         */
        this.baseUpdate = async (model, options) => {
            try {
                await model.update(options);
                await model.save(); // not needed
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
        this.baseFindOne = async (model, options) => {
            try {
                const result = await model.findOne(options);
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
        this.baseFindAll = async (model, options) => {
            try {
                const result = await model.findAll(options);
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
        this.findOrCreate = async (model, options) => {
            try {
                const result = await model.findByPk(options);
                if (result.user === null || result.user === undefined) {
                    throw new customError_1.NotFoundError("User not found in 'findOrCreate' ");
                }
                return { err: null, result };
            }
            catch (err) {
                console.log(err);
                throw new customError_1.DatabaseError("Failed to perfrom findOrCreate database Operation");
            }
        };
        this.findByPkey = async (model, primaryKey) => {
            const result = await model.findByPk(primaryKey);
            if (result === null) {
                throw new customError_1.NotFoundError("not found in findByPkey");
            }
            return { err: null, result };
        };
        this.findAndCountAll = async (model, options) => {
            try {
                const result = await model.findAndCountAll(options);
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
        // need to make sure query is escaped/ or does SEQULIZE do that for use
        this.customQuery = async (model, query, options) => {
            try {
                const result = await model.query(query, options);
                if (result === null || result === undefined) {
                    throw new customError_1.NotFoundError("not found in 'customQuery' ");
                }
                return { err: null, result };
            }
            catch (err) {
                console.log(err);
                throw new customError_1.DatabaseError("Failed to perfrom customQuery database Operation");
            }
        };
    }
    catch(err) {
        console.log(err);
        throw new customError_1.DatabaseError("Failed to perfrom findByPkey database Operation");
    }
}
exports.BaseModel = BaseModel;
