import { UserType } from "@/types/API_Types/User/UserApiTypes";
import cookies from 'js-cookie';


const API_URL = "http://localhost:2000/";

export const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: email, password }),
    });
    const data = await response.json();
    if (response.status >= 300 || response.status < 200) {
        throw data;
    }
    const token = data.result.accessToken;
    cookies.set('accessToken', token, { expires: 1 });
    cookies.set('id', data.result.id, { expires: 1 });

    return data;
}

export const signUp = async (user: UserType) => {
    try {
        const response = await fetch(`${API_URL}auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user }),
        });
        const data = await response.json();
        if (response.status >= 300 || response.status < 200) {
            throw data;
        }
        return data;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}


export const logoutCall = async () => {
    try {
        console.log(cookies.get('accessToken'));
        const response = await fetch(`${API_URL}auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get('accessToken')}`
            },
        });
        const data = await response.json();
        if (response.status >= 300 || response.status < 200) {
            throw data;
        }
        cookies.remove('accessToken');
        cookies.remove('id');
        return data;
    } catch (err: any) {
        console.log(err);
        throw err;
    }
}


export const checkAuth = () => {
    try {
        console.log(cookies.get('accessToken'));
        if (cookies.get('accessToken')) {
            return true;
        }
        return false;
    } catch (err: any) {
        console.log(err);

    }
}

