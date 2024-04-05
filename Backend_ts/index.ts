import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import path from 'path';
import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';


import { sequelize, initialize } from './models/DB_Functions/Set_Up/modelSetUp'

import authRoutes from './routes/Auth/authRoutes';
import baseRoutes from './routes/baseRoutes';
import { UserModel } from './models/typesOfModels/Users/userModels';
import { DBSetupListener } from './models/DB_Functions/Set_Up/modelSetUp';

dotenv.config();
const app = express();




// all routes run through the middleware def app.use(X)
app.use(bodyParser.urlencoded({ extended: false })); // we mihgt not need
app.use(bodyParser.json()) // we might not need 
app.use(cookieParser())
app.use(passport.initialize());
app.use(cors());

app.use('/', baseRoutes)// sending all routes that start with '/' to routes folder

// start the server
app.listen(5000, () => console.log("Server running on port " + 5000));

sequelize.authenticate()
    .then(async () => {
        await initialize();
        console.log('DB connection successful');
        // setTimeout(async () => { //works
        //     try {
        //         await DBSetupListener.createUserItems(); // need to be able to toggle
        //     } catch (err) {
        //         console.log(err)
        //     }
        // }, 1000)
    })
    .catch((error) => {
        console.log('DB connection Failed becuase: ', error)
    });








