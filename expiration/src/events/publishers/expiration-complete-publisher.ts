import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@yolanmq/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
