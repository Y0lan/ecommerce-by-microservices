import express, {Request, Response} from 'express';
import jwt from "jsonwebtoken";

import {body} from 'express-validator'
import {validateRequest, BadRequestError} from '@yolanmq/common'
import {User} from "../../models/user";
import {PasswordManager} from "../../services/passwordManager";

const router = express.Router();
router.post('/api/v1/users/login',
    [
        body('email')
            .isEmail()
            .withMessage("Please enter a valid email address"),
        body('password')
            .trim()
            .notEmpty()
            .withMessage("Please enter a password")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) throw new BadRequestError(`User ${req.body.email} not found in database`)
        const passwordsMatches = await PasswordManager.compare(
            user.password,
            password
        )
        if(!passwordsMatches) throw new BadRequestError(`the password given for ${email} does not match the one in database`)
        const user_jwt = jwt.sign({
            id: user.id,
            email: user.email,
        }, process.env.JWT_SECRET_KEY!)
        req.session = {
            jwt: user_jwt
        }
        res.send(user)
    })

export {router as loginRouter};
