import express from 'express';
import {currentUser} from "../../middlewares/current-user";
import {requireAuth} from "../../middlewares/require-auth";

const router = express.Router();
router.get('/api/v1/users/current',
    currentUser,
    requireAuth,
    (req, res) =>
        res.send({currentUser: req.currentUser || "no user authenticated"}));
export {router as currentUserRouter};
