import express, {Request, Response} from 'express';
import {Job } from '../models/job';
import {NotFoundError} from "@yolanmq/common";

const router = express.Router();
router.get('/api/v1/jobs/:id', async (req: Request, res: Response) => {
    const job = await Job.findById(req.params.id);
    if(!job) throw new NotFoundError();
    res.send(job)
})

export { router as showJobRouter };
