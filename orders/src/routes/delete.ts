import express, {Request, Response} from "express";
import {NotAuthorizedError, NotFoundError, OrderStatus, requireAuth} from "@yolanmq/common";
import {Order} from "../models/order";
import {natsWrapper} from "../nats-wrapper";
import {OrderCancelledPublisher} from "../events/publishers/order-cancelled-publisher";


console.log("push")

const router = express.Router()
router.delete('/api/v1/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const {orderId} = req.params;
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
    order.status = OrderStatus.Cancelled;
    await order.save()
    // publishing an event saying this was cancelled!
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id,
        },
    });
    res.status(204).send(order);
})

export {router as deleteOrderRouter};
