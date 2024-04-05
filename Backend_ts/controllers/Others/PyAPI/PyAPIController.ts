import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';

import { PyUserType } from '../../../types/API_Types/Python/pyAPI';
import { BookPreferenceType } from '../../../types/DBTypes/BookTypes/bookTypes';
import { BookItemType } from '../../../types/DBTypes/BookTypes/bookTypes';
import { TempUserType } from '../../../types/DBTypes/UserTypes/userTypes';

import { UserModel } from '../../../models/typesOfModels/Users/userModels';
import { BookItemModel } from '../../../models/typesOfModels/Items/BookModels/bookModel';
import { BookPreferenceModel } from '../../../models/typesOfModels/Items/BookModels/bookModel';



export default class PyAPIController {

    public getAllUserData = async (req: Req, res: Res, next: Next): Promise<PyUserType[]> => {
        try {
            let pyUsers: PyUserType[] = [];
            const userModel: UserModel = new UserModel();
            const bookPreferenceModel: BookPreferenceModel = new BookPreferenceModel();
            const { err, result: users } = await userModel.getAll();
            if (err) throw new Error(err);
            console.log(users);
            for (let user of users) {
                let {err, result:bookPref} = await bookPreferenceModel.getBookPreference(user.id);
                let pyUser: PyUserType = {
                    id: user.id,
                    birthDate: user.birthDate,
                    bookPreference: bookPref
                }
                pyUsers.push(pyUser);
            }

            return pyUsers;

        } catch (err: any) {
            throw new Error(err);
        }
    }

    public getAllBookData = async (req: Req, res: Res, next: Next) => {
        try {

        } catch (err) {

        }
    }
}