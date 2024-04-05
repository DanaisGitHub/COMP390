"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalDetailsModel = exports.RentalModel = void 0;
const random_1 = require("../../../utils/other/random");
const modelSetUp_1 = require("../../DB_Functions/Set_Up/modelSetUp");
const baseModel_1 = require("../baseModel");
class RentalModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.Rental);
        this.rentalDetailModel = new RentalDetailsModel();
    }
    async addOrderItem(details) {
        try {
            const orderNumber = (0, random_1.randomNumber)(1, 999999);
            const itemDetails = Object.assign(Object.assign({}, details), { orderNumber });
            const { err, result: user } = await this.baseCreate(itemDetails);
            if (err)
                throw new Error(err);
            return user;
        }
        catch (err) {
            console.error(err);
            throw new Error("Error in addOrderItem ---->" + err.message);
        }
    }
    async addOrderWithMultipleItems(rentalOrder, rentalItems) {
        try {
            const order = await this.addOrderItem(rentalOrder);
            const orderNumber = order.orderNumber;
            let rentalItem;
            for (const item of rentalItems) {
                rentalItem = Object.assign(Object.assign({}, item), { orderNumber });
                await this.rentalDetailModel.addItemToOrder(rentalItem);
            }
            return order;
        }
        catch (err) {
            console.error(err);
            throw new Error("Error in addOrderWithMultipleItems");
        }
    }
    async getAllPreviousLettings(letterID) {
        try {
            const { err, result } = await this.baseFindAll({ where: { letterID } });
            if (err)
                throw new Error(err);
            return result;
        }
        catch (err) {
            console.error(err);
            throw new Error("Error in getAllPreviousOrders");
        }
    }
    async getPreviousOrder(renterID) {
        try {
            const { err, result } = await this.baseFindAll({ where: { renterID } });
            if (err)
                throw new Error(err);
            return result;
        }
        catch (err) {
            console.error(err);
            throw new Error("Error in getPreviousOrder");
        }
    }
    async getAllRentalDetails(orderNumber) {
        try {
            const result = await this.baseFindOneNotTyped({ where: { orderNumber }, include: [modelSetUp_1.RentalsDetail], rejectOnEmpty: true });
            return result;
        }
        catch (err) {
            console.error(err);
            throw new Error("Error in getAllRentalDetails ---->" + err.message);
        }
    }
}
exports.RentalModel = RentalModel;
class RentalDetailsModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.RentalsDetail);
        this.rentalModel = new RentalModel();
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
