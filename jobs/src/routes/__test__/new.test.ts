import request from 'supertest'
import {app} from '../../app'
import {Job} from '../../models/job'
import {natsWrapper} from "../../nats-wrapper";

it('has a route handler listening to /api/v1/jobs for post requests', async () => {
    const response = await request(app)
        .post('/api/v1/jobs')
        .send({})
    expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
    await request(app)
        .post('/api/v1/jobs')
        .send({})
        .expect(401)
})
it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/v1/jobs')
        .set('Cookie', global.login())
        .send({})
    expect(response.status).not.toEqual(401)
})
it('returns an error if an invalid title is provided', async () => {
    // empty title
    await request(app)
        .post('/api/v1/jobs')
        .set('Cookie', global.login())
        .send({
            title: '',
            price: 10
        }).expect(400)
    // no title
    await request(app)
        .post('/api/v1/jobs')
        .set('Cookie', global.login())
        .send({
            price: 10
        }).expect(400)
})

it('returns an error if an invalid price is provided', async () => {
    // negative price
    await request(app)
        .post('/api/v1/jobs')
        .set('Cookie', global.login())
        .send({
            title: "valid title",
            price: -10
        }).expect(400)
    // no price
    await request(app)
        .post('/api/v1/jobs')
        .set('Cookie', global.login())
        .send({
            title: "valid title",
        }).expect(400)
})

it('creates a job with valid inputs', async () => {

    const title = "valid title"
    const price = 10


    let jobs = await Job.find({});
    expect(jobs.length).toEqual(0);
    await request(app)
        .post('/api/v1/jobs')
        .set('Cookie', global.login())
        .send({
            title,
            price
        })
        .expect(201)
    jobs = await Job.find({});
    expect(jobs.length).toEqual(1)

    const jobAdded = jobs[0];
    expect(jobAdded.price).toEqual(price)
    expect(jobAdded.title).toEqual(title)
})

it('publish an event', async () => {
    const title = "valid title"
    const price = 10

    await request(app)
        .post('/api/v1/jobs')
        .set('Cookie', global.login())
        .send({
            title,
            price
        })
        .expect(201)
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
