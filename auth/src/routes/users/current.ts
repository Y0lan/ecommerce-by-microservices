import express from 'express';

const router = express.Router();
router.get('/api/v1/users/current', (req, res) => {
    res.send("Get current user")
})

export {router as currentUserRouter};
