import express from 'express';
import json from 'express';
import {currentUserRouter} from './routes/users/current'
import {loginRouter} from './routes/users/login'
import {logoutRouter} from './routes/users/logout'
import {signupRouter} from './routes/users/signup'

const port = 3000
const app = express();
app.use(json())
app.use(currentUserRouter)
app.use(signupRouter)
app.use(logoutRouter)
app.use(loginRouter)

app.listen(port, () => console.log("listening on port ", port));
