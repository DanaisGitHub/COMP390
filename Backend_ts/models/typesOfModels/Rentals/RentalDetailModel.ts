import { RentalItemType } from "../../../types/API_Types/Rental/RentalAPITypes"
import { RentalDetailType } from "../../../types/DBTypes/RentalTypes/rentalType"
import { RentalsDetail } from "../../DB_Functions/Set_Up/modelSetUp"
import { BaseModel } from "../baseModel"
import { RentalModel } from "./RentalModel"

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