import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';
import PyAPIController from '../../controllers/Others/PyAPI/PyAPIController';
const router = Router();


router.get('/all-users-data', async (req: Req, res: Res, next: Next) => {
    try {
        const pyAPIController: PyAPIController = new PyAPIController();
        const data = await pyAPIController.getAllUserData(req, res, next);
        res.status(200).json({ message: "This is the data from the python API", data: data })
    } catch (err) {
        res.status(500).json({ message: "There was an error", err: err })
    }
});

router.get('/all-book-data', (req: Req, res: Res, next: Next) => {
    try {
        res.status(200).json({ message: "This is the data from the python API" })
    } catch (err) {
        res.status(500).json({ message: "There was an error", err: err })
    }
});











export default router;