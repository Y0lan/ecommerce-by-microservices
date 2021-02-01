import Listener from "../../../common/src/events/base-listener";
import {Message} from "node-nats-streaming";
import {TicketCreatedEvent, Subjects} from '@yolanmq/common'

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = 'payments-service';
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log(`Event data!`, data)
        console.log(data.id)
        console.log(data.title)
        console.log(data.price)
        msg.ack()
    }
}

export default TicketCreatedListener;
