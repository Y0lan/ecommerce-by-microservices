import express from 'express';
import 'express-async-errors'
import mongoose from 'mongoose';
import cookieSession from "cookie-session";
import {errorHandler, NotFoundError, currentUser} from '@yolanmq/common'
import {createJobRouter} from "./routes/new";
import { showJobRouter } from "./routes/show";
import {indexJobRouter} from "./routes/index";
import {updateJobRouter} from "./routes/update";

const bodyParser = require('body-parser')
const app = express();
app.set('trust proxy', true);
app.use(bodyParser.json())
app.use(cookieSession({
    signed: false,
    secure: process.env.IS_SECURE === 'true',
}));
app.use(currentUser)
app.use(createJobRouter);
app.use(showJobRouter);
app.use(indexJobRouter);
app.use(updateJobRouter);
app.all('*', (req, res) => {
    throw new NotFoundError();
})
app.use(errorHandler)
export {app};
