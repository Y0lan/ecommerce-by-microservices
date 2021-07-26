import request from 'supertest'
import {Job} from "../../models/job";
import {app} from "../../app";
import generateID from "../../utils/generateID";

it('fetches the order', async () => {
    const job = Job.build({
        id: generateID(),
        title: 'job title',
        price: 585
    });
    await job.save()

    const user = global.login()
    const {body: order} = await request(app)
        .post('/api/v1/orders')
        .set('Cookie', user)
        .send({jobId: job.id})
        .expect(201)

    const {body: fetchedOrder} = await request(app)
        .get(`/api/v1/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)

    expect(fetchedOrder.id).toEqual(order.id)

})
it('returns an error if one user tries to fetch another users order', async () => {
    const job = Job.build({
        id: generateID(),
        title: 'job title',
        price: 585
    });
    await job.save()

    const user = global.login()
    const {body: order} = await request(app)
        .post('/api/v1/orders')
        .set('Cookie', user)
        .send({jobId: job.id})
        .expect(201)

    await request(app)
        .get(`/api/v1/orders/${order.id}`)
        .set('Cookie', global.login())
        .send()
        .expect(401)


})
