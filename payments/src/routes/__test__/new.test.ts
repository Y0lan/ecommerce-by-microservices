import generateID from "../../utils/generateID";
import request from 'supertest';
import { OrderStatus } from '@yolanmq/common';
import { app } from '../../app';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/v1/payments')
    .set('Cookie', global.login())
    .send({
      token: generateID(),
      orderId: generateID(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: generateID(),
    userId: generateID(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/v1/payments')
    .set('Cookie', global.login())
    .send({
      token: generateID(),
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = generateID();
  const order = Order.build({
    id: generateID(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/v1/payments')
    .set('Cookie', global.login(userId))
    .send({
      orderId: order.id,
      token: generateID(),
    })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = generateID();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: generateID(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/v1/payments')
    .set('Cookie', global.login(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('eur');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();
});
