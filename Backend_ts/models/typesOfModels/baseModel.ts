import StdReturn from '../../types/baseTypes';
import { DatabaseError, NotFoundError } from '../../utils/customError';
import { RentalsDetails, User, Item, Rental, PaymentDetail, UserPreference } from '../modelSetUp';
import { Attributes, DestroyOptions, InstanceDestroyOptions, CreateOptions, InstanceUpdateOptions, NonNullFindOptions, FindOptions, UpdateOptions, FindOrCreateOptions, Identifier, BulkCreateOptions, BuildOptions, FindAndCountOptions } from 'sequelize/types';
import { ModelTypes, Models } from '../../types/baseTypes'
import { Model, ModelStatic, Optional } from 'sequelize/types';
import { mode } from 'crypto-js';
import { Col, Fn, Literal, MakeNullishOptional } from 'sequelize/types/utils';
import { ItemType } from '../../types/rentalType';

// cant perfrom circular imports



// be careful with the types here
//could be all statics and not need to instantiate

/**
 * abstract Class that provides atomic action to the database
 * @Description You have to pass the model in as parameter to the functions
 */
export class BaseModel<T extends Model<any, any> = Models> {


    protected model: ModelStatic<T>;// need to make this a generic

    constructor(model: ModelStatic<T>) {
        this.model = model;
    }
    //START OF DDL
    /**
     * creates a new entry into the database 
     * @model ModelStatic<T> is the model/table you want to create a new entry in
     * @param options object defining how data should be created (is an object of same type as model)
     * @returns Object of row created, where more functions can be done directly
     */
    protected baseCreate = async (options: Attributes<T>): Promise<StdReturn<T>> => { //would like options to be type of model

        try {
            const result = await this.model.create(options); // Cast options to 'any' type
            return { err: null, result };
        }
        catch (err: any) {
            console.log(err);
            throw new DatabaseError("baseModels Create() Error " + err.message);
        }
    }

    protected baseCreateMany = async (
        records: readonly MakeNullishOptional<T["_creationAttributes"]>[], // need to make this a generic
        options?: CreateOptions<Attributes<T>>): Promise<StdReturn<T[]>> => { //would like options to be type of model

        try {
            const result = await this.model.bulkCreate(records, options); // Cast options to 'any' type
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
    protected baseDestroy = async (options: DestroyOptions<Attributes<T>>): Promise<StdReturn<number>> => { //models = USER // options = OPTIONS
        try {

            const result = await this.model.destroy(options) // returns a number 
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

    /**
 * 
 * @param model ModelStatic<T> = Table you want to update
 * @param searchTerm for ALL items you want to update
 * @param updatingFields update 
 */
    protected baseUpdate = async (
        values: { [key in keyof Attributes<T>]?: Fn | Col | Literal | Attributes<T>[key] | undefined },
        searchTerm: Omit<UpdateOptions<Attributes<T>>, "returning">): Promise<void> => { // if any defalut values not filled, filled with defulat already set.
        try {
            await this.model.update(values, searchTerm);
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
    protected baseFindOne = async (options: NonNullFindOptions<Attributes<T>>): Promise<StdReturn<T>> => {
        try {
            const result = await this.model.findOne(options)
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

    protected baseFindAll = async (options: FindOptions<Attributes<T>> | undefined): Promise<StdReturn<T[]>> => {
        try {
            const result = await this.model.findAll(options)
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

    protected build = async (record?: MakeNullishOptional<T["_creationAttributes"]> | undefined, options?: BuildOptions | undefined): Promise<StdReturn> => { // if any defalut values not filled, filled with defulat already set
        try {
            const result = await this.model.build(record, options)
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



    protected baseFindOrCreate = async (options: FindOrCreateOptions<Attributes<T>, MakeNullishOptional<T["_creationAttributes"]>>)
        : Promise<StdReturn<[T, boolean]>> => {
        try {
            const result = await this.model.findCreateFind(options)
            return { err: null, result };
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("Failed to perfrom findOrCreate database Operation");
        }
    }

    protected findByPkey = async (identifier?: Identifier | undefined, options?: Omit<FindOptions<Attributes<T>>, "where"> | undefined): Promise<StdReturn<T>> => {
        const result = await this.model.findByPk(identifier, options)
        if (result === null) {
            throw new NotFoundError("not found in findByPkey")
        }
        return { err: null, result };
    }
    catch(err: any) {
        console.log(err);
        throw new DatabaseError("Failed to perfrom findByPkey database Operation");
    }

    protected findAndCountAll = async (options?: Omit<FindAndCountOptions<Attributes<T>>, "group"> | undefined): Promise<StdReturn<{ rows: T[], count: number; }>> => {
        try {
            const result = await this.model.findAndCountAll(options)
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

    // TODO: Custom Query


    ///////////////////////////
    //PUBLIC FUNCTIONS
    ///////////////////////////
    public async addNew(details: Attributes<T>): Promise<StdReturn<T>> { // why do I need these
        try {
            const { err, result } = await this.baseCreate(details);
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("Item Models addNew()::=> " + err);
        }
    }

    public async remove(searchTerm: DestroyOptions<Attributes<T>>): Promise<StdReturn<number>> {
        try {
            const { err, result } = await this.baseDestroy(searchTerm); // will need to test
            return { err, result };
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("Item Models destroy()::=> " + err);
        }
    }

    public async update(
        values: { [key in keyof Attributes<T>]?: Fn | Col | Literal | Attributes<T>[key] | undefined },
        searchTerm: Omit<UpdateOptions<Attributes<T>>, "returning">): Promise<void> {
        try {
            await this.baseUpdate(values, searchTerm);
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("Item Models update()::=> " + err);
        }
    }

    public async find(options: NonNullFindOptions<Attributes<T>>): Promise<StdReturn<T>> {
        try {
            const { err, result } = await this.baseFindOne(options)
            return { err, result }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("Item Models find()::=> " + err);
        }
    }
    public async findMany(options: NonNullFindOptions<Attributes<T>>): Promise<StdReturn<T[]>> {
        try {
            const { err, result } = await this.baseFindAll(options)
            return { err, result }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("Item Models findMany()::=> " + err);
        }
    }

    public async baseBookLink(bookName: string, linkName: string, linkTable: any, bookTable: any): Promise<void> {
        try {
            let book, linkRes;
            const jsonName = (linkTable.constructor.name === "GenreModel" ? "genre"
                : linkTable.constructor.name === "FormatModel" ? "format" : "author") + "Id";

            try {
                book = await bookTable.find({
                    where: { book: bookName },
                    rejectOnEmpty: true
                });
            } catch (err) {
                throw new NotFoundError("Book not found in 'baseBookLink' ");
            }

            try {
                linkRes = await linkTable.find({
                    where: { name: linkName },
                    rejectOnEmpty: true
                });

            } catch (err) {
                throw new NotFoundError("Link not found in 'baseBookLink' ");
            }

            if (book.result === null || linkRes.result === null) {
                throw new NotFoundError("Book or Link not found in 'baseBookLink' ");
            }
            let createObject: { bookId: number, genre?: number, format?: number, author?: number } = {
                bookId: book.result.id,
                [jsonName]: linkRes.result.id

            };
            await this.model.create(createObject as any); // might be creating duplicates // shouldn't be any}
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("Failed to perfrom baseBookLink database Operation");
        }
        // 
    }
}





