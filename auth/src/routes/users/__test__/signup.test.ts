import request from 'supertest';
import {app} from '../../../app'


it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/v1/users/signup')
        .send({
            "email": "some@email.com",
            "password": "password"
        })
        .expect(201)
})
it('returns a 400 on signup with wrongly formatted email', async () => {
    return request(app)
        .post('/api/v1/users/signup')
        .send({
            "email": "notanemail.com",
            "password": "password"
        })
        .expect(400)
})
it('returns a 400 on signup with non secure enough password', async () => {
    return request(app)
        .post('/api/v1/users/signup')
        .send({
            "email": "som1@email.com",
            "password": "2short"
        })
        .expect(400)
})
it('returns a 400 with missing email and password on signup', async () => {
    await request(app)
        .post('/api/v1/users/signup')
        .send({email: 'some@mail.com'})
        .expect(400)
    return request(app)
        .post('/api/v1/users/signup')
        .send({'password': 'password'})
        .expect(400)
})

it('disallows duplicate emails on signup', async () => {
    await request(app)
        .post('/api/v1/users/signup')
        .send({
            'email': 'some@email.com',
            'password': 'password'
        })
        .expect(201)
    await request(app)
        .post('/api/v1/users/signup')
        .send({
            'email': 'some@email.com',
            'password': 'password'
        })
        .expect(400)
})

it('set a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/v1/users/signup')
        .send({
            'email': 'some@email.com',
            'password': 'password'
        })
        .expect(201)
    expect(response.get("Set-Cookie")).toBeDefined()
})
