import request from 'supertest'
import {app} from '../../app'
import generateID from '../../utils/generateID'
import {natsWrapper} from "../../nats-wrapper";
import {Ticket} from "../../models/ticket";

it('returns a 404 if the provided id does not exist', async () => {
    await request(app)
        .put(`/api/v1/tickets/${generateID()}`)
        .set('Cookie', global.login())
        .send({
            title: 'valid title',
            price: 10,
        })
        .expect(404)

})
it('returns a 401 if the user is not authenticated', async () => {
    await request(app)
        .put(`/api/v1/tickets/${generateID()}`)
        .send({
            title: 'valid title',
            price: 10,
        })
        .expect(401)
})
it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/v1/tickets')
        .set('Cookie', global.login())
        .send({
            title: 'valid title',
            price: 10
        })
    await request(app)
        .put(`/api/v1/tickets/${response.body.id}`)
        .set('Cookie', global.login())
        .send({
            title: 'some new random title',
            price: 293
        })
        .expect(401)

})
it('returns a 400 if the user provides an invalid title or price ', async () => {
    const cookie = global.login()
    const response = await request(app)
        .post('/api/v1/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'valid title',
            price: 10
        })
    await request(app)
        .put(`/api/v1/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',// invalid title
            price: 10 // valid price
        })
        .expect(400)
    await request(app)
        .put(`/api/v1/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'valid title',// valid title
            price: -19 // invalid price
        })
        .expect(400)
})
it('returns a 200 if the user is logged in, own the ticket and update with valid new values', async () => {
    const cookie = global.login()
    const title = 'updated valid title'
    const price = 39
    const response = await request(app)
        .post('/api/v1/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'old valid title',
            price: 10
        })
    await request(app)
        .put(`/api/v1/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title,
            price
        })
        .expect(200)
    const ticketResponse = await request(app)
        .get(`/api/v1/tickets/${response.body.id}`)
        .send()
    expect(ticketResponse.body.title).toEqual(title)
    expect(ticketResponse.body.price).toEqual(price)
})
it('publish an event', async () => {
    const cookie = global.login()
    const title = 'updated valid title'
    const price = 39
    const response = await request(app)
        .post('/api/v1/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'old valid title',
            price: 10
        })
    await request(app)
        .put(`/api/v1/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title,
            price
        })
        .expect(200)
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})

it('rejects update if the ticket is reserved', async () => {
    const cookie = global.login()
    const title = 'valid title'
    const price = 45
    const response = await request(app)
        .post('/api/v1/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'old valid title',
            price: 10
        })
    const ticket = await Ticket.findById(response.body.id)
    ticket!.set({orderId: generateID()})
    await ticket!.save()
    await request(app)
        .put(`/api/v1/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title,
            price
        })
        .expect(400)
})
