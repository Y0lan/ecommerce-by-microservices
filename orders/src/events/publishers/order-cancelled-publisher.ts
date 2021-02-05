import { Subjects, Publisher, OrderCancelledEvent } from '@yolanmq/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
