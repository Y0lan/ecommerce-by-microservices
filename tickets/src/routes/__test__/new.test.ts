import request from 'supertest'
import {app} from '../../app'
import {Ticket} from '../../models/ticket'
import {natsWrapper} from "../../nats-wrapper";

it('has a route handler listening to /api/v1/tickets for post requests', async () => {
    const response = await request(app)
        .post('/api/v1/tickets')
        .send({})
    expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
    await request(app)
        .post('/api/v1/tickets')
        .send({})
        .expect(401)
})
it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/v1/tickets')
        .set('Cookie', global.login())
        .send({})
    expect(response.status).not.toEqual(401)
})
it('returns an error if an invalid title is provided', async () => {
    // empty title
    await request(app)
        .post('/api/v1/tickets')
        .set('Cookie', global.login())
        .send({
            title: '',
            price: 10
        }).expect(400)
    // no title
    await request(app)
        .post('/api/v1/tickets')
        .set('Cookie', global.login())
        .send({
            price: 10
        }).expect(400)
})

it('returns an error if an invalid price is provided', async () => {
    // negative price
    await request(app)
        .post('/api/v1/tickets')
        .set('Cookie', global.login())
        .send({
            title: "valid title",
            price: -10
        }).expect(400)
    // no price
    await request(app)
        .post('/api/v1/tickets')
        .set('Cookie', global.login())
        .send({
            title: "valid title",
        }).expect(400)
})

it('creates a ticket with valid inputs', async () => {

    const title = "valid title"
    const price = 10


    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    await request(app)
        .post('/api/v1/tickets')
        .set('Cookie', global.login())
        .send({
            title,
            price
        })
        .expect(201)
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1)

    const ticketAdded = tickets[0];
    expect(ticketAdded.price).toEqual(price)
    expect(ticketAdded.title).toEqual(title)
})

it('publish an event', async () => {
    const title = "valid title"
    const price = 10

    await request(app)
        .post('/api/v1/tickets')
        .set('Cookie', global.login())
        .send({
            title,
            price
        })
        .expect(201)
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
