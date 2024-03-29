import express, {Request, Response} from "express";
import {requireAuth} from "@yolanmq/common";
import {Order} from "../models/order";

const router = express.Router()
router.get('/api/v1/orders',requireAuth, async (req: Request, res: Response) => {
    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate('job')
    res.send(orders)
})

export { router as indexOrderRouter };
