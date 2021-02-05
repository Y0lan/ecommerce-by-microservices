import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCancelledEvent} from "@yolanmq/common";
import generateID from "../../../utils/generateID";
import {Message} from "node-nats-streaming";
import {OrderCancelledListener} from "../order-cancelled-listener";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: generateID(),
    });
    ticket.set({orderId: generateID()})
    await ticket.save();

    // Create the fake data event
    const data: OrderCancelledEvent['data'] = {
        id: generateID(),
        version: 0,
        ticket: {
            id: ticket.id,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, ticket, data, msg};
};

it('updates the ticket, publishes an event, and acks the message', async () => {
    const { msg, listener, ticket , data} = await setup()
    await listener.onMessage(data, msg)
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined()
    expect(msg.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
