import StdReturn from '../../types/baseTypes';
import { DatabaseError, NotFoundError } from '../../utils/customError';
import { RentalsDetails, User } from '../modelSetUp';
import { Attributes, DestroyOptions, InstanceDestroyOptions, CreateOptions, InstanceUpdateOptions, NonNullFindOptions, FindOptions } from 'sequelize/types';
import { ModelTypes, Models } from '../../types/baseTypes'
import { Model, ModelStatic, Optional } from 'sequelize/types';
import { mode } from 'crypto-js';




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
     * @model ModelStatic<T> is the model/table you want to create a new entry in
     * @param options object defining how data should be created (is an object of same type as model)
     * @returns Object of row created, where more functions can be done directly
     */
    protected   baseCreate =  async <T extends Model<any, any> = Models>(model: ModelStatic<T>, options: Attributes<T>): Promise<StdReturn<T>> => { //would like options to be type of model

        try {
            const result = await model.create(options); // Cast options to 'any' type
            return { err: null, result };
        }
        catch (err: any) {
            console.log(err);
            throw new DatabaseError("baseModels Create() Error " + err.message);
        }
    }


    /**
     * 
     * @param model ModelStatic<T> = Table you want to delete from
     * @param options used to define what you want to delete
     * @returns 
     */
    protected baseDestroy = async  <T extends Model<any, any> = Models>(model: ModelStatic<T>, options: DestroyOptions<Attributes<T>>): Promise<StdReturn<number>> => { //models = USER // options = OPTIONS
        try {

            const result = await model.destroy(options) // returns a number 
            if (result === null) {
                throw new NotFoundError("User not found in 'destroy' ");
            }
            return { err: null, result };
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("Failed to perfrom destroy database Operation");
        }
    }

    protected build = async (model: any, options: any): Promise<StdReturn> => { // if any defalut values not filled, filled with defulat already set
        try {
            const result = await model.build(options)
            if (result === null || result === undefined) {
                throw new NotFoundError("User not found in 'build' ");
            }
            return { err: null, result };
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to perfrom build database Operation");
        }
    }

    /**
     * updates certain fields in specific entry
     * 
     * @param model T = The specific row/entry you are refering too eg perosn Jane in Users
     * @param options What you want changing
     * @returns if Successful returns nothing  else throws ERROR
     */
    protected baseUpdate = async  <T extends Model<any, any> = Models>(model: T, options: InstanceUpdateOptions<T>): Promise<void> => { // if any defalut values not filled, filled with defulat already set.
        try {
            await model.update(options)
            await model.save();// not needed
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("Failed to perfrom update database Operation: " + err);
        }
    }

    // create function bulkCreate

    //END OF DDL
    //START OF DML

    /**
     * finds a specfic row that confroms to optinal clauses
     * @param model ModelStatic<T> = Table you want to find one from
     * @param options and object of conditions
     * @returns if found returns object, if not found returns null 
     */
    protected baseFindOne = async <T extends Model<any, any> = Models>(model: ModelStatic<T>, options: NonNullFindOptions<Attributes<T>>): Promise<StdReturn<T>> => {
        try {
            const result = await model.findOne(options)
            if (result === null || result === undefined) {
                throw new NotFoundError("User not found in 'findOne' ");
            }
            return { err: null, result };
        }
        catch (err) {
            console.error(err);
            throw new DatabaseError("Failed to perform 'findOne'");
        }
    }



    protected baseFindAll = async <T extends Model<any, any> = Models>(model: ModelStatic<T>, options: FindOptions<Attributes<T>> | undefined): Promise<StdReturn<T[]>> => {
        try {
            const result = await model.findAll(options)
            if (result === null || result === undefined) {
                throw new NotFoundError("not found in 'findAll' ");

            }
            return { err: null, result };
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("Failed to perfrom findAll database Operation");
        }
    }

    protected findOrCreate = async (model: any, options: any): Promise<StdReturn> => {
        try {
            const result = await model.findByPk(options)
            if (result.user === null || result.user === undefined) {
                throw new NotFoundError("User not found in 'findOrCreate' ");
            }
            return { err: null, result };
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("Failed to perfrom findOrCreate database Operation");
        }
    }
    
    protected findByPkey = async (model: any, primaryKey: any): Promise<StdReturn> => {
        const result = await model.findByPk(primaryKey)
        if (result === null) {
            throw new NotFoundError("not found in findByPkey")
        }
        return { err: null, result };
    }
    catch(err: any) {
        console.log(err);
        throw new DatabaseError("Failed to perfrom findByPkey database Operation");
    }
    
    protected findAndCountAll = async (model: any, options: any): Promise<StdReturn> => {
        try {
            const result = await model.findAndCountAll(options)
            if (result.rows === null || result.rows === undefined) {
                throw new NotFoundError("not found in findAndCountAll")
            }
            return { err: null, result };
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("Failed to perfrom findByPkey database Operation");
        }
    }

    // need to make sure query is escaped/ or does SEQULIZE do that for use
    protected customQuery = async (model: any, query: string, options: any): Promise<StdReturn> => {
        try {
            const result = await model.query(query, options)
            if (result === null || result === undefined) {
                throw new NotFoundError("not found in 'customQuery' ");
            }
            return { err: null, result };
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("Failed to perfrom customQuery database Operation");
        }
    }
}





