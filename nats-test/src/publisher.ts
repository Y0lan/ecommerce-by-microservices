import nats from 'node-nats-streaming'
import {TicketCreatedPublisher} from "./events/ticket-created-publisher";

console.clear()
console.log("push")

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
})

stan.on('connect', async () => {
    console.log("Publisher connected to NATS")
    const publisher = new TicketCreatedPublisher(stan)
    try {
        await publisher.publish({
            userId: "1",
            id: '123',
            title: 'concert',
            price: 20
        })
    } catch (err) {
        console.error(err)
    }

})
