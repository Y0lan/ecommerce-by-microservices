import {Publisher, Subjects, TicketUpdatedEvent} from '@yolanmq/common'
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}

