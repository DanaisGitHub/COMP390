import { RentalDetailType, RentalType } from "../../../types/DBTypes/RentalTypes/rentalType";
import { randomNumber } from "../../../utils/other/random";
import { Rental, RentalsDetail } from "../../DB_Functions/Set_Up/modelSetUp";
import { BaseModel } from "../baseModel";
import { RentalOrderType, RentalItemType, FullRentalPurchaseRequest } from "../../../types/API_Types/Rental/RentalAPITypes";
import { RentalDetailsModel } from "./RentalDetailModel";
import { UserItemModel } from "../Items/UserItemModel";


export class RentalModel extends BaseModel<Rental> { // BookItem should really extend itemModel, and item 
    public constructor() {
        super(Rental)
    }

    public async addOrderItem(details: RentalOrderType): Promise<RentalType> {
        try {
            const itemDetails: RentalOrderType = details
            const { err, result: user } = await this.baseCreate(itemDetails)
            if (err) throw new Error(err)
            return user
        } catch (err: any) {
            console.error(err)
            throw new Error("Error in addOrderItem ---->" + err.message)
        }
    }

    public async addOrderWithItems(rentalReq: FullRentalPurchaseRequest): Promise<RentalType> {
        try {
            const userItemModel = new UserItemModel()
            const rentalDetailModel = new RentalDetailsModel()
            const { rentalItems } = rentalReq
            const order: RentalType = await this.addOrderItem(rentalReq)
            const orderNumber = order.orderNumber as number

            let rentalItem: RentalItemType;
            const dayRented = order.endDate.getDate() - order.startDate.getDate()
            for (const item of rentalItems) {
                const { err, result: userItem } = await userItemModel.find({ where: { ownerID: rentalReq.ownerID, itemID: item.itemID }, rejectOnEmpty: true })
                let price = userItem.price * dayRented * item.quantity
                price = price < 0 ? price * -1 : price;
                rentalItem = { ...item, orderNumber, price }
                await rentalDetailModel.addItemToOrder(rentalItem)
            }
            return order
        } catch (err: any) {
            console.error(err)
            throw new Error("Error in addOrderWithItems" + err.message)
        }

    }


    public async getAllRentalDetails(orderNumber: number): Promise<FullRentalDetails> {
        try {
            const result = await this.baseFindOneNotTyped<FullRentalDetails>({ where: { orderNumber }, include: [RentalsDetail], rejectOnEmpty: false })
            return result
        } catch (err: any) {
            console.error(err)
            throw new Error("Error in getAllRentalDetails ---->" + err.message)
        }

    }

    public async checkIfUserItemDatesClash(options: { ownerID: number, itemID: number, startDate: Date, endDate: Date }) {
        try {
            const { ownerID, itemID, startDate, endDate } = options
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
            );`
            const [results, metadata] = await this.customQuery(sqlQuery);
            console.log(`results !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
            console.log(results)
            const clash = (results.length > 1) // true of false
            return clash
        }
        catch (err: any) {
            console.error(err)
            throw new Error("Error in checkIfUserItemDatesClash ---->" + err.message)
        }
    }

    //
    // public async getRentalDatesFromOwnerAndItemID(letterID: number, itemID: number): Promise<{ startDate: Date, endDate: Date }> {
    //     try {
    //         const { err, result } = await this.baseFindAll({ where: { letterID } }) // better to use complex query
    //         if (err) throw new Error(err)
    //         return { startDate: result.startDate, endDate: result.endDate }
    //     } catch (err) {
    //         console.error(err)
    //         throw new Error("Error in getRentalDatesFromOwnerAndItemID")
    //     }
    // }
}

type FullRentalDetails = RentalType & { rentalDetails: RentalDetailType[] } // ngl not sure



