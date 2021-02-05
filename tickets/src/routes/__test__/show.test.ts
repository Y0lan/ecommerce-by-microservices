import request from 'supertest'
import {app} from '../../app'
import mongoose from "mongoose";
import {Ticket} from '../../models/ticket'
import generateID from "../../utils/generateID";

it('returns a 404 if the ticket is not found', async () => {
   await request(app)
       .get(`/api/v1/tickets/${generateID()}`)
       .send()
       .expect(404)
})

it('returns the ticket if the ticket is found', async()=> {
    const title = 'Solomun PARIS'
    const price = 20
    const response = await request(app)
        .post('/api/v1/tickets').set('Cookie', global.login())
        .send({
            title,
            price
        })
        .expect(201)
    const ticketResponse = await request(app)
        .get(`/api/v1/tickets/${response.body.id}`)
        .expect(200)
    expect(ticketResponse.body.title).toEqual(title)
    expect(ticketResponse.body.price).toEqual(price)
})
