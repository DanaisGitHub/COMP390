import StdReturn from '../../types/baseTypes';
import { DatabaseError, NotFoundError } from '../../utils/other/customError';
import { RentalsDetail, User, UserItem, Rental, PaymentDetail, UserPreference, Author, Format, Genre, BookAuthor, BookFormat, BookGenre } from '../DB_Functions/Set_Up/modelSetUp';
import { Attributes, DestroyOptions, InstanceDestroyOptions, CreateOptions, InstanceUpdateOptions, NonNullFindOptions, FindOptions, UpdateOptions, FindOrCreateOptions, Identifier, BulkCreateOptions, BuildOptions, FindAndCountOptions } from 'sequelize/types';
import { ModelTypes, Models } from '../../types/baseTypes'
import { Model, ModelStatic, Optional } from 'sequelize/types';
import { mode } from 'crypto-js';
import { Col, Fn, Literal, MakeNullishOptional, } from 'sequelize/types/utils';
import { ItemType } from '../../types/DBTypes/RentalTypes/rentalType';
import { AuthorModel } from './Items/BookModels/AuthorModels/AuthorModels';
import { AuthorType, BookAuthorType, BookFormatType, BookGenreType, FormatType, GenreType } from '../../types/DBTypes/BookTypes/bookTypes';
import { CountOptions } from 'sequelize';
import { GenreModel } from './Items/BookModels/GenreModels/GenreModels';
import { EmptyResultError } from 'sequelize';

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
     * Updates a row in the database
     * 
     * @param values = object of values to be updated
     * @param searchTerm = object of conditions/ how to find row
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
                throw new EmptyResultError("User not found in 'findOne' ");
            }
            return { err: null, result };
        }
        catch (err) {
            console.error(err);
            if (err instanceof EmptyResultError) {
                throw new NotFoundError("User not found in 'findOne' " + err.message);
            }
            throw new DatabaseError("Failed to perform 'findOne'");
        }
    }

    public baseFindOneNotTyped = async <P>(options: NonNullFindOptions<Attributes<T>>): Promise<P> => {
        try {
            const result = await this.model.findOne(options)
            if (result === null || result === undefined) {
                throw new NotFoundError("User not found in 'findOne' ");
            }
            return result as unknown as P;
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

    /**
     * 
     * @param identifier if no identifier is passed, it will return all
     * @param options 
     * @returns 
     */
    public findByPkey = async (identifier?: Identifier | undefined, options?: Omit<FindOptions<Attributes<T>>, "where"> | undefined): Promise<StdReturn<T>> => {
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

    public getRandom = async (options?: Omit<FindOptions<Attributes<T>>, "order"> | undefined): Promise<T> => {
        try {
            const result = await this.model.findOne({ ...options, order: this.model.sequelize?.random() })
            if (result === null) {
                throw new NotFoundError("not found in getRandom")
            }
            return result as T;
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("Failed to perfrom getRandom database Operation");
        }
    }

    // TODO: Custom Query


    ///////////////////////////
    //PUBLIC FUNCTIONS
    ///////////////////////////
    // why do these exist

    public customQuery = async (query: string): Promise<any> => {
        try {
            const result = await this.model.sequelize?.query(query);
            return result;
        }
        catch (err: any) {
            console.error(err);
            throw new DatabaseError(`Failed to perfrom customQuery database Operation: ${err}`);
        }
    }

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
    public async findAll(options: NonNullFindOptions<Attributes<T>>): Promise<StdReturn<T[]>> {
        try {
            const { err, result } = await this.baseFindAll(options)
            return { err, result }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("Item Models findMany()::=> " + err);
        }
    }

    // should be in a sperate class // is creating twice
    public async baseBookLink(bookName: string, linkName: string, linkTable: any, bookTable: any): Promise<void> {
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
            } catch (err) {
                throw new NotFoundError("Book not found in 'baseBookLink' ");
            }

            // seraching for attribute
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
            let createObject: { bookID: number, genre?: number, format?: number, author?: number } = {
                bookID: book.result.id,
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

    public async getAll(): Promise<StdReturn<T[]>> {
        try {
            const { err, result } = await this.baseFindAll({});
            return { err, result }
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("getAll()" + err);
        }

    }

    public async count(options: Omit<CountOptions<Attributes<T>>, "group"> | undefined): Promise<number> {
        try {
            const num = await this.model.count(options);
            return num;
        }
        catch (err) {
            console.log(err)
            throw new DatabaseError("count()" + err);
        }
    }

    public async entryExists(options: Omit<CountOptions<Attributes<T>>, "group"> | undefined): Promise<boolean> {
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
            throw new DatabaseError("entryExists()" + err);
        }
    }

    public async performOnAllRows(action: (item: any) => void, limit = 100, offset = 0,): Promise<void> {
        try {
            let result: T[];
            do {
                result = await this.model.findAll({
                    limit, offset,
                });
                result?.forEach(action);
                offset += limit;

            } while (result.length === limit);
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("performOnAll()" + err);
        }
    }


    private async getObjFromID(id: number): Promise<T> {
        try {
            const { err, result } = await this.findByPkey(id);
            return result;
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("idToObj()" + err);
        }
    }

    public async getObjsFromIDs(id: number[]): Promise<T[]> {
        try {
            const objs = await Promise.all(id.map(async (id) => {
                return await this.getObjFromID(id);
            }));
            return objs;
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("idsToObjs()" + err);
        }
    }



}

type BaseBookAttributes = BookAuthor | BookFormat | BookGenre;


export class BaseBookAttributesModel<T extends BaseBookAttributes> extends BaseModel<T> {


    /**
     * For given bookID, returns all the attributes of the book eg all formats book is in
     * 
     * @param id BookID
     * @param returnIDs weather you want the ids or the actual objects
     * @returns 
     */
    public async getAllBookAttributesForSpecficBook(id: number, returnIDs = true): Promise<StdReturn</*T[]*/ | number[]>> {
        try {
            let findAllAttributes: any/*: FindOptions<Attributes<T>> | undefined*/, attributeID: string, model: ModelStatic<T>;
            if (this.model === BookAuthor) {
                attributeID = "authorID";
                const authorID = id;
                findAllAttributes = {
                    include: [{
                        model: Author,
                        as: 'authorBooks',
                        where: { id: authorID }, // here we say: where Genre.id = genreID
                        attributes: []
                    }]
                };
            } else if (this.model === BookFormat) {
                attributeID = "formatID";
                const formatID = id;
                findAllAttributes = {
                    include: [{
                        model: Format,
                        as: 'formatBooks',
                        where: { id: formatID }, // here we say: where Genre.id = genreID
                        attributes: []
                    }]
                };
            }
            else if (this.model === BookGenre) {
                attributeID = "genreID";
                const genreID = id;
                findAllAttributes = {
                    include: [{
                        model: Genre,
                        as: 'genreBooks',
                        where: { id: genreID }, // here we say: where Genre.id = genreID
                        attributes: []
                    }]
                };
            };
            const { err, result: attributes } = await this.baseFindAll(findAllAttributes);
            //if (returnIDs) {
            return {
                err,
                result: attributes?.map((attribute) => {
                    return ((attribute.dataValues as Record<string, any>)[attributeID]) as number;
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
            console.log(err)
            throw new DatabaseError("getAllBookGenresForSpecficBook()" + err);
        }
    }

    // public async getAttributeNamesFromIDs(ids: number[]): Promise<string[]> {
    //     try {
    //         let list: string[] = [];
    //         if (this.model === BookGenre) {
    //             list = ids.map(async (id) => {
    //                 const res = await this.model.findOne({ where: { id }, include: [Genre, Format, Author] }) as T;
    //                 return res?.name as string;
    //             });

    //         }

    //         return list;
    //     }
    //     catch (err) {
    //         console.log(err)
    //         throw new DatabaseError("getAttributeFromIDs()" + err);
    //     }
    // }

}

export type BaseAttributeType = Genre | Format | Author;

export class BaseAttributeModel<T extends BaseAttributeType> extends BaseModel<T> {


    public async addAttribute(name: string): Promise<void> { // if we group by name, we can remove duplicates
        try {
            const { err, result: findOrCreate } = await this.baseFindOrCreate({ where: { name } } as any);

        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("addAttribute()" + err);
        }
    }

    public async getAttributeNameFromID(id: number): Promise<string> {
        try {
            const { err, result } = await this.findByPkey(id);
            return result.dataValues.name as string;
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("getAttributeNameFromID()" + err);
        }
    }

    public async getAttributeNameFromIDs(ids: number[]): Promise<string[]> {
        try {
            let list: string[] = [];
            for (let id of ids) {
                const att = await this.getAttributeNameFromID(id)
                console.log(att);
                list.push(att);
            }
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
            )
            console.log(list);
            return list;
        }
        catch (err) {
            console.log(err);
            throw new DatabaseError("getAttributeNameFromIDs()" + err);
        }
    }



}
