import express from 'express';
import 'express-async-errors'
import cookieSession from "cookie-session";

const bodyParser = require('body-parser')
import {currentUserRouter} from './routes/users/current'
import {loginRouter} from './routes/users/login'
import {logoutRouter} from './routes/users/logout'
import {signupRouter} from './routes/users/signup'
import {errorHandler, NotFoundError} from '@yolanmq/common'
const app = express();
// proxy for ingress-nginx
app.set('trust proxy', true);
app.use(bodyParser.json())
app.use(cookieSession({
    signed: false,
}));
app.use(signupRouter)
app.use(currentUserRouter)
app.use(logoutRouter)
app.use(loginRouter)
app.all('*', (req, res) => {
    throw new NotFoundError();
})
app.use(errorHandler)
export {app};
