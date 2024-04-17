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
                const {err, result:userItem} = await userItemModel.find({ where: { ownerID: rentalReq.ownerID, itemID: item.itemID }, rejectOnEmpty: true })
                const price = userItem.price * dayRented * item.quantity
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
            const sqlQuery = `SELECT r.orderNumber, r.RenterID, r.startDate, r.endDate
            FROM Rentals r JOIN RentalsDetails rd ON r.OrderNumber = rd.orderNumber
            WHERE r.ownerID = '${ownerID}' OR rd.ItemId = '${itemID}'
            AND (
            (r.startDate BETWEEN '${startDate}' AND '${endDate}') OR (r.endDate BETWEEN '${startDate}' AND '${endDate}')
                OR ('${startDate}' BETWEEN r.startDate AND r.endDate) OR ('${endDate}' BETWEEN r.startDate AND r.endDate)
            );`
            const [results, metadata] = await this.customQuery(sqlQuery);
            console.log(results)
            const clash = (results.length > 0) // true of false
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



