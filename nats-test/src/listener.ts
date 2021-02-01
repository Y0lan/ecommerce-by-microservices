import nats, {Message} from 'node-nats-streaming'
import {randomBytes} from "crypto";

console.clear()
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log('Listening for connections')

    stan.on('close', () => {
        console.log('NATS connection closed')
        process.exit()
    })

    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('accounting-service')
    const subscriptions = stan.subscribe(
        'ticket:created',
        'orders-service-queue-group',
        options)
    subscriptions.on('message', (msg: Message) => {
        const data = msg.getData();
        if (typeof data === 'string') {
            console.log(`received event #${msg.getSequence()}, with data ${data}`)
        }
        msg.ack()
    })
})


process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())
