import { Message } from 'node-nats-streaming';
import { JobCreatedEvent } from '@yolanmq/common';
import { JobCreatedListener } from '../job-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Job } from '../../../models/job';
import generateID from "../../../utils/generateID";

const setup = async () => {
    // create an instance of the listener
    const listener = new JobCreatedListener(natsWrapper.client);

    // create a fake data event
    const data: JobCreatedEvent['data'] = {
        version: 0,
        id: generateID(),
        title: 'concert',
        price: 10,
        userId: generateID(),
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

it('creates and saves a job', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a job was created
    const job = await Job.findById(data.id);

    expect(job).toBeDefined();
    expect(job!.title).toEqual(data.title);
    expect(job!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { data, listener, msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});
