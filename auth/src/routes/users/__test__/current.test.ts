import request from 'supertest';
import {app} from '../../../app'

it('should send the current logged user', async () => {
    const cookie = await global.login()
    const response = await request(app)
        .get('/api/v1/users/current')
        .set('Cookie', cookie)
        .send()
        .expect(200)
    expect(response.body.currentUser.email).toEqual("test@test.com")
})

it('should not get any current user if not logged in', async () => {
    const response = await request(app)
        .get('/api/v1/users/current')
        .send()
        .expect(200)
    expect(response.body.currentUser).toBeNull()
})
