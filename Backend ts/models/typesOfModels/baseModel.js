"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
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
         * @param options object defining how data should be created (is an object of same type as model)
         * @returns Object of row created, where more functions can be done directly
         */
        this.create = async (model, options) => {
            let theReturn = { err: null, result: "" };
            try {
                const result = await model.create(options);
                theReturn.err = null;
                theReturn.result = result;
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom create database Operation");
            }
        };
        this.destroy = async (model, options) => {
            let theReturn = { err: null, result: "" };
            try {
                const result = await model.destroy(options);
                console.log(result);
                if (result === null) {
                    console.log("Not Found");
                    theReturn.result = 'Not Found';
                    theReturn.err = true;
                    return theReturn;
                }
                theReturn.err = null;
                theReturn.result = result;
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom destroy database Operation");
            }
        };
        this.build = async (model, options) => {
            let theReturn = { err: null, result: "" };
            try {
                const result = await model.build(options);
                if (result === null || result === undefined) {
                    theReturn.result = 'Not Found';
                    theReturn.err = true;
                    return theReturn;
                }
                theReturn.err = null;
                theReturn.result = { created: true };
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom build database Operation");
            }
        };
        /**
         * updates certain fields in specific entry
         * @param model The specific row/entry you are refering too eg perosn Jane in Users
         * @param options What you want changing
         * @returns if Successful returns nothing  else throws ERROR
         */
        this.update = async (model, options) => {
            try {
                let theReturn = { err: null, result: "" };
                await model.update(options);
                await model.save();
                theReturn.err = null;
                theReturn.result = null;
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom update database Operation: " + err);
            }
        };
        // create function bulkCreate
        //END OF DDL
        //START OF DML
        /**
         * finds a specfic row that confroms to optinal clauses
         * @param options and object of conditions
         * @returns if found returns object, if not found returns null
         */
        this.findOne = async (model, options) => {
            let theReturn = { err: null, result: "" };
            try {
                const result = await model.findOne(options);
                if (result === null || result === undefined) {
                    console.log("not found");
                    theReturn.result = null;
                    theReturn.err = "not found";
                    return theReturn;
                }
                theReturn.err = null;
                theReturn.result = result;
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom findOne database Operation");
            }
        };
        this.findAll = async (model, options) => {
            let theReturn = { err: null, result: "" };
            try {
                const result = await model.findAll(options);
                if (result === null || result === undefined) {
                    console.log("not found");
                    theReturn.result = null;
                    theReturn.err = "not found";
                    return theReturn;
                }
                theReturn.err = null;
                theReturn.result = result;
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom findAll database Operation");
            }
        };
        // what about if not found
        this.findOrCreate = async (model, options) => {
            try {
                let theReturn = { err: null, result: null };
                const { user, created } = await model.findByPk(options);
                if (user === null || user === undefined) {
                    console.log("not found");
                    theReturn.result = null;
                    theReturn.err = "not found";
                    return theReturn;
                }
                theReturn.err = null;
                theReturn.result = { user: user, created: created };
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom findOrCreate database Operation");
            }
        };
        /**
         * Finds an instance of primary key in table and return the row of the table
         * @param primaryKey Is the Primary of table you want to find
         * @returns if (err) wil crash, if not found will return not found, will return the table as object (How the function is Sequlize returns it)
         */
        this.findByPkey = async (model, primaryKey) => {
            try {
                let theReturn = { err: "Primary Key Not Found", result: null };
                const result = await model.findByPk(primaryKey);
                if (result === null) {
                    console.log("not found");
                    return theReturn;
                }
                theReturn.err = null;
                theReturn.result = result;
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom findByPkey database Operation");
            }
        };
        this.findAndCountAll = async (model, options) => {
            let theReturn = { err: null, result: null };
            try {
                const { count, rows } = await model.findAndCountAll(options);
                if (rows === null || rows === undefined) {
                    console.log("not found");
                    theReturn.result = null;
                    return theReturn;
                }
                theReturn.err = null;
                theReturn.result = { count: count, rows: rows };
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom findByPkey database Operation");
            }
        };
        // need to make sure query is escaped/ or does SEQULIZE do that for use
        this.customQuery = async (model, query, options) => {
            try {
                let theReturn = { err: null, result: "" };
                const result = await model.query(query, options);
                if (result === null || result === undefined) {
                    theReturn.result = 'Not Found';
                    return theReturn;
                }
                theReturn.err = null;
                theReturn.result = result;
                return theReturn;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to perfrom customQuery database Operation");
            }
        };
    }
}
exports.BaseModel = BaseModel;
