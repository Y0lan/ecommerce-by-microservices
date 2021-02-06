import { Subjects, Publisher, PaymentCreatedEvent } from '@yolanmq/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
