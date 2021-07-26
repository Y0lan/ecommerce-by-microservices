import {Listener, OrderCancelledEvent, Subjects} from "@yolanmq/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from './queue-group-name'
import {Job} from "../../models/job";
import {JobUpdatedPublisher} from "../publishers/job-updated-publisher";
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const job = await Job.findById(data.job.id)
        if(!job) throw new Error('Job not found')
        job.set({orderId: undefined})
        await job.save()
        await new JobUpdatedPublisher(this.client).publish({
            id: job.id,
            orderId: job.orderId,
            userId: job.userId,
            price: job.price,
            title: job.title,
            version: job.version,
        })
        msg.ack()
    }
}
