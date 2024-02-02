import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';

// test
import { authMiddleware } from '../utils/authUtils'
import { User } from '../models/modelSetUp';
import jwt from 'jsonwebtoken';

import path from 'path';
import fs from 'fs';


import authRoutes from './authRoutes';
import apiRoutes from '../API/googleMaps/googleMapsAPI';
import testRoutes from './testRoutes';
import StdReturn from '../types/baseTypes';
//import { FoodModel } from '../models/typesOfModels/foodModel';

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const router = Router();
router.use('/test', testRoutes)
router.use('/auth', authRoutes);
router.use('/api', apiRoutes);




const errorHandler = (err: any, req: Req, res: Res, next: Next) => {
    console.log("There was an error", err)
    res.status(500).json({ err: "There was a fatal an error", result: err })
}

/**
 * 
 * @returns the date of today
 */
const getTodaysDate = (): Date => {
    const today: Date = new Date();
    const dateAsString: string = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const todayDate: Date = new Date(dateAsString);
    return todayDate;

}
/**
 * Calucates the date of the day that is x days ago
 * @param days number of days to go back
 * @returns 
 */
const getDate = (days: number): Date => {
    const today: Date = new Date();
    const yesterday: Date = new Date(today);
    yesterday.setDate(today.getDate() - days);
    yesterday.setHours(0, 0, 0, 0); // set time to midnight
    return yesterday;
}

export default router;

