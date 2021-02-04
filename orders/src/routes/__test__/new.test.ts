import request from 'supertest'
import generateID from "../../utils/generateID";
import {app} from '../../app'
import {Ticket} from "../../models/ticket";
import {Order} from "../../models/order";
import {OrderStatus} from "@yolanmq/common";

it('returns an error if the ticket does not exist', async () => {
    const ticketId = generateID()
    await request(app)
        .post('/api/v1/orders')
        .set('Cookie', global.login())
        .send({ticketId})
        .expect(404)
})
it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        title: 'fake title',
        price: 25
    })
    await ticket.save()
    const order = Order.build({
        ticket,
        userId: generateID(),
        status: OrderStatus.Created,
        expiresAt: new Date()
    })
    await order.save()
    await request(app)
        .post('/api/v1/orders')
        .set('Cookie', global.login())
        .send({ticketId: ticket.id})
        .expect(400)

})
it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        title: 'fake title',
        price: 25
    })
    await ticket.save()
    await request(app)
        .post('/api/v1/orders')
        .set('Cookie', global.login())
        .send({ticketId: ticket.id})
        .expect(201)
})

it.todo('emit a created order event')
