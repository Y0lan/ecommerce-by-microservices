import {Listener, Subjects, ExpirationCompleteEvent, OrderStatus} from '@yolanmq/common';
import {Message} from 'node-nats-streaming';
import {queueGroupName} from './queue-group-name';
import {Order} from '../../models/order';
import {OrderCancelledPublisher} from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('job');

        if (!order) {
            throw new Error('Order not found');
        }

        if (order.status === OrderStatus.Completed) {
            console.log("Expiring an order that have been paid...")
            return msg.ack()
        }
        order.set({
            status: OrderStatus.Cancelled,
        });
        await order.save();
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            job: {
                id: order.job.id,
            },
        });

        msg.ack();
    }
}
