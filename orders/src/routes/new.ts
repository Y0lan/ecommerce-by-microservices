import mongoose from "mongoose";
import express, {Request, Response} from "express";
import {body} from 'express-validator'
import {requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError} from "@yolanmq/common";
import {Job} from '../models/job';
import {Order} from "../models/order";
import {natsWrapper} from "../nats-wrapper";
import {OrderCreatedPublisher} from "../events/publishers/order-created-publisher";

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 90;

router.post('/api/v1/orders',
    requireAuth,
    [
        body('jobId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('New order without valid job is forbidden')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {jobId} = req.body
        const job = await Job.findById(jobId)
        if(!job) throw new NotFoundError()
        const isReserved = await job.isReserved()
        if(isReserved) throw new BadRequestError('Job is already reserved')
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            job
        })
        await order.save()
        // Publish an event saying that an order was created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            version: order.version,
            job: {
                id: job.id,
                price: job.price,
            },
        });
        res.status(201).send(order)
    })

export {router as newOrderRouter};
