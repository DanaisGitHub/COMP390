
import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

import FoodApiClass from '../../controllers/usdaApi/usdaApi';



//import self-written files
import { Item, User } from '../../models/DB_Functions/Set_Up/modelSetUp';
import StdReturn, { Models } from '../../types/baseTypes';
import { ItemModel } from '../../models/typesOfModels/Items/ItemsModel';
import { TempUserType, UserPreferenceType } from '../../types/userType';
import { ItemType, RentalType, PaymentDetailType, RentalDetailType } from '../../types/rentalType';
import { coordiantes } from '../../types/baseTypes';
import { Attributes, Model, ModelStatic } from 'sequelize';
import { BaseModel } from '../../models/typesOfModels/baseModel';


// export interface BasicCRUDControllerI { // all Working
//     create: (res: Res, newData: Attributes<Models>) => Promise<void>;
//     remove: (req: Req, res: Res, next: Next) => Promise<void>;
//     update: (req: Req, res: Res, next: Next, model: ModelStatic<Models>) => Promise<void>;
//     getOne: (req: Req, res: Res, next: Next) => Promise<void>;
//     getMany: (req: Req, res: Res, next: Next) => Promise<void>;
// }

type ModelClass = ItemModel;

/**
 * Base Controller 
 */
export abstract class BaseController<T extends ModelClass, M extends Model<any, any> = Models>{

    protected db: T; // T will only cover 5 CRUD functions(create, remove, update, getOne, getMany)
    protected model: ModelStatic<M>;

    constructor(db: T, model: ModelStatic<M>) {
        this.db = db;
        this.model = model;
    }


    protected create = async (res: Res, newData: Attributes<M>) => { // add into user logs
        try {
            const { err, result } = await this.db.addNew(newData);
            res.status(200).json({ err, result })
        } catch (err) {
            console.log(err)
            res.status(500).json({ err: err, result: `Create ` })
        }
    }


    // input would not be from user
    protected getOne = async (req: Req, res: Res, next: Next) => { // user is not going to call this directly
        try { // need to figure out what to with search term
            const { itemId } = req.body;
            const { err, result }: StdReturn<Models> = await this.db.find({
                where: { id: itemId },
                rejectOnEmpty: false
            })
            res.status(200).json({ err, result })
        }
        catch (err) { // more errors than just server errors
            console.log(err)
            res.status(500).json({ err: err, result: "There was an error" })
        }
    }

    protected getMany = async (req: Req, res: Res, next: Next) => { // user is not going to call this directly
        try {
            const { price } = req.body;
            const { err, result }: StdReturn<Models[]> = await this.db.findMany({ // need to figure out what to with search ter
                where: { pricePerDay: price },
                rejectOnEmpty: false
            })
            res.status(200).json({ err, result })
        }
        catch (err) { // more errors than just server errors
            console.log(err)
            res.status(500).json({ err: err, result: "There was an error" })
        }
    }

    protected update = async (req: Req, res: Res, next: Next, model: ModelStatic<Models>) => {
        try {
            const searchTerm = req.body.searchTerm;
            const values = req.body.values;

            await this.db.update(values, searchTerm);
            res.status(200).json({ err: null, result: "Updated" })
        }
        catch (err) { // more errors than just server errors
            console.log(err)
            res.status(500).json({ err: err, result: "There was an error" })
        }
    }

    protected remove = async (req: Req, res: Res, next: Next) => {
        try {
            const searchTerm = req.body.searchTerm;
            const { err, result }: StdReturn<number> = await this.db.remove(searchTerm);
            res.status(200).json({ err, result })
        }
        catch (err) { // more errors than just server errors
            console.log(err)
            res.status(500).json({ err: err, result: "There was an error" })
        }
    }
}