import express, {Request, Response} from 'express';
import {Job} from '../models/job'

const router = express.Router();

router.get('/api/v1/jobs', async(req: Request, res: Response) => {
    const jobs = await Job.find({
        orderId: undefined
    });
    res.send(jobs)
})

export { router as indexJobRouter};
