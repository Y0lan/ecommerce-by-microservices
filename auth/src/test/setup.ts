import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from "mongoose";
import {app} from "../app";
import request from "supertest";
const mongo: any = new MongoMemoryServer();

declare global {
    namespace NodeJS {
        interface Global {
            getAuthCookie(): Promise<string[]>
        }
    }
}


beforeAll(async () => {
    process.env.JWT_SECRET_KEY = 'secret'
    process.env.NODE_ENV = 'test'
    const mongoUri = await mongo.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections()
    for (const collection of collections) {
        await collection.deleteMany({});
    }
})

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
    process.env.NODE_ENV = 'prod'
})

global.getAuthCookie = async () => {
    const email = "some@email.com"
    const password = "password"
    const response = await request(app)
        .post('/api/v1/users/signup')
        .send({email, password})
        .expect(201)
    return  response.get('Set-Cookie')
}
