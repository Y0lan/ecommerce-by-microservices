import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import generateID from "../utils/generateID";
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      login(id?: string): string[];
    }
  }
}

jest.mock('../nats-wrapper');
// TODO: don't keep in production
process.env.STRIPE_KEY = 'sk_test_51HLCw8Clba6dgGKLDncY9gZlBjQwCEcP3uHeJHYbOQdEIIGkVw2qXgwlNiLAbHf2aVaMmwboGGH6Rv2QBoleVaLS00ZNELD1iP';

let mongo: any;
beforeAll(async () => {
  process.env.JWT_SECRET_KEY = 'asdfasdf';
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

global.login= (id?: string) => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: id || generateID(),
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
