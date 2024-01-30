"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
/**
 * Base Controller
 */
class BaseController {
    constructor(db, model) {
        this.create = async (res, newData) => {
            try {
                const { err, result } = await this.db.addNew(newData);
                res.status(200).json({ err, result });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ err: err, result: `Create ` });
            }
        };
        // input would not be from user
        this.getOne = async (req, res, next) => {
            try { // need to figure out what to with search term
                const { itemId } = req.body;
                const { err, result } = await this.db.find({
                    where: { id: itemId },
                    rejectOnEmpty: false
                });
                res.status(200).json({ err, result });
            }
            catch (err) { // more errors than just server errors
                console.log(err);
                res.status(500).json({ err: err, result: "There was an error" });
            }
        };
        this.getMany = async (req, res, next) => {
            try {
                const { price } = req.body;
                const { err, result } = await this.db.findMany({
                    where: { pricePerDay: price },
                    rejectOnEmpty: false
                });
                res.status(200).json({ err, result });
            }
            catch (err) { // more errors than just server errors
                console.log(err);
                res.status(500).json({ err: err, result: "There was an error" });
            }
        };
        this.update = async (req, res, next, model) => {
            try {
                const searchTerm = req.body.searchTerm;
                const values = req.body.values;
                await this.db.update(values, searchTerm);
                res.status(200).json({ err: null, result: "Updated" });
            }
            catch (err) { // more errors than just server errors
                console.log(err);
                res.status(500).json({ err: err, result: "There was an error" });
            }
        };
        this.remove = async (req, res, next) => {
            try {
                const searchTerm = req.body.searchTerm;
                const { err, result } = await this.db.remove(searchTerm);
                res.status(200).json({ err, result });
            }
            catch (err) { // more errors than just server errors
                console.log(err);
                res.status(500).json({ err: err, result: "There was an error" });
            }
        };
        this.db = db;
        this.model = model;
    }
}
exports.BaseController = BaseController;
