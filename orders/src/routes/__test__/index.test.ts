import request from 'supertest'
import {Job} from "../../models/job";
import {app} from "../../app";
import generateID from '../../utils/generateID'

const buildJob = async () => {
    const job = Job.build({
        id: generateID(),
        title: 'Metallica',
        price: 20
    })
    await job.save()
    return job
}


it('fetches orders for a particular user', async () => {
    const job1 = await buildJob()
    const job2 = await buildJob()
    const job3 = await buildJob()
    const user1 = global.login()
    const user2 = global.login()
    await request(app)
        .post('/api/v1/orders')
        .set('Cookie', user1)
        .send({jobId: job1.id})
        .expect(201)

    const {body: order1} = await request(app)
        .post('/api/v1/orders')
        .set('Cookie', user2)
        .send({jobId: job2.id})
        .expect(201)

    const {body: order2} = await request(app)
        .post('/api/v1/orders')
        .set('Cookie', user2)
        .send({jobId: job3.id})
        .expect(201)

    const response = await request(app)
        .get('/api/v1/orders')
        .set('Cookie', user2)
        .expect(200)

    expect(response.body.length).toEqual(2)
    expect(response.body[0].id).toEqual(order1.id)
    expect(response.body[1].id).toEqual(order2.id)
    expect(response.body[0].job.id).toEqual(job2.id)
    expect(response.body[1].job.id).toEqual(job3.id)
})
