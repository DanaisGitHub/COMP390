import { ProductPreviewType, ProductDetailsType } from "@/types/API_Types/Book/BookApiTypes";
import Cookies from "js-cookie";

const baseURL = "http://localhost:2000/";

export const getUserLocation = async (): Promise<{ lat: number, lng: number }> => {
    try {
        const accessToken = Cookies.get('accessToken');
        let response = await fetch(`${baseURL}productSearchPage/get-user-location`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }
        });
        const data = await response.json();
        if (response.status >= 300 || response.status < 200) {
            throw data;
        }
        return data;
    }
    catch (err: any) {
        console.error(err);
        throw new Error("Error fetching data " + err.message);
    }
}

export const getRankedBooks = async (options: { lat?: number, lng?: number, searchQuery?: string, maxDistance: string, minRating: string, maxPrice: string }): Promise<ProductPreviewType[]> => {
    try {
        const lat = options.lat || 53.4808;
        const lng = options.lng || -2.2426;
        const searchQuery = options.searchQuery ? `searchQuery=${options.searchQuery}` : "";
        const query = `${baseURL}productSearchPage/get-ranked-books?lat=${lat}&lng=${lng}&${searchQuery}&maxDistance=${options.maxDistance}&minRating=${options.minRating}&maxPrice=${options.maxPrice}`
        const accessToken = Cookies.get('accessToken');
        let response = await fetch(query,// has to be oneline
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
            });
        const data = await response.json();
        if (response.status >= 300 || response.status < 200) {
            throw data;
        }
        return data.message;
    }
    catch (err: any) {
        console.error(err);
        throw new Error("Error fetching data " + err.error);


    }
}

export const getFullBookDetails = async (options: { itemID: number, ownerID?: number }) => {
    try {
        let { itemID, ownerID } = options;
        ownerID = parseInt( Cookies.get('userID')!)
        const query = `${baseURL}productSearchPage/get-full-book-details?bookID=${itemID}&ownerID=${ownerID}`
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(query);
        const accessToken = Cookies.get('accessToken');
        let response = await fetch(query, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
        });
        const res = await response.json();
    
        const data: ProductDetailsType = res.message;
        console.log(res);
        return data;
    }
    catch (err: any) {
        console.error(err);
        throw new Error("Error fetching data " + err.message);
    }
}

export const postNewList = async (userItem: { itemID: number, ownerID: number, quantity: number, price: number }): Promise<void> => {
    try {
        const userItems = { userItem }
        userItems.userItem.ownerID = parseInt(Cookies.get('userID')!);
        const accessToken = Cookies.get('accessToken');
        let response = await fetch(`${baseURL}MyItemsPage/add-new-item-listing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify(userItems)
        });
        const data = await response.json();
        if (response.status >= 300 || response.status < 200) {
            throw data;
        }
    }
    catch (err: any) {
        console.error(err);
        throw new Error("Error fetching data " + err.message);
    }

}


export const getMyItems = async (): Promise<ProductPreviewType[]> => {
    try {
        const accessToken = Cookies.get('accessToken');
        let response = await fetch(`${baseURL}MyItemsPage/get-listed-items`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                }
            });
        const data = await response.json();
        if (response.status >= 300 || response.status < 200) {
            throw data;
        }
        return data.message;
    }
    catch (err: any) {
        console.error(err);
        throw new Error("Error fetching data " + err.message);
    }
}

