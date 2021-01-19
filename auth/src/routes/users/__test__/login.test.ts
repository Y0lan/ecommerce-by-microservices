import request from 'supertest';
import {app} from '../../../app'


it('returns a 200 on successful login', async () => {
    await request(app)
        .post('/api/v1/users/signup')
        .send({
            "email": "some@email.com",
            "password": "password"
        })
        .expect(201)
    await request(app)
        .post('/api/v1/users/login')
        .send({
            "email": "some@email.com",
            "password": "password"
        })
        .expect(200)
})

it('set a cookie after successful login', async () => {
    await request(app)
        .post('/api/v1/users/signup')
        .send({
            "email": "some@email.com",
            "password": "password"
        })
        .expect(201)
    const response = await request(app)
        .post('/api/v1/users/login')
        .send({
            'email': 'some@email.com',
            'password': 'password'
        })
        .expect(200)
        expect(response.get("Set-Cookie")).toBeDefined()
})

it('returns a 400 on login with wrongly formatted email', async () => {
    await request(app)
        .post('/api/v1/users/signup')
        .send({
            "email": "some@email.com",
            "password": "password"
        })
        .expect(201)
    return request(app)
        .post('/api/v1/users/login')
        .send({
            "email": "notanemail.com",
            "password": "password"
        })
        .expect(400)
})
it('returns a 400 on login with incorrect password', async () => {
    await request(app)
        .post('/api/v1/users/signup')
        .send({
            "email": "some@email.com",
            "password": "password"
        })
        .expect(201)
    return request(app)
        .post('/api/v1/users/login')
        .send({
            "email": "some@email.com",
            "password": "incorrectpassword"
        })
        .expect(400)
})
it('returns a 400 on login with missing email and password', async () => {
    await request(app)
        .post('/api/v1/users/signup')
        .send({
            "email": "some@email.com",
            "password": "password"
        })
        .expect(201)
    await request(app)
        .post('/api/v1/users/login')
        .send({email: 'some@mail.com'})
        .expect(400)
    return request(app)
        .post('/api/v1/users/signup')
        .send({
            'password': 'password'
        })
        .expect(400)
})

