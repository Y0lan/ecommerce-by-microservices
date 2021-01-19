import {NotFoundError} from "./errors/not-found-error";
import mongoose from "mongoose";
import { app } from "./app";

const port = 3000
const start = async () => {

    if(!process.env.JWT_SECRET_KEY){
        throw new NotFoundError("JWT_SECRET_KEY MISSING IN ENV")
    }
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }
        )
        console.log("Connected to mongo")
    } catch (err) {
        console.log(err)
    }

}
app.listen(port, () => console.log("listening on port ", port));
start().then(() => console.log("🥳🥳🥳🥳🥳"))
