import request from 'supertest'
import generateID from '../../utils/generateID'
import {Job} from "../../models/job";
import {app} from "../../app";
import {Order} from "../../models/order";
import {OrderStatus} from "@yolanmq/common";
import {natsWrapper} from "../../nats-wrapper";

it('marks an order as cancelled', async () => {
    const job = Job.build({
        id: generateID(),
        title: 'ACDC concert',
        price: 459
    })
    const user = global.login()
    await job.save()
    const {body: order} = await request(app)
        .post('/api/v1/orders')
        .set('Cookie', user)
        .send({jobId: job.id})
        .expect(201)
    await request(app)
        .delete(`/api/v1/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})


it('emits a order cancelled event', async () => {
    const job = Job.build({
        id: generateID(),
        title: 'concert',
        price: 20,
    });
    await job.save();

    const user = global.login();
    // make a request to create an order
    const { body: order } = await request(app)
        .post('/api/v1/orders')
        .set('Cookie', user)
        .send({ jobId: job.id })
        .expect(201);

    // make a request to cancel the order
    await request(app)
        .delete(`/api/v1/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
