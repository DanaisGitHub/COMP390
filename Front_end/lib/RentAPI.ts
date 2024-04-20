import { RentalOrderType, RentalItemType } from "@/types/API_Types/Rental/RentalAPITypes";
import Cookies from "js-cookie";

const baseURL = "http://localhost:2000/";

export const getPriceAndQuantity = async (options: { itemID: number, ownerID: number }) => {
    try {
        const accessToken = Cookies.get('accessToken')
        const { itemID, ownerID } = options
        const response = await fetch(`${baseURL}rental/getPrice&Quantity?itemID=${itemID}&ownerID=${ownerID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }
        })
        const data = await response.json()
        if (response.status >= 300 || response.status < 200) {
            throw data
        }
        return data.message
    } catch (err: any) {
        console.error(err)
        throw new Error("Error in getPriceAndQuantity " + err.message)
    }
}

export const postRentalOrder = async (rentalOrder: RentalOrderType, rentalItems: RentalItemType[]) => {
    try {
        const accessToken = Cookies.get('accessToken')
        const id = Cookies.get('id')
        rentalOrder.renterID = parseInt(id!)
        const purchaseRequest = {
            ...rentalOrder,
            rentalItems
        }
        console.log(JSON.stringify(purchaseRequest))
        console.log(`${baseURL}rental/purchase-request`)

        const response = await fetch(`${baseURL}rental/purchase-request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify(purchaseRequest)
        })
        const data = await response.json()
        if (response.status >= 300 || response.status < 200) {
            throw data
        }
        return data.message
    } catch (err: any) {
        console.error(err)
        throw new Error("Error in postRentalOrder " + err.message)
    }
}

// {
//     "purchaseRequest": {
//         "ownerID": 8,
//         "renterID": 1,
//         "startDate": "04/04/2024",
//         "endDate": "04/05/2024",
//         "rentalItems": [
//             {
//                 "itemID": 19,
//                 "quantity": 1
//             }
//         ]
//     }
// }