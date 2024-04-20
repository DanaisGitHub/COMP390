import { ProductPreviewType } from "@/types/API_Types/Book/BookApiTypes";
import { BasicUserType, FullUser, UptUserType } from "@/types/API_Types/User/UserApiTypes";
import Cookies from 'js-cookie';

const baseURL = 'http://localhost:2000/';

export const getUserItems = async (userID: number): Promise<ProductPreviewType[]> => {
    try {
        const accessToken = Cookies.get('accessToken')
        const response = await fetch(`${baseURL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }
        );
        const data = await response.json();
        if (response.status >= 300 || response.status < 200) {
            throw data
        }
        return data.message as ProductPreviewType[];
    } catch (err: any) {
        console.error(err)
        throw new Error(err)
    }
}


export const getUserDetails = async (userID: number): Promise<BasicUserType> => {
    try {
        const accessToken = Cookies.get('accessToken')
        userID = 15;
        const response = await fetch(`${baseURL}userProfilePage/get-basic-user-details`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken

            }
        }
        );

        const data = await response.json()
        if (response.status >= 300 || response.status < 200) {
            throw data
        }
        return data.message as BasicUserType;

    } catch (err: any) {
        console.error(err)
        throw new Error(err)
    }
}

export const updateUserDetails = async (userDetails: UptUserType) => {
    try {
        const accessToken = Cookies.get('accessToken')
        const userDetailss = { userDetails }
        console.log(userDetailss)
        const response = await fetch(`${baseURL}userProfilePage/change-user-details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify(userDetailss)
        }
        );
        const data = await response.json()
        if (response.status >= 300 || response.status < 200) {
            throw data
        }
        console.log(data)
        return data;

    } catch (err: any) {
        console.error(err)
        throw new Error(err)
    }
}

