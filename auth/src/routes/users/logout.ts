import express from 'express';

const router = express.Router();
router.post('/api/v1/users/logout', (req, res) => {
    res.send("logout")
})
export {router as logoutRouter};
