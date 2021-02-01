import {TicketCreatedEvent, Subjects, Publisher} from '@yolanmq/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated
}
