import express, {Request, Response} from 'express';
import {requireAuth, validateRequest} from '@yolanmq/common';
import {body} from 'express-validator';
import {Job} from '../models/job';
import {JobCreatedPublisher} from "../events/publishers/job-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();


router.post('/api/v1/jobs', requireAuth, [
        body('title').not().isEmpty().withMessage('title is required'),
        body('price').isFloat({gt: 0}).withMessage('price must be greater than 0'),
    //TODO description
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {title, price} = req.body;
        const job = Job.build({title,
            price,
            //TODO description
            userId: req.currentUser!.id});
        await job.save();
        await new JobCreatedPublisher(natsWrapper.client).publish({
            id: job.id,
            title: job.title,
            //TODO description
            price: job.price,
            userId: job.userId,
            version: job.version
        });
        res.status(201).send(job);
    })

export {router as createJobRouter}
