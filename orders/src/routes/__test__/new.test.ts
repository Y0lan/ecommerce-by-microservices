import request from 'supertest'
import generateID from "../../utils/generateID";
import {app} from '../../app'
import {Job} from "../../models/job";
import {Order} from "../../models/order";
import {OrderStatus} from "@yolanmq/common";
import {natsWrapper} from "../../nats-wrapper";

it('returns an error if the job does not exist', async () => {
    const jobId = generateID()
    await request(app)
        .post('/api/v1/orders')
        .set('Cookie', global.login())
        .send({jobId})
        .expect(404)
})
it('returns an error if the job is already reserved', async () => {
    const job = Job.build({
        id: generateID(),
        title: 'fake title',
        price: 25
    })
    await job.save()
    const order = Order.build({
        job,
        userId: generateID(),
        status: OrderStatus.Created,
        expiresAt: new Date()
    })
    await order.save()
    await request(app)
        .post('/api/v1/orders')
        .set('Cookie', global.login())
        .send({jobId: job.id})
        .expect(400)

})
it('reserves a job', async () => {
    const job = Job.build({
        id: generateID(),
        title: 'fake title',
        price: 25
    })
    await job.save()
    await request(app)
        .post('/api/v1/orders')
        .set('Cookie', global.login())
        .send({jobId: job.id})
        .expect(201)
})

it('emits an order created event', async () => {
    const job = Job.build({
        id: generateID(),
        title: 'concert',
        price: 20,
    });
    await job.save();

    await request(app)
        .post('/api/v1/orders')
        .set('Cookie', global.login())
        .send({ jobId: job.id })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

