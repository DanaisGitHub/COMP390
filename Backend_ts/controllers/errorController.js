"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncErrorHandler = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.log("There was an error!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", err);
    res.status(500).json({ err: err, result: null });
};
exports.errorHandler = errorHandler;
const asyncErrorHandler = (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        }
        catch (err) {
            console.log("GLOBAL ERROR HANDLER -----> " + err);
            next(err);
        }
    };
};
exports.asyncErrorHandler = asyncErrorHandler;
