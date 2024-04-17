import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';


export const errorHandler = (err: any, req: Req, res: Res, next: Next) => {
    console.log("There was an error!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", err)
    res.status(500).json({ err: err, result: null })
}


export const asyncErrorHandler = (func:Function) => {
    return async (req:Req, res:Res, next:Next) => {
        try {
            await func(req, res, next)
        }
        catch (err) {
            console.log("GLOBAL ERROR HANDLER -----> " + err)
            next(err)
        }
    }
    
}