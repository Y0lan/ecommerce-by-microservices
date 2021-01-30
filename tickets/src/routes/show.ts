import express, {Request, Response} from 'express';
import {Ticket } from '../models/ticket';
import {NotFoundError} from "@yolanmq/common";

const router = express.Router();
router.get('/api/v1/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket) throw new NotFoundError();
    res.send(ticket)
})

export { router as showTicketRouter };
