import express, {Request, Response} from 'express';
import {Ticket} from '../models/ticket';
import {body} from 'express-validator'
import {validateRequest, NotFoundError, requireAuth, NotAuthorizedError, BadRequestError} from "@yolanmq/common";
import {TicketUpdatedPublisher} from "../events/publishers/ticket-updated-publisher";
import {natsWrapper} from "../nats-wrapper";

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
        if(ticket.orderId) throw new BadRequestError('Can not edit a reserved ticket')
        if (ticket.userId != req.currentUser!.id) throw new NotAuthorizedError();
        const {title, price} = req.body;
        ticket.set({
            title,
            price
        })
        await ticket.save()
        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        })
        res.send(ticket)
    })

export {router as updateTicketRouter};
