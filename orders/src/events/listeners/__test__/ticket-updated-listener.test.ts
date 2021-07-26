import { Message } from 'node-nats-streaming';
import { JobUpdatedEvent } from '@yolanmq/common';
import { JobUpdatedListener } from '../job-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Job } from '../../../models/job';
import generateID from "../../../utils/generateID";

const setup = async () => {
    // Create a listener
    const listener = new JobUpdatedListener(natsWrapper.client);

    // Create and save a job
    const job = Job.build({
        id: generateID(),
        title: 'concert',
        price: 20,
    });
    await job.save();

    // Create a fake data object
    const data: JobUpdatedEvent['data'] = {
        id: job.id,
        version: job.version + 1,
        title: 'new concert',
        price: 999,
        userId: 'ablskdjf',
    };

    // Create a fake msg object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    // return all of this stuff
    return { msg, data, job, listener };
};


it('finds, updates, and saves a job', async () => {
    const { msg, data, job, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedJob = await Job.findById(job.id);

    expect(updatedJob!.title).toEqual(data.title);
    expect(updatedJob!.price).toEqual(data.price);
    expect(updatedJob!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { msg, data, listener } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const { msg, data, listener} = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (err) {}

    expect(msg.ack).not.toHaveBeenCalled();
});
