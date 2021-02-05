
import { Publisher, OrderCreatedEvent, Subjects } from '@yolanmq/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
