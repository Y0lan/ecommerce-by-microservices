import { Message } from 'node-nats-streaming';
import { Subjects, Listener, JobCreatedEvent } from '@yolanmq/common';
import { Job } from '../../models/job';
import { queueGroupName } from './queue-group-name';

export class JobCreatedListener extends Listener<JobCreatedEvent> {
    subject: Subjects.JobCreated = Subjects.JobCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: JobCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;

        const job = Job.build({
            id,
            title,
            price,
        });
        await job.save();

        msg.ack();
    }
}
