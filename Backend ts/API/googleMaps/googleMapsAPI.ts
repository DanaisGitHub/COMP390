import { Router, Request as Req, Response as Res, NextFunction as Next } from 'express';

import FoodClass  from '../../controllers/usdaApi/usdaApi';

const router = Router();

const errorHandler = (err: any, req: Req, res: any, next: any) => {
    console.log("There was an error", err)
    if (err) {
        res.json({ message: "There was a fatal an error", error: err })
    }
}

// should be using contoller alot better than this
router.post('/getFoodOptions', async (req: Req, res: Res, next: Next) => { //works!!!!!!!!
    try {
        const food:string = req.body.food;
        console.log(food)
        const foodClass = new FoodClass();
        if (food === undefined) {
            res.status(400).json({err:"food is undefined",result:null})
            return;
        }
        const theFoodChoices = await foodClass.getFoodChoices(food);
        res.status(200).json({ err: false, result: theFoodChoices});
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err, result: null })
    }
})

router.post('/foodData', async (req: Req, res: Res, next: Next) => { //works
    try {
        const food:string = req.body.food;
        const quantity:number = req.body.quantity;// how many grams
        const foodChoice:number = req.body.foodChoice;// number between 1-5

        const foodClass = new FoodClass();

        const theFoodChoices = await foodClass.getFood(food, quantity, foodChoice);

        // now need to multiply the food choices by the quantity and then add into database

        const multiplier = quantity / 100;

        let foodData = {
            calories: theFoodChoices.calories * multiplier,
            sugar: theFoodChoices.sugar * multiplier,
            carbohydrates: theFoodChoices.carbs * multiplier,
            fat: theFoodChoices.fat * multiplier,
            protein: theFoodChoices.protein * multiplier,
            fiber: theFoodChoices.fiber * multiplier,
            quantity: quantity,
        }

        res.status(200).json({ err: false, result: foodData}); 

    } catch (err:any) {
        console.log(err)
        res.status(500).json({ err: err, result: null })
    }
})

router.use(errorHandler);

export default router;