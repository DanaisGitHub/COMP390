"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalDetailsModel = void 0;
const modelSetUp_1 = require("../../DB_Functions/Set_Up/modelSetUp");
const baseModel_1 = require("../baseModel");
const RentalModel_1 = require("./RentalModel");
class RentalDetailsModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.RentalsDetail);
        this.rentalModel = new RentalModel_1.RentalModel();
    }
    async addItemToOrder(items) {
        try {
            const { err, result } = await this.baseCreate(items);
            if (err)
                throw new Error(err);
            // find seller a decrease quantity
            return result;
        }
        catch (err) {
            console.log(err);
            throw new Error("Error in addOrderItem");
        }
    }
}
exports.RentalDetailsModel = RentalDetailsModel;
