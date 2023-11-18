import StdReturn from '../../types/types';
import { UserAttributesType, UserLogsType, ExcerisesType, FoodDataType, CustomFoodDataType } from '../../types/dbTypes';

// if you string is retured in error then error == true
// if error == null then error == false

//could be all statics and not need to instantiate

/**
 * abstract Class that provides atomic action to the database
 * @Description You have to pass the model in as parameter to the functions
 */
export abstract class BaseModel {

    //START OF DDL
    /**
     * creates a new entry into the database 
     * @param options object defining how data should be created (is an object of same type as model)
     * @returns Object of row created, where more functions can be done directly
     */
    protected create = async (model: any, options: any): Promise<StdReturn> => { //would like options to be type of model
        let theReturn: StdReturn = { err: null, result: "" };
        try {
            const result = await model.create(options)
            theReturn.err = null;
            theReturn.result = result
            return theReturn
        }
        catch (err) {
            console.log(err)
            throw new Error("Failed to perfrom create database Operation");
        }
    }


    protected destroy = async (model: any, options: any): Promise<StdReturn> => { //models = USER // options = OPTIONS
        let theReturn: StdReturn = { err: null, result: "" };
        try {
            const result = await model.destroy(options)
            console.log(result)
            if (result === null) {
                console.log("Not Found");
                theReturn.result = 'Not Found';
                theReturn.err = true;
                return theReturn;
            }
            theReturn.err = null;
            theReturn.result = result
            return theReturn;
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom destroy database Operation");
        }
    }

    protected build = async (model: any, options: any): Promise<StdReturn> => { // if any defalut values not filled, filled with defulat already set
        let theReturn: StdReturn = { err: null, result: "" };
        try {
            const result = await model.build(options)
            if (result === null || result === undefined) {
                theReturn.result = 'Not Found'
                theReturn.err = true;
                return theReturn
            }
            theReturn.err = null;
            theReturn.result = { created: true }
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom build database Operation");
        }
    }

    /**
     * updates certain fields in specific entry
     * @param model The specific row/entry you are refering too eg perosn Jane in Users
     * @param options What you want changing
     * @returns if Successful returns nothing  else throws ERROR
     */
    protected update = async (model: any, options: any): Promise<StdReturn> => { // if any defalut values not filled, filled with defulat already set.
        try {
            let theReturn: StdReturn = { err: null, result: "" };
            await model.update(options)
            await model.save();
            theReturn.err = null;
            theReturn.result = null
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom update database Operation: " + err);
        }
    }

    // create function bulkCreate

    //END OF DDL
    //START OF DML

    /**
     * finds a specfic row that confroms to optinal clauses
     * @param options and object of conditions
     * @returns if found returns object, if not found returns null 
     */
    protected findOne = async (model: any, options: any): Promise<StdReturn> => {
        let theReturn: StdReturn = { err: null, result: "" };
        try {
            const result = await model.findOne(options)
            if (result === null || result === undefined) {
                console.log("not found")
                theReturn.result = null
                theReturn.err = "not found";
                return theReturn
            }
            theReturn.err = null;
            theReturn.result = result
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom findOne database Operation");
        }
    }

    protected findAll = async (model: any, options: any): Promise<StdReturn> => {
        let theReturn: StdReturn = { err: null, result: "" };
        try {
            const result = await model.findAll(options)
            if (result === null || result === undefined) {
                console.log("not found")
                theReturn.result = null
                theReturn.err = "not found";
                return theReturn
            }
            theReturn.err = null;
            theReturn.result = result
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom findAll database Operation");
        }
    }
    // what about if not found
    protected findOrCreate = async (model: any, options: any): Promise<StdReturn> => {
        try {
            let theReturn: StdReturn = { err: null, result: null };
            const { user, created } = await model.findByPk(options)
            if (user === null || user === undefined) {
                console.log("not found")
                theReturn.result = null
                theReturn.err = "not found";
                return theReturn
            }
            theReturn.err = null;
            theReturn.result = { user: user, created: created }
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom findOrCreate database Operation");
        }
    }
    /**
     * Finds an instance of primary key in table and return the row of the table
     * @param primaryKey Is the Primary of table you want to find
     * @returns if (err) wil crash, if not found will return not found, will return the table as object (How the function is Sequlize returns it)
     */
    protected findByPkey = async (model: any, primaryKey: any): Promise<StdReturn> => {
        try {
            let theReturn: StdReturn = { err: "Primary Key Not Found", result: null };
            const result = await model.findByPk(primaryKey)
            if (result === null) {
                console.log("not found")
                return theReturn
            }
            theReturn.err = null;
            theReturn.result = result
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom findByPkey database Operation");
        }
    }

    protected findAndCountAll = async (model: any, options: any): Promise<StdReturn> => {
        let theReturn: StdReturn = { err: null, result: null };
        try {
            const { count, rows } = await model.findAndCountAll(options)
            if (rows === null || rows === undefined) {
                console.log("not found")
                theReturn.result = null
                return theReturn
            }
            theReturn.err = null;
            theReturn.result = { count: count, rows: rows }
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom findByPkey database Operation");
        }
    }

    // need to make sure query is escaped/ or does SEQULIZE do that for use
    protected customQuery = async (model: any, query: string, options: any): Promise<StdReturn> => {
        try {
            let theReturn: StdReturn = { err: null, result: "" };
            const result = await model.query(query, options)
            if (result === null || result === undefined) {
                theReturn.result = 'Not Found'
                return theReturn
            }
            theReturn.err = null;
            theReturn.result = result
            return theReturn
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom customQuery database Operation");
        }
    }




}

