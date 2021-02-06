import {NotFoundError} from '@yolanmq/common'
import mongoose from "mongoose";
import { app } from "./app";

const port = 3000
const start = async () => {
    console.log("Starting [authentification] Service...🥰")

    if(!process.env.JWT_SECRET_KEY){
        throw new NotFoundError("JWT_SECRET_KEY MISSING IN ENV")
    }
    if(!process.env.MONGO_URI){
        throw new NotFoundError("MONGO_URI MISSING IN ENV")
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }
        )
        console.log("Connected to mongo (auth microservices)")
    } catch (err) {
        console.log(err)
    }

}
app.listen(port, () => console.log("listening on port ", port));
start().then(() => console.log("🥳🥳🥳🥳🥳"))
