import { BookPreferenceType } from "../../DBTypes/BookTypes/bookTypes";



export interface PyUserType{ // not in DB, Py = Python
    id?: number;
    birthDate: Date;
    bookPreference: BookPreferenceType; // should we expand

}

