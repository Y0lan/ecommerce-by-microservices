import {natsWrapper} from "../../../nats-wrapper";
import {Job} from "../../../models/job";
import {OrderCancelledEvent} from "@yolanmq/common";
import generateID from "../../../utils/generateID";
import {Message} from "node-nats-streaming";
import {OrderCancelledListener} from "../order-cancelled-listener";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    // Create and save a job
    const job = Job.build({
        title: 'concert',
        price: 99,
        userId: generateID(),
    });
    job.set({orderId: generateID()})
    await job.save();

    // Create the fake data event
    const data: OrderCancelledEvent['data'] = {
        id: generateID(),
        version: 0,
        job: {
            id: job.id,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, job, data, msg};
};

it('updates the job, publishes an event, and acks the message', async () => {
    const { msg, listener, job , data} = await setup()
    await listener.onMessage(data, msg)
    const updatedJob = await Job.findById(job.id);
    expect(updatedJob!.orderId).not.toBeDefined()
    expect(msg.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
