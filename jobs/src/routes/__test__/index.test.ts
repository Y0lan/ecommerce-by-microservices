import request from 'supertest'
import {app} from "../../app";

const createJob = (title: string, price: number) => {
    return request(app)
        .post('/api/v1/jobs')
        .set('Cookie', global.login())
        .send({
            title,
            price
        })
}
it('can fetch a list of jobs', async () => {
    await createJob("job1", 10)
    await createJob("job2", 20)
    await createJob("job3", 30)
    const response = await request(app)
        .get('/api/v1/jobs')
        .send()
        .expect(200)

    expect(response.body.length).toEqual(3)
})
