import express, {Request, Response} from "express";
import {requireAuth, NotFoundError, NotAuthorizedError} from '@yolanmq/common'
import {Order} from "../models/order";

const router = express.Router()
router.get('/api/v1/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('job')
    if(!order) throw new NotFoundError()
    if(order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
    res.send(order)
})

export { router as showOrderRouter };
