import request from 'supertest'
import {app} from '../../app'
import generateID from '../../utils/generateID'
import {natsWrapper} from "../../nats-wrapper";
import {Job} from "../../models/job";

it('returns a 404 if the provided id does not exist', async () => {
    await request(app)
        .put(`/api/v1/jobs/${generateID()}`)
        .set('Cookie', global.login())
        .send({
            title: 'valid title',
            price: 10,
        })
        .expect(404)

})
it('returns a 401 if the user is not authenticated', async () => {
    await request(app)
        .put(`/api/v1/jobs/${generateID()}`)
        .send({
            title: 'valid title',
            price: 10,
        })
        .expect(401)
})
it('returns a 401 if the user does not own the job', async () => {
    const response = await request(app)
        .post('/api/v1/jobs')
        .set('Cookie', global.login())
        .send({
            title: 'valid title',
            price: 10
        })
    await request(app)
        .put(`/api/v1/jobs/${response.body.id}`)
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
        .post('/api/v1/jobs')
        .set('Cookie', cookie)
        .send({
            title: 'valid title',
            price: 10
        })
    await request(app)
        .put(`/api/v1/jobs/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',// invalid title
            price: 10 // valid price
        })
        .expect(400)
    await request(app)
        .put(`/api/v1/jobs/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'valid title',// valid title
            price: -19 // invalid price
        })
        .expect(400)
})
it('returns a 200 if the user is logged in, own the job and update with valid new values', async () => {
    const cookie = global.login()
    const title = 'updated valid title'
    const price = 39
    const response = await request(app)
        .post('/api/v1/jobs')
        .set('Cookie', cookie)
        .send({
            title: 'old valid title',
            price: 10
        })
    await request(app)
        .put(`/api/v1/jobs/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title,
            price
        })
        .expect(200)
    const jobResponse = await request(app)
        .get(`/api/v1/jobs/${response.body.id}`)
        .send()
    expect(jobResponse.body.title).toEqual(title)
    expect(jobResponse.body.price).toEqual(price)
})
it('publish an event', async () => {
    const cookie = global.login()
    const title = 'updated valid title'
    const price = 39
    const response = await request(app)
        .post('/api/v1/jobs')
        .set('Cookie', cookie)
        .send({
            title: 'old valid title',
            price: 10
        })
    await request(app)
        .put(`/api/v1/jobs/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title,
            price
        })
        .expect(200)
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})

it('rejects update if the job is reserved', async () => {
    const cookie = global.login()
    const title = 'valid title'
    const price = 45
    const response = await request(app)
        .post('/api/v1/jobs')
        .set('Cookie', cookie)
        .send({
            title: 'old valid title',
            price: 10
        })
    const job = await Job.findById(response.body.id)
    job!.set({orderId: generateID()})
    await job!.save()
    await request(app)
        .put(`/api/v1/jobs/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title,
            price
        })
        .expect(400)
})
