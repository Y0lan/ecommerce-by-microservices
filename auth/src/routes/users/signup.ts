import express from 'express';

const router = express.Router();
router.post('/api/v1/users/signup', (req, res) => {
    res.send("signup")
})
export {router as signupRouter};
