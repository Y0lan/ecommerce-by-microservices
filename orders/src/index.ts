import {NotFoundError} from '@yolanmq/common'
import mongoose from "mongoose";
import {app} from "./app";
import {natsWrapper} from "./nats-wrapper";
import { JobCreatedListener } from './events/listeners/job-created-listener';
import { JobUpdatedListener } from './events/listeners/job-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import {PaymentCreatedListener} from "./events/listeners/payment-created-listener";


const port = 3000
const start = async () => {

    console.log("Starting [orders] Microservice... 🥰")
    if (!process.env.JWT_SECRET_KEY) throw new NotFoundError("JWT_SECRET_KEY MISSING IN ENV")
    if (!process.env.MONGO_URI) throw new NotFoundError("MONGO_URI MISSING IN ENV")
    if (!process.env.NATS_URL) throw new NotFoundError("NATS_URL MISSING IN ENV")
    if (!process.env.NATS_CLUSTER_ID) throw new NotFoundError("NATS_CLUSTER_ID MISSING IN ENV")
    if (!process.env.NATS_CLIENT_ID) throw new NotFoundError("NATS_CLIENT_ID MISSING IN ENV")
    try {

        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed')
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())
        new JobCreatedListener(natsWrapper.client).listen();
        new JobUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();
        await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }
        )
        console.log("Connected to mongo (jobs micro service)")

    } catch (error) {
        console.error(error)
    }

}
app.listen(port, () => console.log("listening on port ", port));
start().then(() => console.log("🥳🥳🥳🥳🥳"))
