import axios from 'axios';

const pythonAPI = 'http://127.0.0.1:5000/';

export const get = async (url: string) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err:any) {
        console.error(err);
        throw new Error(`Error in get ${err.message}`)
    }
};

export const post = async (url: string, data: any) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (err:any) {
        console.error(err);
        throw new Error(`Error in post ${err.message}`)
    }
};

export default async function getRankedBooks(userID: string, bookIDs: string[]): Promise<string[]> {
    try {
        const data = {
            user_id: userID,
            movie_titles: bookIDs
        }
        const url = `${pythonAPI}`;
        return await post(url, data) as string[];
    }
    catch (err:any) {
        console.error(err);
        throw new Error(`Error in getting PYTHON  ${err.message}`)

    }
}

