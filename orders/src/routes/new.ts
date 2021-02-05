import mongoose from "mongoose";
import express, {Request, Response} from "express";
import {body} from 'express-validator'
import {requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError} from "@yolanmq/common";
import {Ticket} from '../models/ticket';
import {Order} from "../models/order";
import {natsWrapper} from "../nats-wrapper";
import {OrderCreatedPublisher} from "../events/publishers/order-created-publisher";

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/v1/orders',
    requireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('New order without valid ticket is forbidden')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {ticketId} = req.body
        const ticket = await Ticket.findById(ticketId)
        if(!ticket) throw new NotFoundError()
        const isReserved = await ticket.isReserved()
        if(isReserved) throw new BadRequestError('Ticket is already reserved')
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        })
        await order.save()
        // Publish an event saying that an order was created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            version: order.version,
            ticket: {
                id: ticket.id,
                price: ticket.price,
            },
        });
        res.status(201).send(order)
    })

export {router as newOrderRouter};
