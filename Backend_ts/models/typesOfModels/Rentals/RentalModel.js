"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalModel = void 0;
const modelSetUp_1 = require("../../DB_Functions/Set_Up/modelSetUp");
const baseModel_1 = require("../baseModel");
const RentalDetailModel_1 = require("./RentalDetailModel");
const UserItemModel_1 = require("../Items/UserItemModel");
class RentalModel extends baseModel_1.BaseModel {
    constructor() {
        super(modelSetUp_1.Rental);
    }
    async addOrderItem(details) {
        try {
            const itemDetails = details;
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
    async addOrderWithItems(rentalReq) {
        try {
            const userItemModel = new UserItemModel_1.UserItemModel();
            const rentalDetailModel = new RentalDetailModel_1.RentalDetailsModel();
            const { rentalItems } = rentalReq;
            const order = await this.addOrderItem(rentalReq);
            const orderNumber = order.orderNumber;
            let rentalItem;
            const dayRented = order.endDate.getDate() - order.startDate.getDate();
            for (const item of rentalItems) {
                const { err, result: userItem } = await userItemModel.find({ where: { ownerID: rentalReq.ownerID, itemID: item.itemID }, rejectOnEmpty: true });
                let price = userItem.price * dayRented * item.quantity;
                price = price < 0 ? price * -1 : price;
                rentalItem = Object.assign(Object.assign({}, item), { orderNumber, price });
                await rentalDetailModel.addItemToOrder(rentalItem);
            }
            return order;
        }
        catch (err) {
            console.error(err);
            throw new Error("Error in addOrderWithItems" + err.message);
        }
    }
    async checkIfUserItemDatesClash(options) {
        try {
            const { ownerID, itemID, startDate, endDate } = options;
            const sqlStartDate = startDate.toISOString().slice(0, 19).replace('T', ' ');
            const sqlEndDate = endDate.toISOString().slice(0, 19).replace('T', ' ');
            const sqlQuery = `SELECT a.orderNumber, a.ownerID, rd1.itemID, a.startDate, a.endDate
            FROM Rentals a
            JOIN rentalsdetails rd1 ON a.orderNumber = rd1.orderNumber
            WHERE a.ownerID = '${ownerID}'
            AND rd1.itemId = '${itemID}'
            AND EXISTS (
              SELECT 1
              FROM Rentals b
              JOIN rentalsdetails rd2 ON b.orderNumber = rd2.orderNumber
              WHERE rd1.itemID = rd2.itemID
              AND a.orderNumber <> b.orderNumber
              AND (
                (b.startDate BETWEEN '${sqlStartDate}' AND '${sqlEndDate}')
                OR (b.endDate BETWEEN '${sqlStartDate}' AND '${sqlEndDate}')
                OR ('${sqlStartDate}' BETWEEN b.startDate AND b.endDate)
                OR ('${sqlEndDate}' BETWEEN b.startDate AND b.endDate)
              )
            );`;
            const [results, metadata] = await this.customQuery(sqlQuery);
            console.log(`results !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
            console.log(results);
            const clash = (results.length > 1); // true of false
            return clash;
        }
        catch (err) {
            console.error(err);
            throw new Error("Error in checkIfUserItemDatesClash ---->" + err.message);
        }
    }
    async getAllRentalDetails(orderNumber) {
        try {
            const result = await this.baseFindOneNotTyped({ where: { orderNumber }, include: [modelSetUp_1.RentalsDetail], rejectOnEmpty: false });
            return result;
        }
        catch (err) {
            console.error(err);
            throw new Error("Error in getAllRentalDetails ---->" + err.message);
        }
    }
}
exports.RentalModel = RentalModel;
