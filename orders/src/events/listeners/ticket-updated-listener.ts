import { Message } from 'node-nats-streaming';
import { Subjects, Listener, JobUpdatedEvent } from '@yolanmq/common';
import { Job } from '../../models/job';
import { queueGroupName } from './queue-group-name';

export class JobUpdatedListener extends Listener<JobUpdatedEvent> {
    subject: Subjects.JobUpdated = Subjects.JobUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: JobUpdatedEvent['data'], msg: Message) {
        const job = await Job.findByEvent(data);

        if (!job) {
            throw new Error('Job not found');
        }

        const { title, price } = data;
        job.set({ title, price });
        await job.save();

        msg.ack();
    }
}
