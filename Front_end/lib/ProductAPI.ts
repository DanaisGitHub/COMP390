import { ProductPreviewType, ProductDetailsType } from "@/types/API_Types/Book/BookApiTypes";

const baseURL = "http://localhost:2000/";

export const getRankedBooks = async (options: { lat?: number, lng?: number, searchQuery?: string, maxDistance: string, minRating: string, maxPrice: string }): Promise<ProductPreviewType[]> => {
    try {
        const lat = options.lat || 53.4808;
        const lng = options.lng || -2.2426;
        const searchQuery = options.searchQuery ? `searchQuery=${options.searchQuery}` : "";
        let response = await fetch(`${baseURL}productSearchPage/get-ranked-books?lat=${lat}&lng=${lng}&${searchQuery}maxDistance=${options.maxDistance}&minRating=${options.minRating}&maxPrice=${options.maxPrice}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',

            });
        let data = await response.json();
        console.log(`${baseURL}productSearchPage/get-ranked-books?lat=${lat}&lng=${lng}&searchQuery=${options.searchQuery}&maxDistance=${options.maxDistance}&minRating=${options.minRating}&maxPrice=${options.maxPrice}`);
        console.log(data);
        return data.message;
    }
    catch (err: any) {
        console.error(err);
        throw new Error("Error fetching data " + err.message);


    }
}

export const getFullBookDetails = async (options: { bookID: number, ownerID?: number }) => {
    try {
        let response = await fetch(`${baseURL}productSearchPage/get-full-book-details?bookID=${options.bookID}&ownerID=${options.ownerID}`, { method: 'GET' });
        const res = await response.json();
        const data: ProductDetailsType = res.message;
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
        let response = await fetch(`${baseURL}MyItemsPage/add-new-item-listing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userItems)
        });
        console.log(userItems);
        const res = await response.json();
        console.log(res);
    }
    catch (err: any) {
        console.error(err);
        throw new Error("Error fetching data " + err.message);
    }

}


export const getMyItems = async (userID: number): Promise<ProductPreviewType[]> => {
    try {
        let response = await fetch(`${baseURL}MyItemsPage/get-listed-items`, { method: 'GET' });
        const res = await response.json();
        console.log(res);
        return res.message;
    }
    catch (err: any) {
        console.error(err);
        throw new Error("Error fetching data " + err.message);
    }
}

