"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.DatabaseError = exports.CustomResError = void 0;
class CustomResError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.isOperational = true;
        this.stack = {};
    }
}
exports.CustomResError = CustomResError;
class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DatabaseError";
    }
}
exports.DatabaseError = DatabaseError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
