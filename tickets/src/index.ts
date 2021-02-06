import {NotFoundError} from '@yolanmq/common'
import mongoose from "mongoose";
import {app} from "./app";
import {natsWrapper} from "./nats-wrapper";
import {OrderCreatedListener} from "./events/listeners/order-created-listener";
import {OrderCancelledListener} from "./events/listeners/order-cancelled-listener";

const port = 3000
const start = async () => {
    console.log("Starting tickets Microservice...")
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

        new OrderCreatedListener(natsWrapper.client).listen()
        new OrderCancelledListener(natsWrapper.client).listen()

        await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }
        )
        console.log("Connected to mongo (tickets micro service)")

    } catch (error) {
        console.error(error)
    }

}
app.listen(port, () => console.log("listening on port ", port));
start().then(() => console.log("🥳🥳🥳🥳🥳"))
