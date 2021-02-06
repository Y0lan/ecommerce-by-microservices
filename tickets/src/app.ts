import express from 'express';
import 'express-async-errors'
import mongoose from 'mongoose';
import cookieSession from "cookie-session";
import {errorHandler, NotFoundError, currentUser} from '@yolanmq/common'
import {createTicketRouter} from "./routes/new";
import { showTicketRouter } from "./routes/show";
import {indexTicketRouter} from "./routes/index";
import {updateTicketRouter} from "./routes/update";

const bodyParser = require('body-parser')
const app = express();
app.set('trust proxy', true);
app.use(bodyParser.json())
app.use(cookieSession({
    signed: false,
    secure: false,
}));
app.use(currentUser)
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);
app.all('*', (req, res) => {
    throw new NotFoundError();
})
app.use(errorHandler)
export {app};
