import {Publisher, Subjects, TicketCreatedEvent} from '@yolanmq/common'
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}

