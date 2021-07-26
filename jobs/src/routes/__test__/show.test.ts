import request from 'supertest'
import {app} from '../../app'
import mongoose from "mongoose";
import {Job} from '../../models/job'
import generateID from "../../utils/generateID";

it('returns a 404 if the job is not found', async () => {
   await request(app)
       .get(`/api/v1/jobs/${generateID()}`)
       .send()
       .expect(404)
})

it('returns the job if the job is found', async()=> {
    const title = 'Solomun PARIS'
    const price = 20
    const response = await request(app)
        .post('/api/v1/jobs').set('Cookie', global.login())
        .send({
            title,
            price
        })
        .expect(201)
    const jobResponse = await request(app)
        .get(`/api/v1/jobs/${response.body.id}`)
        .expect(200)
    expect(jobResponse.body.title).toEqual(title)
    expect(jobResponse.body.price).toEqual(price)
})
