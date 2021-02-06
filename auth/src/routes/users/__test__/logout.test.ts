import request from 'supertest';
import {app} from '../../../app'

it('set a cookie after successful login', async () => {
    const cookie = await global.login()

    const response = await request(app)
        .get('/api/v1/users/current')
        .set('Cookie', cookie)
        .send()
        .expect(200)

    expect(response.body.currentUser.email).toEqual("test@test.com")
})

