import express, {Request, Response} from 'express';
import {Ticket} from '../models/ticket';
import {body} from 'express-validator'
import {validateRequest, NotFoundError, requireAuth, NotAuthorizedError} from "@yolanmq/common";

const router = express.Router()
router.put('/api/v1/tickets/:id',
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
        const ticket = await Ticket.findById(req.params.id)
        if (!ticket) throw new NotFoundError();
        if (ticket.userId != req.currentUser!.id) throw new NotAuthorizedError();
        const {title, price} = req.body;
        ticket.set({
            title,
            price
        })
        await ticket.save()
        res.send(ticket)
    })

export {router as updateTicketRouter};
