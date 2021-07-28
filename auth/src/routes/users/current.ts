import express from 'express';
import {currentUser} from '@yolanmq/common'

console.log("toto")
const router = express.Router();
router.get('/api/v1/users/current',
    currentUser,
    (req, res) =>
        res.send({currentUser: req.currentUser || null}));
export {router as currentUserRouter};
