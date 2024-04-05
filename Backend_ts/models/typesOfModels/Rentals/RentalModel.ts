import { RentalDetailType, RentalType } from "../../../types/DBTypes/RentalTypes/rentalType";
import { randomNumber } from "../../../utils/other/random";
import { Rental, RentalsDetail } from "../../DB_Functions/Set_Up/modelSetUp";
import { BaseModel } from "../baseModel";
import { RentalOrderType, RentalItemType, FullRentalPurchaseRequest } from "../../../types/API_Types/Rental/RentalAPITypes";


export class RentalModel extends BaseModel<Rental> { // BookItem should really extend itemModel, and item 
    public constructor() {
        super(Rental)
    }
    private rentalDetailModel = new RentalDetailsModel()

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

    public async addOrderWithItems(rentalReq:FullRentalPurchaseRequest): Promise<RentalType> {
        try {
            const { rentalItems } = rentalReq
            const order = await this.addOrderItem(rentalReq)
            const orderNumber = order.orderNumber as number
            let rentalItem: RentalItemType;
            for (const item of rentalItems) {
                rentalItem = { ...item, orderNumber }
                await this.rentalDetailModel.addItemToOrder(rentalItem)
            }
            return order
        } catch (err: any) {
            console.error(err)
            throw new Error("Error in addOrderWithMultipleItems")
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
            const sqlQuery = `SELECT r.RentalID, r.RenterID, r.startDate, r.endDate
            FROM Rentals r JOIN Rental Details rd ON r.OrderNumber = rd.orderNumber
            WHERE r.ownerID = '${ownerID}' AND rd.ItemsId = '${itemID}'
            AND (
            (r.startDate BETWEEN '${startDate}' AND '${endDate}') OR (r.endDate BETWEEN '${startDate}' AND '${endDate}')
                OR ('${startDate}' BETWEEN r.startDate AND r.endDate) OR ('${endDate}' BETWEEN r.startDate AND r.endDate)
            );`
            const query = await this.customQuery(sqlQuery);
            const clash = (query.length > 0) // true of false
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


export class RentalDetailsModel extends BaseModel<RentalsDetail> { // BookItem should really extend itemModel, and item 
    public constructor() {
        super(RentalsDetail)
    }
    private rentalModel = new RentalModel()

    public async addItemToOrder(items: RentalItemType): Promise<RentalsDetail> {
        try {
            const { err, result } = await this.baseCreate(items as RentalDetailType)
            if (err) throw new Error(err)

            // find seller a decrease quantity
            return result
        } catch (err) {
            console.log(err)
            throw new Error("Error in addOrderItem")
        }
    }


}