import {OrderCreatedEvent, OrderStatus} from '@yolanmq/common'
import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Job} from "../../../models/job";
import generateID from "../../../utils/generateID";
import {Message} from "node-nats-streaming";



const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create and save a job
    const job = Job.build({
        title: 'concert',
        price: 99,
        userId: 'asdf',
    });
    await job.save();

    // Create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: generateID(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'alskdfj',
        expiresAt: 'alskdjf',
        job: {
            id: job.id,
            price: job.price,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, job, data, msg };
};

it('sets the orderId of the job', async () => {
    const { listener, job, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedJob = await Job.findById(job.id);

    expect(updatedJob!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, job, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a job updated event', async () => {
    const { listener, job, data, msg } = await setup();
    await listener.onMessage(data,msg)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    const jobUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(data.id).toEqual(jobUpdatedData.orderId)

})
