import request from 'supertest'
import {Ticket} from "../../models/ticket";
import {app} from "../../app";
import generateID from "../../utils/generateID";

it('fetches the order', async () => {
    const ticket = Ticket.build({
        id: generateID(),
        title: 'ticket title',
        price: 585
    });
    await ticket.save()

    const user = global.login()
    const {body: order} = await request(app)
        .post('/api/v1/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201)

    const {body: fetchedOrder} = await request(app)
        .get(`/api/v1/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)

    expect(fetchedOrder.id).toEqual(order.id)

})
it('returns an error if one user tries to fetch another users order', async () => {
    const ticket = Ticket.build({
        id: generateID(),
        title: 'ticket title',
        price: 585
    });
    await ticket.save()

    const user = global.login()
    const {body: order} = await request(app)
        .post('/api/v1/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201)

    await request(app)
        .get(`/api/v1/orders/${order.id}`)
        .set('Cookie', global.login())
        .send()
        .expect(401)


})
