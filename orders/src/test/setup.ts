import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import generateMongooseID from "../utils/generateID";
declare global {
    namespace NodeJS {
        interface Global {
            login(): string[];
        }
    }
}

jest.mock('../nats-wrapper')
let mongo: any;
beforeAll(async () => {
    process.env.JWT_SECRET_KEY = 'fakekey';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.login = () => {
    const payload = {
        id: generateMongooseID(),
        email: 'fakeemail@example.com'
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!)
    const session = { jwt: token}
    const sessionJSON = JSON.stringify(session)
    const base64 = Buffer.from(sessionJSON).toString('base64')
    return [`express:sess=${base64}`]
};
