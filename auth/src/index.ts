import express from 'express';
import 'express-async-errors'
import mongoose from 'mongoose';

const bodyParser = require('body-parser')
import {currentUserRouter} from './routes/users/current'
import {loginRouter} from './routes/users/login'
import {logoutRouter} from './routes/users/logout'
import {signupRouter} from './routes/users/signup'
import {errorHandler} from './middlewares/error-handler'
import {NotFoundError} from './errors/not-found-error'


const port = 3000
const app = express();
app.use(bodyParser.json())
app.use(signupRouter)
app.use(currentUserRouter)
app.use(logoutRouter)
app.use(loginRouter)
app.all('*', (req, res) => {
    throw new NotFoundError();
})
app.use(errorHandler)


const start = async () => {
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
start();
