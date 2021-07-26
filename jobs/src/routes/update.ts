import express, {Request, Response} from 'express';
import {Job} from '../models/job';
import {body} from 'express-validator'
import {validateRequest, NotFoundError, requireAuth, NotAuthorizedError, BadRequestError} from "@yolanmq/common";
import {JobUpdatedPublisher} from "../events/publishers/job-updated-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router()
router.put('/api/v1/jobs/:id',
    requireAuth,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('a title is required'),
        body('price')
            .isFloat({gt: 0})
            .withMessage('a positive amount for price is required')
    ],
    validateRequest, async (req: Request, res: Response) => {
        const job = await Job.findById(req.params.id)
        if (!job) throw new NotFoundError();
        if(job.orderId) throw new BadRequestError('Can not edit a reserved job')
        if (job.userId != req.currentUser!.id) throw new NotAuthorizedError();
        const {title, price} = req.body;
        job.set({
            title,
            price
        })
        await job.save()
        await new JobUpdatedPublisher(natsWrapper.client).publish({
            id: job.id,
            title: job.title,
            price: job.price,
            userId: job.userId,
            version: job.version
        })
        res.send(job)
    })

export {router as updateJobRouter};
