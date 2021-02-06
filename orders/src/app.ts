import express from 'express';
import 'express-async-errors'
import mongoose from 'mongoose';
import cookieSession from "cookie-session";
import {errorHandler, NotFoundError, currentUser} from '@yolanmq/common'
import {newOrderRouter} from "./routes/new";
import { deleteOrderRouter } from "./routes/delete";
import {indexOrderRouter} from "./routes";
import {showOrderRouter} from "./routes/show";

const bodyParser = require('body-parser')
const app = express();
app.set('trust proxy', true);
app.use(bodyParser.json())
app.use(cookieSession({
    signed: false,
    secure: false,
}));
app.use(currentUser)
app.use(newOrderRouter);
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.all('*', (req, res) => {
    throw new NotFoundError();
})
app.use(errorHandler)
export {app};
