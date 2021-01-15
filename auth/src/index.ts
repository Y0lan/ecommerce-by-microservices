import express from 'express';
import json from 'express';
const port = 3000
const app = express();
app.use(json())
app.listen(port, () => console.log("listening on port", port));
