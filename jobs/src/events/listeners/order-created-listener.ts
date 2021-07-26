import {Listener, OrderCreatedEvent, Subjects} from '@yolanmq/common'
import {queueGroupName} from './queue-group-name'
import {Message} from "node-nats-streaming";
import {Job} from "../../models/job";
import {JobUpdatedPublisher} from "../publishers/job-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // Find the job that the order is reserving
        const job = await Job.findById(data.job.id);

        // If no job, throw error
        if (!job) throw new Error('Job not found');

        // Mark the job as being reserved by setting its orderId property
        job.set({orderId: data.id});

        // Save the job
        await job.save();
        await new JobUpdatedPublisher(this.client).publish({
            id: job.id,
            orderId: job.orderId,
            price: job.price,
            title: job.title,
            userId: job.userId,
            version: job.version
        })

        // ack the message
        msg.ack();
    }
}
