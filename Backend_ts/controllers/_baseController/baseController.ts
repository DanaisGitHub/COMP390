
import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';




//import self-written files
import { UserItem, User } from '../../models/DB_Functions/Set_Up/modelSetUp';
import StdReturn, { Models } from '../../types/baseTypes';
import { UserItemModel } from '../../models/typesOfModels/Items/UserItemModel';
import { ItemType, RentalType, PaymentDetailType, RentalDetailType } from '../../types/DBTypes/RentalTypes/rentalType';
import { coordiantes } from '../../types/baseTypes';
import { Attributes, Model, ModelStatic } from 'sequelize';
import { BaseModel } from '../../models/typesOfModels/baseModel';


// THE ONLY THING YOU CAN PARENT CLASS IS SECURITY, AUTHORIZATION, AND ERROR HANDLING, AND LOGGING ... THINK OF MORE LATER

type ModelClass = UserItemModel;

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
            const { err, result }: StdReturn<Models[]> = await this.db.findAll({ // need to figure out what to with search ter
                where: { price: price },
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