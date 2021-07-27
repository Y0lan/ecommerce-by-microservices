import express from 'express';
import {currentUser} from '@yolanmq/common'

const router = express.Router();
console.log("ddd")
router.get('/api/v1/users/current',
    currentUser,
    (req, res) =>
        res.send({currentUser: req.currentUser || null}));
export {router as currentUserRouter};
