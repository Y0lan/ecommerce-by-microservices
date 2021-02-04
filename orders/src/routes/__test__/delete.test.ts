import request from 'supertest'
import {Ticket} from "../../models/ticket";
import {app} from "../../app";
import {Order} from "../../models/order";
import {OrderStatus} from "@yolanmq/common";

it('marks an order as cancelled', async () => {
    const ticket = Ticket.build({
        title: 'ACDC concert',
        price: 459
    })
    const user = global.login()
    await ticket.save()
    const {body: order} = await request(app)
        .post('/api/v1/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201)
    await request(app)
        .delete(`/api/v1/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it.todo('emits an order cancelled event')
