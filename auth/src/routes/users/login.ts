import express from 'express';

const router = express.Router();
router.post('/api/v1/users/login', (req, res) => {
    res.send("login")
})

export {router as loginRouter};
